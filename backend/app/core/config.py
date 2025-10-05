from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Nuevas variables para la conexión con Supabase Storage (ahora opcionales)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None

    class Config:
        # Pydantic-settings leerá automáticamente las variables del entorno del sistema.
        # La carga del archivo .env se manejará explícitamente en main.py para mayor robustez.
        extra = "ignore"

settings = Settings()
