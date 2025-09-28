
# SIG IA: Sistema Inteligente de Gestión Documental

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
</p>

## 📜 Resumen del Proyecto

**SIG IA** es una plataforma web avanzada diseñada para revolucionar la gestión documental mediante la aplicación de Inteligencia Artificial. La herramienta centraliza, procesa y analiza grandes volúmenes de documentos (PDF, Excel, etc.), extrayendo información valiosa y automatizando tareas que tradicionalmente requieren un gran esfuerzo manual.

### ¿Por qué se creó?

El proyecto nace de la necesidad de optimizar los flujos de trabajo en entornos que dependen de una gran cantidad de documentos. La gestión manual es lenta, propensa a errores y dificulta la extracción de insights. SIG IA se creó para ser la solución a estos problemas, ofreciendo una plataforma centralizada, inteligente y eficiente.

### ¿Cómo ayudará?

SIG IA permite a los usuarios y organizaciones:
- **Ahorrar tiempo y recursos** automatizando la extracción y el procesamiento de datos.
- **Mejorar la precisión** al reducir los errores humanos en la transcripción y el análisis.
- **Tomar decisiones informadas** gracias a la capacidad de realizar búsquedas semánticas y análisis de datos sobre sus propios documentos.
- **Centralizar la información**, creando una única fuente de verdad para todos los documentos importantes.

### Funciones Principales

- **Gestión de PDF**: Optimización (compresión), conversión a PDF, y herramientas para dividir y unir archivos.
- **Visualización Avanzada**: Visor de documentos integrado y una herramienta para comparar versiones de archivos.
- **Búsqueda Semántica con IA**: Permite hacer preguntas en lenguaje natural sobre el contenido de los documentos.
- **Extracción de Datos**: Conexión a APIs externas (ERP/CRM) y procesamiento de archivos Excel para convertirlos en datasets estructurados.
- **Limpieza de Datos**: Herramientas para detectar errores, transformar datos y asegurar la calidad de la información.

---

## 🖼️ Vista Previa de la Aplicación

*Aquí puedes colocar una captura de pantalla del dashboard principal de la aplicación.*

![Dashboard de SIG IA](https://placehold.co/800x450/121212/E0E0E0?text=Vista+Previa+del+Dashboard)

---

## 🏗️ Arquitectura del Proyecto

SIG IA está construido sobre una arquitectura moderna y escalable, separando claramente las responsabilidades.

-   `/frontend`: El corazón de la interfaz de usuario, construido con **React** y el framework **Next.js**. La UI es elegante y responsiva gracias a **TailwindCSS**, con componentes reutilizables de **ShadCN** y visualizaciones de datos de **Recharts**.

-   `/backend`: Un potente servidor API desarrollado en **Python** con **FastAPI**, que garantiza un alto rendimiento. Utilizamos **Prisma** como ORM para interactuar de forma segura y eficiente con la base de datos.

-   `/ai`: Toda la lógica de Inteligencia Artificial se gestiona a través de la **API de Google Gemini**, permitiendo capacidades avanzadas como la búsqueda semántica y el análisis de contenido.

-   `/db`: La persistencia de datos se confía a **Supabase**, que nos proporciona una base de datos **PostgreSQL** robusta y almacenamiento de archivos escalable.

-   `/auth`: La autenticación de usuarios es gestionada por **Firebase Authentication**, ofreciendo métodos de inicio de sesión seguros como correo y contraseña, Google y GitHub.

---

## ⚙️ Ejemplos de API del Backend

A continuación se muestran ejemplos de las peticiones y respuestas de nuestra API construida con FastAPI.

#### 1. Optimizar archivos (PDF, JPG, etc.)

-   **Endpoint**: `POST /api/v1/files/optimize`
-   **Descripción**: Envía uno o más archivos para su optimización. La API procesa la tarea en segundo plano.
-   **Petición de ejemplo (`multipart/form-data`)**:
    -   `files`: `[informe.pdf, imagen_logo.jpg]`
    -   `options`: `{"level": "recommended"}`
-   **Respuesta de ejemplo (`202 Accepted`)**:
```json
{
  "task_id": "opt_task_abcdef123456",
  "status": "pending",
  "message": "La tarea de optimización ha sido aceptada y está en cola para su procesamiento.",
  "file_count": 2
}
```

#### 2. Convertir un archivo Word a PDF

-   **Endpoint**: `POST /api/v1/files/convert-to-pdf`
-   **Descripción**: Sube un archivo (ej. DOCX) y lo convierte a formato PDF.
-   **Petición de ejemplo (`multipart/form-data`)**:
    -   `file`: `propuesta_comercial.docx`
    -   `options`: `{"title": "Propuesta Comercial Final"}`
-   **Respuesta de ejemplo (`200 OK`)**:

```json
{
  "original_filename": "propuesta_comercial.docx",
  "output_filename": "propuesta_comercial_final.pdf",
  "size_kb": 1280,
  "download_url": "https://storage.supabase.com/sig-ia-bucket/processed/propuesta_comercial_final.pdf?token=...",
  "converted_at": "2024-09-06T12:00:00Z"
}
```
---

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

-   **Node.js**: `v20.x` o superior
-   **Python**: `v3.10.x` o superior
-   **pnpm**: Gestor de paquetes para Node.js (puedes instalarlo con `npm install -g pnpm`)

### Pasos de Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/sig-ia.git
    cd sig-ia
    ```

2.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz de la carpeta `frontend` y añade las claves de API para Supabase, Firebase y Google Gemini.
    ```
    # frontend/.env
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    # ... otras claves de Firebase

    SUPABASE_URL=...
    SUPABASE_ANON_KEY=...

    GEMINI_API_KEY=...
    ```

3.  **Instala las dependencias del Frontend:**
    ```bash
    cd frontend
    pnpm install
    ```

4.  **Instala las dependencias del Backend:**
    ```bash
    cd ../backend
    pip install -r requirements.txt
    ```

### Iniciar el Proyecto

1.  **Iniciar el servidor del Frontend (Next.js):**
    ```bash
    # Desde la carpeta /frontend
    pnpm dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.

2.  **Iniciar el servidor del Backend (FastAPI):**
    ```bash
    # Desde la carpeta /backend
    uvicorn main:app --reload
    ```
    La API estará disponible en `http://localhost:8000/docs`.

---
