# Backend de SIG IA

Este directorio contiene toda la lógica del servidor de la aplicación, construido con Python y FastAPI.

## Estructura

- **/app**: El código fuente principal de la aplicación FastAPI.
  - **/core**: Configuración central, middleware, etc.
  - **/routers**: Endpoints de la API, organizados por funcionalidad.
  - **/services**: Lógica de negocio para cada endpoint.
  - **/schemas**: Modelos de datos Pydantic para validación.
  - **main.py**: Punto de entrada de la aplicación FastAPI.
- **/db**: Lógica de conexión a la base de datos con Prisma.
- **/prisma**: Contiene el esquema de la base de datos.
  - **schema.prisma**: Fichero principal que define los modelos de datos y la conexión a la base de datos.

## Puesta en Marcha

1. Asegúrate de tener Python 3.10+ instalado.
2. Crea y activa un entorno virtual:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # En Windows: .venv\Scripts\activate
   ```
3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```
5. Aplica las migraciones a tu base de datos (Supabase):
   ```bash
   npx prisma migrate deploy
   ```
6. Inicia el servidor:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
