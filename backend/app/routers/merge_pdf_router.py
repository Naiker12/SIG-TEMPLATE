from fastapi import APIRouter, File, UploadFile, BackgroundTasks
from typing import List
from fastapi.responses import FileResponse
from app.services.merge_pdf_service import merge_pdfs_service
from app.services.compress_service import cleanup_file

merge_pdf_router = APIRouter(prefix="/files", tags=["Merge PDF"])

@merge_pdf_router.post("/merge-pdfs")
async def merge_pdfs_endpoint(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...)
):
    """
    Recibe una lista de archivos PDF, los une en un solo documento
    y devuelve el archivo PDF resultante.
    """
    output_path, temp_folder_path = await merge_pdfs_service(files)
    
    # Programar la eliminación del archivo y la carpeta temporal
    background_tasks.add_task(cleanup_file, path=output_path)
    if temp_folder_path:
        background_tasks.add_task(cleanup_file, path=temp_folder_path, is_dir=True)
    
    return FileResponse(
        path=output_path,
        filename="pdf_unido.pdf",
        media_type="application/pdf"
    )
