# /backend/app/routers/analysis_router.py

from fastapi import APIRouter, Depends, File, UploadFile, status
from app.services import analysis_service
from app.services.auth_service import get_current_user
from app import schemas

analysis_router = APIRouter()

@analysis_router.post(
    "/upload",
    response_model=schemas.UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Subir y procesar un archivo para análisis"
)
async def upload_file_for_analysis(
    file: UploadFile = File(...),
    current_user: schemas.User = Depends(get_current_user)
):
    """
    Sube un archivo (CSV o Excel), lo guarda en el servidor, extrae sus metadatos
    (columnas, número de filas, etc.) y lo registra en la base de datos.
    
    - **file**: El archivo a subir.
    
    Devuelve los metadatos del archivo procesado.
    """
    file_metadata = await analysis_service.process_and_save_file(file, current_user.id)
    return {
        "message": "Archivo subido y procesado con éxito.",
        "file_metadata": file_metadata
    }

@analysis_router.get(
    "/analyze/{file_id}",
    response_model=schemas.AnalysisResult,
    summary="Obtener análisis básico de un archivo"
)
async def get_analysis(
    file_id: str,
    current_user: schemas.User = Depends(get_current_user)
):
    """
    Realiza un análisis básico sobre un archivo ya subido, identificado por su `file_id`.
    
    - **file_id**: El ID del `FileMetadata` del archivo.
    
    Devuelve un resumen que incluye:
    - Lista de todas las columnas.
    - Columnas numéricas y categóricas identificadas.
    - Estadísticas descriptivas básicas para las columnas numéricas (media, std, min, max, etc.).
    """
    analysis_data = await analysis_service.get_file_analysis(file_id, current_user.id)
    return analysis_data
