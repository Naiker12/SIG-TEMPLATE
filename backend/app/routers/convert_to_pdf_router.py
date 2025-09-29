from fastapi import APIRouter, File, UploadFile, BackgroundTasks
from typing import List
from fastapi.responses import FileResponse, Response
from app.services.convert_to_pdf_service import convert_files_to_pdf_service, cleanup_temp_folder
import os

convert_to_pdf_router = APIRouter(prefix="/files", tags=["Convert"])

@convert_to_pdf_router.post("/convert-to-pdf")
async def convert_to_pdf(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...)
):
    """
    Recibe archivos (DOCX, JPG, PNG, etc.) y los convierte a PDF.
    - Si es un solo archivo, devuelve el PDF.
    - Si son varios, los comprime en un ZIP y devuelve el ZIP.
    """
    result_path, temp_folder_path, is_zip = await convert_files_to_pdf_service(files)
    
    # Programar la eliminación del archivo y la carpeta temporal
    background_tasks.add_task(os.remove, result_path)
    if temp_folder_path:
        background_tasks.add_task(cleanup_temp_folder, temp_folder_path)

    if is_zip:
        return FileResponse(
            path=result_path,
            filename="archivos_convertidos.zip",
            media_type="application/zip"
        )
    else:
        # Extraer el nombre original para el PDF
        original_filename = files[0].filename
        pdf_filename = f"{os.path.splitext(original_filename)[0]}.pdf"
        return FileResponse(
            path=result_path,
            filename=pdf_filename,
            media_type="application/pdf"
        )
