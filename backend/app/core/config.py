from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Las variables de Supabase para el almacenamiento de archivos son opcionales.
    # Si no se proveen, las funciones que suben archivos no funcionarán.
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None

    class Config:
        # Pydantic-settings leerá automáticamente las variables del entorno del sistema.
        # La carga explícita del archivo .env se maneja ahora en `main.py` para mayor robustez.
        pass

settings = Settings()
