
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from app import schemas
from db.database import prisma
from app.services.auth_service import (
    verify_password, 
    create_access_token, 
    get_password_hash,
    get_current_user
)
from app.core.config import settings

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

#Enpoide of register
@auth_router.post("/register", response_model=schemas.User)
async def register_user(user: schemas.UserCreate):
    db_user = await prisma.user.find_unique(where={"email": user.email})
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Find the default 'USER' role, or create it if it doesn't exist
    user_role = await prisma.role.find_unique(where={"name": "USER"})
    if not user_role:
        try:
            user_role = await prisma.role.create(data={"name": "USER"})
        except Exception as e:
             raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Could not create default 'USER' role: {e}"
            )

    hashed_password = get_password_hash(user.password)
    
    new_user_data = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "roleId": user_role.id
    }

    new_user = await prisma.user.create(data=new_user_data)
    
    # To match the response model, we fetch the created user with its role
    created_user_with_role = await prisma.user.find_unique(
        where={"id": new_user.id},
        include={"role": True}
    )
    if not created_user_with_role:
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve created user."
        )

    return created_user_with_role

#Enpoide of login
@auth_router.post("/login", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticates a user and returns a JWT access token.
    """
    user = await prisma.user.find_unique(
        where={"email": form_data.username},
        include={"role": True}
    )
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.name if user.role else "USER"},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@auth_router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    """
    Returns the data of the currently authenticated user.
    """
    return current_user

@auth_router.put("/me", response_model=schemas.User)
async def update_user_me(
    user_update: schemas.UserUpdate, 
    current_user: schemas.User = Depends(get_current_user)
):
    """
    Updates the current user's profile information.
    """
    update_data = user_update.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No update data provided")

    updated_user = await prisma.user.update(
        where={"id": current_user.id},
        data=update_data,
        include={"role": True}
    )
    return updated_user

@auth_router.put("/me/password")
async def update_password_me(
    password_update: schemas.PasswordUpdate,
    current_user: schemas.User = Depends(get_current_user)
):
    """
    Updates the current user's password.
    """
    if not verify_password(password_update.current_password, current_user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect current password")
    
    if not password_update.new_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New password cannot be empty")

    hashed_password = get_password_hash(password_update.new_password)
    
    await prisma.user.update(
        where={"id": current_user.id},
        data={"password": hashed_password}
    )
    
    return {"message": "Password updated successfully"}
