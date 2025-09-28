from fastapi import APIRouter, File, UploadFile, Form
from typing import List
from fastapi.responses import FileResponse
from app.services.compress_service import compress_files

compress_router = APIRouter(prefix="/files", tags=["Compress"])

@compress_router.post("/compress-files")
async def upload(
    files: List[UploadFile] = File(...),
    compression_level: int = Form(5)
):
    """
    Recibe archivos subidos, los comprime en un ZIP y devuelve el archivo ZIP.
    """
    zip_path = await compress_files(files)
    return FileResponse(
        path=zip_path,
        filename="archivos_comprimidos.zip",
        media_type="application/zip"
    )
