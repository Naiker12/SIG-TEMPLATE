# /backend/db/supabase_client.py

from supabase import create_client, Client
from app.core.config import settings

# Crea una instancia única del cliente de Supabase para ser usada en toda la aplicación.
# Esto sigue el patrón Singleton, asegurando que no se creen múltiples conexiones innecesarias.

try:
    # Intenta inicializar el cliente de Supabase con las credenciales del entorno.
    supabase: Client = create_client(
        supabase_url=settings.SUPABASE_URL,
        supabase_key=settings.SUPABASE_ANON_KEY
    )
except Exception as e:
    # Si las variables de entorno no están configuradas, la aplicación no podrá funcionar.
    # Lanzamos un error claro para que el desarrollador sepa qué falta.
    print(f"ERROR: No se pudo inicializar el cliente de Supabase. Revisa tus variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY.")
    print(f"Detalle del error: {e}")
    # En un entorno real, podrías querer que la aplicación no inicie si esto falla.
    # Para desarrollo, permitimos que continúe pero la funcionalidad de subida fallará.
    supabase = None
