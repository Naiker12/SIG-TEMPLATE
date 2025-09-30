import sys
import os
from fastapi import FastAPI
from app.routers.compress_router import compress_router
from app.routers.convert_to_pdf_router import convert_to_pdf_router
from app.routers.split_pdf_router import split_pdf_router
from app.routers.merge_pdf_router import merge_pdf_router
from app-routers.pdf_to_word_router import pdf_to_word_router
from app.routers.auth_router import auth_router
from app.routers.file_router import file_router
from app.core.middleware import setup_cors
from db.database import prisma

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = FastAPI(title="File Processor API")

# Configuramos CORS
setup_cors(app)

@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

# Registrar routers
app.include_router(compress_router)
app.include_router(convert_to_pdf_router)
app.include_router(split_pdf_router)
app.include_router(merge_pdf_router)
app.include_router(pdf_to_word_router)
app.include_router(auth_router)
app.include_router(file_router)
