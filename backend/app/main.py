from fastapi import FastAPI
from app.routers.compress_router import compress_router
from app.core.middleware import setup_cors 

app = FastAPI(title="File Compressor API")

# Configuramos CORS
setup_cors(app)

# Registrar router
app.include_router(compress_router)
