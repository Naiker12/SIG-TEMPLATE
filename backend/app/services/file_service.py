from typing import List
from app import schemas
from db.database import prisma

async def create_file_for_user(file_data: schemas.FileCreate, user_id: str):
    """
    Saves file metadata to the database for a specific user.
    """
    new_file = await prisma.file.create( 
        data={
            **file_data.model_dump(),
            "userId": user_id,
        }
    )
    return new_file


async def get_files_by_user(user_id: str, skip: int = 0, limit: int = 100) -> List:
    """
    Retrieves all file metadata for a specific user, ordered by creation date.
    """
    files = await prisma.file.find_many( 
        where={"userId": user_id},
        skip=skip,
        take=limit,
        order={"createdAt": "desc"} 
    )
    return files
