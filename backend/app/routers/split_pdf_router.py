from fastapi import APIRouter, File, UploadFile, Form, BackgroundTasks
from fastapi.responses import FileResponse
from app.services.split_pdf_service import split_pdf_service
from app.services.compress_service import cleanup_file

split_pdf_router = APIRouter(prefix="/files", tags=["Split PDF"])

@split_pdf_router.post("/split-pdf")
async def split_pdf_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    ranges: str = Form(...)
):
    """
    Recibe un archivo PDF y un string de rangos (ej. "1-3,5,8-10"),
    extrae las páginas especificadas y devuelve un nuevo archivo PDF.
    """
    output_path = await split_pdf_service(file, ranges)
    
    # Programar la eliminación del archivo generado después de la respuesta
    background_tasks.add_task(cleanup_file, path=output_path)

    return FileResponse(
        path=output_path,
        filename=f"pdf_dividido.pdf",
        media_type="application/pdf"
    )
