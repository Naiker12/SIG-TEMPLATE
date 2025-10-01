from fastapi import APIRouter, File, UploadFile, Form, BackgroundTasks
from typing import List
from fastapi.responses import FileResponse
from app.services.compress_service import compress_files, cleanup_file
import os

compress_router = APIRouter(prefix="/files", tags=["Compress"])

@compress_router.post("/compress-files")
async def upload(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    compression_level: int = Form(1)
):
    """
    Recibe archivos subidos, los comprime en un ZIP con un nivel de compresión
    específico y devuelve el archivo ZIP.
    - compression_level: 0 (Baja), 1 (Recomendada), 2 (Alta)
    """
    zip_path, temp_folder_path = await compress_files(files, compression_level)
    
    # Programar la eliminación del archivo ZIP y la carpeta temporal después de que la respuesta se envíe
    background_tasks.add_task(cleanup_file, path=zip_path)
    if temp_folder_path:
        background_tasks.add_task(cleanup_file, path=temp_folder_path, is_dir=True)

    return FileResponse(
        path=zip_path,
        filename="archivos_comprimidos.zip",
        media_type="application/zip"
    )
