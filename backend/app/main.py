from fastapi import FastAPI
from app.routers.compress_router import compress_router
from app.routers.convert_to_pdf_router import convert_to_pdf_router
from app.routers.split_pdf_router import split_pdf_router
from app.routers.merge_pdf_router import merge_pdf_router
from app.core.middleware import setup_cors 

app = FastAPI(title="File Processor API")

# Configuramos CORS
setup_cors(app)

# Registrar routers
app.include_router(compress_router)
app.include_router(convert_to_pdf_router)
app.include_router(split_pdf_router)
app.include_router(merge_pdf_router)
