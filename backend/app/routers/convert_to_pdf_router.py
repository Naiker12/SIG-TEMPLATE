from fastapi import APIRouter, File, UploadFile, BackgroundTasks
from typing import List
from fastapi.responses import FileResponse
from app.services.convert_to_pdf_service import convert_files_to_pdf_service
import os

convert_to_pdf_router = APIRouter(prefix="/files", tags=["Convert"])

@convert_to_pdf_router.post("/convert-to-pdf")
async def convert_to_pdf(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...)
):
    """
    Recibe archivos (DOCX, JPG, PNG, etc.), los convierte a PDF,
    los comprime en un ZIP y devuelve el archivo ZIP.
    """
    zip_path, temp_folder_path = await convert_files_to_pdf_service(files)
    
    # Programar la eliminación del archivo ZIP y la carpeta temporal
    background_tasks.add_task(os.remove, zip_path)
    background_tasks.add_task(lambda: __import__('shutil').rmtree(temp_folder_path))

    return FileResponse(
        path=zip_path,
        filename="archivos_convertidos.zip",
        media_type="application/zip"
    )
