import os
import uuid
import pandas as pd
from fastapi import UploadFile, HTTPException, status
from io import BytesIO
import httpx

from app import schemas
from db.database import prisma
from db.supabase_client import supabase


async def process_and_save_file(file: UploadFile, user_id: str) -> schemas.FileMetadata:
    """
    Sube un archivo a Supabase Storage, extrae sus metadatos usando pandas
    y registra la información en la base de datos.
    
    Args:
        file: El archivo subido desde el endpoint de FastAPI.
        user_id: El ID del usuario que sube el archivo.

    Returns:
        El objeto de metadatos del archivo creado.
        
    Raises:
        HTTPException: Si el tipo de archivo no es soportado o si ocurre un error.
    """
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ['.csv', '.xlsx']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo de archivo no soportado. Sube un .csv o .xlsx."
        )

    content = await file.read()
    file_size = len(content)

    # Subir el archivo a Supabase Storage
    unique_filename = f"{user_id}/{uuid.uuid4()}{file_extension}"
    supabase_bucket = "file"  # Nombre del bucket en Supabase

    try:
        # La librería de Supabase espera bytes
        supabase.storage.from_(supabase_bucket).upload(
            path=unique_filename,
            file=content,
            file_options={"content-type": file.content_type}
        )
        # Obtener la URL pública del archivo subido
        file_path = supabase.storage.from_(supabase_bucket).get_public_url(unique_filename)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"No se pudo subir el archivo a Supabase: {e}"
        )

    # Procesar el archivo con pandas para extraer metadatos
    try:
        file_stream = BytesIO(content)
        if file_extension == '.csv':
            df = pd.read_csv(file_stream)
        else:  # .xlsx
            df = pd.read_excel(file_stream)
        
        columns = df.columns.tolist()
        rows_count = len(df)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"No se pudo procesar el contenido del archivo: {e}"
        )

    # Guardar metadatos en la base de datos
    file_metadata_db = await prisma.filemetadata.create(
        data={
            "filename": file.filename,
            "filetype": file.content_type,
            "filepath": file_path,  # Guardamos la URL pública de Supabase
            "columns": columns,
            "rows_count": rows_count,
            "size": file_size,
            "userId": user_id,
        }
    )
    
    # Convertir el modelo Prisma a esquema Pydantic
    return schemas.FileMetadata.model_validate(file_metadata_db)


async def get_file_analysis(file_id: str, user_id: str) -> schemas.AnalysisResult:
    """
    Analiza un archivo previamente subido para obtener estadísticas descriptivas.
    Descarga el archivo desde la URL de Supabase y lo carga en memoria para el análisis.
    """
    file_metadata = await prisma.filemetadata.find_unique(where={"id": file_id})
    if not file_metadata or file_metadata.userId != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado o no tienes permiso para acceder a él."
        )

    try:
        file_path_url = file_metadata.filepath
        
        async with httpx.AsyncClient() as client:
            response = await client.get(file_path_url)
            response.raise_for_status()  # Asegurarse de que la descarga fue exitosa
            file_content = response.content

        file_stream = BytesIO(file_content)
        file_extension = os.path.splitext(file_path_url)[1].lower()

        if '.csv' in file_extension:
            df = pd.read_csv(file_stream)
        elif '.xlsx' in file_extension:
            df = pd.read_excel(file_stream, engine='openpyxl')
        else:
            raise HTTPException(status_code=400, detail="Formato de archivo no soportado para análisis.")

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"No se pudo descargar el archivo desde Supabase para análisis: {e.response.status_code}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"No se pudo leer o procesar el archivo para análisis: {e}"
        )

    # Realizar análisis básico
    numerical_cols = df.select_dtypes(include=['number']).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    
    basic_stats = df[numerical_cols].describe().to_dict() if numerical_cols else {}

    return schemas.AnalysisResult(
        columns=df.columns.tolist(),
        numerical_columns=numerical_cols,
        categorical_columns=categorical_cols,
        total_rows=len(df),
        basic_stats=basic_stats
    )
