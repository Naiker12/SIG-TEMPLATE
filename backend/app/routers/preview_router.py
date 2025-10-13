
from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from app.services.preview_service import create_pdf_preview, count_pdf_pages

preview_router = APIRouter(prefix="/files", tags=["Preview"])

@preview_router.post("/pdf-preview")
async def pdf_preview_endpoint(
    file: UploadFile = File(...),
    page: int = Query(1, description="The 1-based page number to preview.")
):
    """
    Genera una previsualización de una página específica de un archivo PDF.
    Devuelve una imagen PNG en formato base64.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF.")
    
    try:
        base64_image = await create_pdf_preview(file, page)
        return {"preview": base64_image}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No se pudo generar la previsualización: {e}")

@preview_router.post("/pdf-page-count")
async def pdf_page_count_endpoint(file: UploadFile = File(...)):
    """
    Calcula el número total de páginas en un archivo PDF.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF.")

    try:
        page_count = await count_pdf_pages(file)
        return {"page_count": page_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No se pudo contar las páginas: {e}")
