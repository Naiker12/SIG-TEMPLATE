from fastapi import APIRouter, Depends, HTTPException, status
from app import schemas
from app.services import file_service
from app.services.auth_service import get_current_user
from typing import List

file_router = APIRouter(prefix="/files", tags=["Files"])

@file_router.post("", response_model=schemas.File, status_code=status.HTTP_201_CREATED)
async def upload_file_metadata(
    file_data: schemas.FileCreate,
    current_user: schemas.User = Depends(get_current_user)
):
    """
    Crea metadatos para un archivo procesado, asociado al usuario actual.
    """
    try:
        created_file = await file_service.create_file_for_user(file_data, current_user.id)
        return created_file
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"No se pudo crear el metadato del archivo: {e}"
        )


@file_router.get("", response_model=List[schemas.File])
async def get_user_files(
    current_user: schemas.User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    """
    Obtiene la lista de archivos del usuario autenticado.
    """
    files = await file_service.get_files_by_user(current_user.id, skip, limit)
    return files
