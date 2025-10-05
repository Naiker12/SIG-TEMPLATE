
import os
import uuid
import pandas as pd
import polars as pl
import janitor
from fastapi import UploadFile, HTTPException, status
from io import BytesIO

from app import schemas
from db.database import prisma
from db.supabase_client import supabase

LARGE_FILE_THRESHOLD_BYTES = 50 * 1024 * 1024 # 50 MB

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Aplica una limpieza estándar a un DataFrame de pandas."""
    return (
        df
        .clean_names()
        .remove_empty()
    )

def safe_cast_to_int(value):
    """Castea un valor a int de forma segura, manejando nulos."""
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

async def process_and_save_file(file: UploadFile, user_id: str) -> schemas.FileMetadata:
    """
    Sube un archivo a Supabase Storage, extrae sus metadatos usando pandas
    y registra la información en la base de datos.
    """
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ['.csv', '.xlsx', '.xls']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo de archivo no soportado. Sube un .csv o .xlsx."
        )

    content = await file.read()
    file_size = len(content)

    # Subir el archivo a Supabase Storage
    unique_filename = f"{user_id}/{uuid.uuid4()}{file_extension}"
    supabase_bucket = "file"

    try:
        if not supabase:
            raise HTTPException(status_code=503, detail="El servicio de almacenamiento no está configurado.")
            
        supabase.storage.from_(supabase_bucket).upload(
            path=unique_filename,
            file=content,
            file_options={"content-type": file.content_type}
        )
        file_path = supabase.storage.from_(supabase_bucket).get_public_url(unique_filename)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"No se pudo subir el archivo a Supabase: {e}"
        )

    # Procesar el archivo con pandas para extraer metadatos limpios
    try:
        file_stream = BytesIO(content)
        if file_extension == '.csv':
            df = pd.read_csv(file_stream, engine='pyarrow')
        else:
            df = pd.read_excel(file_stream, engine='openpyxl')
        
        # Aplicar limpieza
        cleaned_df = clean_dataframe(df)
        
        columns = cleaned_df.columns.tolist()
        rows_count = len(cleaned_df)

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
            "filepath": file_path,
            "columns": columns,
            "rows_count": rows_count,
            "size": file_size,
            "userId": user_id,
        }
    )
    
    return schemas.FileMetadata.model_validate(file_metadata_db)


async def get_file_analysis(file_id: str, user_id: str) -> schemas.AnalysisResult:
    """
    Analiza un archivo previamente subido para obtener estadísticas descriptivas.
    Descarga el archivo desde Supabase Storage y lo carga en memoria para el análisis,
    usando Polars para archivos grandes.
    """
    file_metadata = await prisma.filemetadata.find_unique(where={"id": file_id})
    if not file_metadata or file_metadata.userId != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado o no tienes permiso para acceder a él."
        )

    try:
        if not supabase:
            raise HTTPException(status_code=503, detail="El servicio de almacenamiento no está configurado.")
             
        supabase_bucket = "file"
        file_path_in_bucket = file_metadata.filepath.split(f'/{supabase_bucket}/')[-1]

        file_content = supabase.storage.from_(supabase_bucket).download(file_path_in_bucket)

        if not file_content:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="El archivo no se encontró en el almacenamiento de Supabase."
            )

        file_stream = BytesIO(file_content)
        use_polars = file_metadata.size > LARGE_FILE_THRESHOLD_BYTES

        if use_polars:
            # Usar Polars para archivos grandes
            df = pl.read_excel(file_stream) if '.xls' in file_path_in_bucket else pl.read_csv(file_stream)
            df = df.janitor.clean_names().to_pandas() # Convertir a pandas para compatibilidad
        else:
            # Usar Pandas para archivos más pequeños
            df = pd.read_excel(file_stream, engine='openpyxl') if '.xls' in file_path_in_bucket else pd.read_csv(file_stream, engine='pyarrow')
            df = clean_dataframe(df)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"No se pudo leer o procesar el archivo para análisis: {e}"
        )

    # Análisis básico
    numerical_cols = df.select_dtypes(include=['number']).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    
    # Solo calcular estadísticas si hay columnas numéricas
    if numerical_cols:
        descriptive_stats = df[numerical_cols].describe()
        basic_stats = descriptive_stats.to_dict()
        # Sanitizar los datos para asegurar compatibilidad con Pydantic
        for col_name, stats in basic_stats.items():
            for stat_key, value in stats.items():
                if pd.notna(value):
                    # Convertir 'count' y otros valores enteros a int nativo de Python
                    if stat_key in ['count']:
                        stats[stat_key] = int(value)
                    else:
                        # Mantener otros valores como float
                        stats[stat_key] = float(value)
                else:
                    # Reemplazar NaN/NaT con None para la serialización JSON
                    stats[stat_key] = None
    else:
        # Si no hay columnas numéricas, devolver un diccionario vacío
        basic_stats = {}

    sample_data = df.head(100).to_dict(orient='records')
    # Reemplazar NaN por None en la muestra para evitar errores de serialización
    for row in sample_data:
        for key, value in row.items():
            if pd.isna(value):
                row[key] = None

    return schemas.AnalysisResult(
        columns=df.columns.tolist(),
        numerical_columns=numerical_cols,
        categorical_columns=categorical_cols,
        total_rows=len(df),
        basic_stats=basic_stats,
        sample_data=sample_data
    )

