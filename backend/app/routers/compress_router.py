from fastapi import APIRouter, File, UploadFile, Form
from typing import List
from fastapi.responses import FileResponse
from app.services.compress_service import compress_files

compress_router = APIRouter(prefix="/files", tags=["Compress"])

@compress_router.post("/compress-files")
async def upload(
    files: List[UploadFile] = File(...),
    compression_level: int = Form(1) # Valor por defecto 1 (Recomendado)
):
    """
    Recibe archivos subidos, los comprime en un ZIP con un nivel de compresión
    específico y devuelve el archivo ZIP.
    - compression_level: 0 (Baja), 1 (Recomendada), 2 (Alta)
    """
    zip_path = await compress_files(files, compression_level)
    return FileResponse(
        path=zip_path,
        filename="archivos_comprimidos.zip",
        media_type="application/zip"
    )
