from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app):
    # Para desarrollo, permitir todos los orígenes es lo más simple.
    # En producción, deberías restringirlo a la URL de tu frontend.
    origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
