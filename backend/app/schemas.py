from pydantic import BaseModel, EmailStr
from typing import Optional

# --- Role Schemas ---
class Role(BaseModel):
    name: str
    
    class Config:
        orm_mode = True

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    role: Role

    class Config:
        orm_mode = True

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
