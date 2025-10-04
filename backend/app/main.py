
import sys
import os
from fastapi import FastAPI
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse

from app.core.middleware import setup_cors
from db.database import prisma
from db.supabase_client import supabase

from app.routers.compress_router import compress_router
from app.routers.convert_to_pdf_router import convert_to_pdf_router
from app.routers.split_pdf_router import split_pdf_router
from app.routers.merge_pdf_router import merge_pdf_router
from app.routers.pdf_to_word_router import pdf_to_word_router
from app.routers.auth_router import auth_router
from app.routers.file_router import file_router
from app.routers.excel_router import excel_router
from app.routers.analysis_router import analysis_router
from app.routers.project_router import project_router

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = FastAPI(title="SIG IA - API de Gestión Documental y Análisis")

# --- Configurar Middleware ---
# IMPORTANTE: CORS debe configurarse ANTES de registrar los routers.
setup_cors(app)

# --- Eventos de Ciclo de Vida ---
@app.on_event("startup")
async def startup():
    """Event handler for application startup."""
    # Crear directorios necesarios si no existen (para herramientas legadas)
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("outputs", exist_ok=True)
    os.makedirs("temp_files", exist_ok=True)
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    """Event handler for application shutdown."""
    await prisma.disconnect()

# --- Manejadores de Excepciones ---
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    """Global exception handler for HTTPExceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# --- Registrar Routers ---

# Routers de herramientas existentes
app.include_router(compress_router)
app.include_router(convert_to_pdf_router)
app.include_router(split_pdf_router)
app.include_router(merge_pdf_router)
app.include_router(pdf_to_word_router)
app.include_router(excel_router)

# Router de autenticación y gestión de archivos
app.include_router(auth_router)
app.include_router(file_router)

# Nuevos routers para el flujo de análisis de datos
app.include_router(analysis_router, prefix="/api", tags=["Análisis de Datos"])
app.include_router(project_router, prefix="/api", tags=["Proyectos de Análisis"])
