# /backend/app/services/project_service.py

from typing import List
from fastapi import HTTPException, status
from app import schemas
from db.database import prisma

async def create_project_for_user(project_data: schemas.ProjectCreate, user_id: str) -> schemas.Project:
    """
    Guarda la configuración de un nuevo proyecto de análisis en la base de datos.
    
    Args:
        project_data: Los datos del proyecto a crear.
        user_id: El ID del usuario que crea el proyecto.
        
    Returns:
        El objeto del proyecto creado.
        
    Raises:
        HTTPException: Si el archivo asociado no existe o no pertenece al usuario.
    """
    # Verificar que el archivo base (FileMetadata) existe y pertenece al usuario
    file_metadata = await prisma.filemetadata.find_unique(where={"id": project_data.fileId})
    if not file_metadata or file_metadata.userId != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="El archivo base para este proyecto no existe o no te pertenece.")
    
    # Crear el proyecto en la base de datos
    new_project = await prisma.project.create(
        data={
            "name": project_data.name,
            "description": project_data.description,
            "config": project_data.config,
            "userId": user_id,
            "fileId": project_data.fileId,
        }
    )
    
    return schemas.Project.model_validate(new_project)

async def get_projects_for_user(user_id: str) -> List[schemas.Project]:
    """
    Obtiene todos los proyectos de análisis guardados por un usuario.
    
    Args:
        user_id: El ID del usuario cuyos proyectos se quieren obtener.
        
    Returns:
        Una lista de objetos de proyecto.
    """
    projects = await prisma.project.find_many(
        where={"userId": user_id},
        order={"updatedAt": "desc"}
    )
    return [schemas.Project.model_validate(p) for p in projects]

async def get_project_by_id(project_id: str, user_id: str) -> schemas.Project:
    """
    Obtiene un proyecto específico por su ID, verificando la propiedad del usuario.
    
    Args:
        project_id: El ID del proyecto a obtener.
        user_id: El ID del usuario solicitante.
        
    Returns:
        El objeto del proyecto.
        
    Raises:
        HTTPException: Si el proyecto no se encuentra o no pertenece al usuario.
    """
    project = await prisma.project.find_unique(where={"id": project_id})
    if not project or project.userId != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyecto no encontrado.")
        
    return schemas.Project.model_validate(project)
