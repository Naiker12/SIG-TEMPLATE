from fastapi import APIRouter, File, UploadFile, BackgroundTasks
from typing import List
from fastapi.responses import FileResponse
from app.services.pdf_to_word_service import convert_pdfs_to_word_service
from app.services.compress_service import cleanup_file
import os

pdf_to_word_router = APIRouter(prefix="/files", tags=["Convert"])

@pdf_to_word_router.post("/convert-to-word")
async def convert_to_word(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...)
):
    """
    Recibe uno o más archivos PDF y los convierte a formato DOCX.
    - Si es un solo archivo, devuelve el DOCX.
    - Si son varios, los comprime en un ZIP y devuelve el ZIP.
    """
    result_path, temp_folder_path, is_zip = await convert_pdfs_to_word_service(files)
    
    # Programar la eliminación del archivo y la carpeta temporal
    background_tasks.add_task(cleanup_file, path=result_path)
    if temp_folder_path:
        background_tasks.add_task(cleanup_file, path=temp_folder_path, is_dir=True)

    if is_zip:
        return FileResponse(
            path=result_path,
            filename="pdfs_convertidos.zip",
            media_type="application/zip"
        )
    else:
        # Extraer el nombre original para el DOCX
        original_filename = files[0].filename
        docx_filename = f"{os.path.splitext(original_filename)[0]}.docx"
        return FileResponse(
            path=result_path,
            filename=docx_filename,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
