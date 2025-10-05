from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app: FastAPI):
    """
    Configuración del middleware CORS para desarrollo local y red LAN.
    """
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.212:3000", 
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,      
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
