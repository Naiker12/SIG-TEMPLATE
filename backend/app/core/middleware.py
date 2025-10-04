from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app: FastAPI):
    """
    Configura el Cross-Origin Resource Sharing (CORS) para la aplicación.
    
    En un entorno de desarrollo, es común permitir todos los orígenes para
    facilitar las pruebas desde diferentes direcciones IP locales o servicios
    como Gitpod o Codespaces.
    
    En producción, esta lista de orígenes debería restringirse a los dominios
    específicos desde los que se servirá el frontend.
    """
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*" # Se mantiene para máxima flexibilidad en desarrollo local
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,  # Permite cookies y cabeceras de autenticación
        allow_methods=["*"],     # Permite todos los métodos (GET, POST, etc.)
        allow_headers=["*"],     # Permite todas las cabeceras
    )
