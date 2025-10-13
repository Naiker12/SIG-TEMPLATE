
from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.preview_service import create_pdf_preview

preview_router = APIRouter(prefix="/files", tags=["Preview"])

@preview_router.post("/pdf-preview")
async def pdf_preview_endpoint(file: UploadFile = File(...)):
    """
    Genera una previsualización de la primera página de un archivo PDF.
    Devuelve una imagen PNG en formato base64.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF.")
    
    try:
        base64_image = await create_pdf_preview(file)
        return {"preview": base64_image}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No se pudo generar la previsualización: {e}")
