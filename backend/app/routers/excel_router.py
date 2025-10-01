
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import List, Dict, Any
from app.services import excel_service
from app.services.auth_service import get_current_user
from app import schemas

excel_router = APIRouter(
    prefix="/excel", 
    tags=["Excel Processing"],
    dependencies=[Depends(get_current_user)]
)

@excel_router.post("/upload")
async def upload(file: UploadFile = File(...)):
    """
    Uploads an Excel file, processes it by duplicating rows based on a 'cantidad' column,
    and returns a file_id for the processed file.
    """
    return await excel_service.upload_excel(file)


@excel_router.get("/preview")
async def preview(file_id: str, page: int = 1, page_size: int = 10):
    """
    Returns a paginated preview of the data from the processed Excel file.
    """
    return excel_service.preview_excel(file_id, page, page_size)


@excel_router.post("/modify")
async def modify(file_id: str, modifications: List[Dict[str, Any]]):
    """
    Modifies specific cells in the Excel file based on a list of modifications.
    """
    return excel_service.modify_excel(file_id, modifications)


@excel_router.get("/download/{file_id}")
async def download(file_id: str):
    """
    Downloads the processed Excel file.
    """
    return excel_service.download_excel(file_id)
