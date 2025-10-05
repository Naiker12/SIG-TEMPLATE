# /backend/db/supabase_client.py

from supabase import create_client, Client
from app.core.config import settings

# Inicializamos el cliente como None por defecto.
supabase: Client | None = None

# Solo intentamos crear el cliente si las variables de entorno necesarias están presentes.
if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
    try:
        # Intenta inicializar el cliente de Supabase con las credenciales del entorno.
        supabase = create_client(
            supabase_url=settings.SUPABASE_URL,
            supabase_key=settings.SUPABASE_ANON_KEY
        )
    except Exception as e:
        # Si las variables de entorno están presentes pero fallan, es un error de configuración.
        print(f"ERROR: No se pudo inicializar el cliente de Supabase. Revisa que tus variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY sean correctas en el archivo backend/.env.")
        print(f"Detalle del error: {e}")
        supabase = None
else:
    # Mensaje informativo si las variables no están configuradas. La app arrancará, pero las funciones que usan Supabase Storage no funcionarán.
    print("INFO: Las variables de entorno de Supabase (SUPABASE_URL, SUPABASE_ANON_KEY) no están configuradas en el archivo backend/.env. La subida de archivos para análisis no funcionará.")
