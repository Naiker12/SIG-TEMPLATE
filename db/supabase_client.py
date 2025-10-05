# /backend/db/supabase_client.py

from supabase import create_client, Client
from app.core.config import settings

# Inicializamos el cliente como None por defecto.
supabase: Client | None = None

# Solo intentamos crear el cliente si las variables de entorno necesarias están presentes.
if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
    try:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    except Exception as e:
        # Si las variables de entorno están presentes pero fallan, es un error de configuración.
        print(f"ERROR: No se pudo inicializar el cliente de Supabase. Revisa que tus variables SUPABASE_URL y SUPABASE_ANON_KEY sean correctas en el archivo backend/.env.")
        print(f"Detalle del error: {e}")
        supabase = None
else:
    # Mensaje informativo si las variables no están configuradas.
    print("------------------------------------------------------------------------------------")
    print("INFO: Las variables de Supabase para Storage (SUPABASE_URL, SUPABASE_ANON_KEY)")
    print("      no están configuradas en el archivo backend/.env.")
    print("      La subida de archivos para análisis y otras funciones de almacenamiento no funcionarán.")
    print("      Copia y rellena las credenciales de tu proyecto de Supabase en backend/.env.")
    print("------------------------------------------------------------------------------------")
