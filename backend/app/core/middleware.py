from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app):
    # En desarrollo, permitir todos los orígenes con "*" es una práctica común
    # para evitar problemas de CORS al cambiar de red o IP.
    # En producción, esto debería ser una lista estricta de dominios permitidos.
    origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
