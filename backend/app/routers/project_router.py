# /backend/app/routers/project_router.py

from fastapi import APIRouter, Depends, status, Body
from typing import List
from app.services import project_service
from app.services.auth_service import get_current_user
from app import schemas

project_router = APIRouter()

@project_router.post(
    "/project",
    response_model=schemas.Project,
    status_code=status.HTTP_201_CREATED,
    summary="Guardar un nuevo proyecto de análisis"
)
async def create_project(
    project_data: schemas.ProjectCreate,
    current_user: schemas.User = Depends(get_current_user)
):
    """
    Guarda la configuración de un dashboard como un proyecto.
    
    - **name**: Nombre del proyecto.
    - **description**: Descripción opcional.
    - **fileId**: ID del `FileMetadata` en el que se basa el proyecto.
    - **config**: Objeto JSON con la configuración del dashboard (e.g., gráficos, filtros).
    
    Devuelve el proyecto recién creado.
    """
    new_project = await project_service.create_project_for_user(project_data, current_user.id)
    return new_project

@project_router.get(
    "/project",
    response_model=List[schemas.Project],
    summary="Obtener todos los proyectos del usuario"
)
async def get_projects(
    current_user: schemas.User = Depends(get_current_user)
):
    """
    Obtiene una lista de todos los proyectos de análisis guardados por el usuario autenticado.
    """
    projects = await project_service.get_projects_for_user(current_user.id)
    return projects

@project_router.get(
    "/project/{project_id}",
    response_model=schemas.Project,
    summary="Obtener un proyecto específico por ID"
)
async def get_project(
    project_id: str,
    current_user: schemas.User = Depends(get_current_user)
):
    """
    Obtiene los detalles de un proyecto específico, validando que pertenezca al usuario.
    
    - **project_id**: El ID del proyecto a recuperar.
    """
    project = await project_service.get_project_by_id(project_id, current_user.id)
    return project
