from fastapi import FastAPI
from app.routers.compress_router import compress_router
from app.routers.convert_to_pdf_router import convert_to_pdf_router
from app.routers.split_pdf_router import split_pdf_router
from app.routers.merge_pdf_router import merge_pdf_router
from app.routers.pdf_to_word_router import pdf_to_word_router
from app.routers.auth_router import auth_router
from app.core.middleware import setup_cors 
from app.database import prisma
import subprocess

# --- Prisma Client Generation ---
# This ensures the Prisma client is generated before the app starts.
try:
    subprocess.run(["npx", "prisma", "generate"], check=True)
except subprocess.CalledProcessError as e:
    print(f"Error generating Prisma client: {e}")
except FileNotFoundError:
    print("Error: 'npx' command not found. Make sure Node.js is installed and in your PATH.")

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
