from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Nuevas variables para la conexión con Supabase Storage
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str

    class Config:
        env_file = "backend/.env" 
        extra = "ignore"   

settings = Settings()
