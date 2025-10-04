# /backend/app/services/analysis_service.py

import os
import uuid
import pandas as pd
import aiofiles
from fastapi import UploadFile, HTTPException, status
from app import schemas
from db.database import prisma

UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

async def process_and_save_file(file: UploadFile, user_id: str) -> schemas.FileMetadata:
    """
    Guarda un archivo subido, extrae sus metadatos usando pandas y lo registra en la base de datos.
    
    Args:
        file: El archivo subido desde el endpoint de FastAPI.
        user_id: El ID del usuario que sube el archivo.

    Returns:
        El objeto de metadatos del archivo creado.
        
    Raises:
        HTTPException: Si el tipo de archivo no es soportado o si ocurre un error al procesarlo.
    """
    # Validar tipo de archivo
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ['.csv', '.xlsx']:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tipo de archivo no soportado. Sube un .csv o .xlsx.")

    # Generar un nombre de archivo único para evitar colisiones
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)

    # Guardar el archivo en disco de forma asíncrona
    try:
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
            file_size = len(content)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"No se pudo guardar el archivo: {e}")

    # Procesar el archivo con pandas para extraer metadatos
    try:
        if file_extension == '.csv':
            df = pd.read_csv(file_path)
        else: # .xlsx
            df = pd.read_excel(file_path)
        
        columns = df.columns.tolist()
        rows_count = len(df)

    except Exception as e:
        # Si pandas falla, limpiar el archivo guardado y lanzar error
        os.remove(file_path)
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"No se pudo procesar el archivo: {e}")

    # Guardar metadatos en la base de datos
    file_metadata = await prisma.filemetadata.create(
        data={
            "filename": file.filename,
            "filetype": file.content_type,
            "filepath": file_path,
            "columns": columns,
            "rows_count": rows_count,
            "size": file_size,
            "userId": user_id,
        }
    )
    
    # Convertir el modelo de Prisma a un esquema Pydantic para la respuesta
    return schemas.FileMetadata(
        id=file_metadata.id,
        filename=file_metadata.filename,
        filetype=file_metadata.filetype,
        columns=file_metadata.columns,
        rows_count=file_metadata.rows_count,
        size=file_metadata.size,
        uploadedAt=file_metadata.uploadedAt,
        userId=file_metadata.userId
    )


async def get_file_analysis(file_id: str, user_id: str) -> schemas.AnalysisResult:
    """
    Analiza un archivo previamente subido para obtener estadísticas descriptivas.

    Args:
        file_id: El ID del archivo a analizar (de la tabla FileMetadata).
        user_id: El ID del usuario que solicita el análisis para validación de propiedad.

    Returns:
        Un objeto AnalysisResult con las estadísticas del archivo.
        
    Raises:
        HTTPException: Si el archivo no se encuentra, el usuario no tiene permiso, o falla el análisis.
    """
    # Verificar que el archivo existe y pertenece al usuario
    file_metadata = await prisma.filemetadata.find_unique(where={"id": file_id})
    if not file_metadata or file_metadata.userId != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Archivo no encontrado o no tienes permiso para acceder a él.")

    # Cargar el archivo con pandas
    try:
        file_path = file_metadata.filepath
        file_extension = os.path.splitext(file_path)[1].lower()

        if file_extension == '.csv':
            df = pd.read_csv(file_path)
        else: # .xlsx
            df = pd.read_excel(file_path)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"No se pudo leer el archivo para análisis: {e}")

    # Realizar el análisis
    numerical_cols = df.select_dtypes(include=['number']).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    
    # Obtener estadísticas básicas para columnas numéricas
    basic_stats = df[numerical_cols].describe().to_dict()

    return schemas.AnalysisResult(
        columns=df.columns.tolist(),
        numerical_columns=numerical_cols,
        categorical_columns=categorical_cols,
        total_rows=len(df),
        basic_stats=basic_stats
    )
