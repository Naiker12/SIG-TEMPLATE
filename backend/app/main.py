# backend/app/main.py

import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Cargar las variables de entorno desde backend/.env ANTES de importar otros módulos que las necesiten.
# Esto asegura que la DATABASE_URL y otras claves estén disponibles globalmente.
# La ruta se construye de forma robusta para encontrar el .env en la carpeta 'backend'.
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# Ahora se pueden importar los módulos que dependen de la configuración
from app.core.middleware import setup_cors
from db.database import prisma

# Routers
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

# Añadir el root del proyecto al path de Python
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ----------------------------
# Eventos de ciclo de vida (Lifespan)
# ----------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Código que se ejecuta al iniciar la aplicación
    print("INFO:     Iniciando la aplicación...")
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("outputs", exist_ok=True)
    os.makedirs("temp_files", exist_ok=True)
    await prisma.connect()
    print("INFO:     Conexión a la base de datos establecida.")
    
    yield
    
    # Código que se ejecuta al apagar la aplicación
    print("INFO:     Apagando la aplicación...")
    await prisma.disconnect()
    print("INFO:     Conexión a la base de datos cerrada.")


app = FastAPI(
    title="SIG IA - API de Gestión Documental y Análisis",
    lifespan=lifespan
)

# ----------------------------
# Configuración de Middleware
# ----------------------------
setup_cors(app)

# ----------------------------
# Manejo global de excepciones
# ----------------------------
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# ----------------------------
# Registrar routers
# ----------------------------

# Routers de la nueva arquitectura con prefijo /api
app.include_router(auth_router, prefix="/api")
app.include_router(file_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(project_router, prefix="/api")

# Herramientas legadas (mantener sin prefijo /api si el frontend las llama así directamente)
app.include_router(compress_router)
app.include_router(convert_to_pdf_router)
app.include_router(split_pdf_router)
app.include_router(merge_pdf_router)
app.include_router(pdf_to_word_router)
app.include_router(excel_router)
