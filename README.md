
# SIG IA: Sistema Inteligente de Gestión Documental

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
</p>

## 📜 Resumen del Proyecto

**SIG IA** es una plataforma web avanzada diseñada para revolucionar la gestión documental mediante la aplicación de Inteligencia Artificial. La herramienta centraliza, procesa y analiza grandes volúmenes de documentos, extrayendo información valiosa y automatizando tareas que tradicionalmente requieren un gran esfuerzo manual.

### ¿Por qué se creó?

El proyecto nace de la necesidad de optimizar los flujos de trabajo en entornos que dependen de una gran cantidad de documentos. La gestión manual es lenta, propensa a errores y dificulta la extracción de insights. SIG IA se creó para ser la solución a estos problemas, ofreciendo una plataforma centralizada, inteligente y eficiente.

### ¿Cómo ayudará?

SIG IA permite a los usuarios y organizaciones:
- **Ahorrar tiempo y recursos** automatizando la extracción y el procesamiento de datos.
- **Mejorar la precisión** al reducir los errores humanos en la transcripción y el análisis.
- **Tomar decisiones informadas** gracias a la capacidad de realizar búsquedas semánticas y análisis de datos.
- **Centralizar la información**, creando una única fuente de verdad para todos los documentos importantes.

---

## 🖼️ Vista Previa de la Aplicación

*Dashboard principal de la aplicación.*

![Dashboard de SIG IA](https://placehold.co/800x450/121212/E0E0E0?text=Vista+Previa+del+Dashboard)

---

## 🏗️ Arquitectura del Proyecto

SIG IA está construido sobre una arquitectura moderna de monorepo, separando claramente las responsabilidades del frontend y el backend.

-   `/frontend`: El corazón de la interfaz de usuario, construido con **React** y el framework **Next.js**. La UI es elegante y responsiva gracias a **TailwindCSS**, con componentes reutilizables de **ShadCN**.

-   `/backend`: Un potente servidor API desarrollado en **Python** con **FastAPI**. Utilizamos **Prisma** como ORM para interactuar de forma segura y eficiente con la base de datos PostgreSQL en Supabase.

-   `/prisma`: Contiene el esquema central de la base de datos (`schema.prisma`), que define los modelos de datos y las relaciones.

---

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para configurar y ejecutar el proyecto completo en tu entorno local.

### Prerrequisitos

-   **Node.js**: `v20.x` o superior.
-   **pnpm**: Gestor de paquetes para Node.js. Si no lo tienes, instálalo con `npm install -g pnpm`.
-   **Python**: `v3.10.x` o superior.
-   **Git**: Sistema de control de versiones.

### 1. Clonar el Repositorio

Primero, clona el repositorio en tu máquina local:
```bash
git clone https://github.com/tu-usuario/sig-ia.git
cd sig-ia
```

### 2. Configurar Variables de Entorno

Este proyecto requiere un archivo de variables de entorno para conectar el backend con la base de datos.

-   Ve a la carpeta `backend/`.
-   Crea un archivo llamado `.env` a partir del ejemplo (si no existe, créalo).
-   Añade la URL de conexión a tu base de datos Supabase:

```env
# backend/.env

# Reemplaza los valores con tu connection string de Supabase (formato PostgreSQL)
# Ejemplo: DATABASE_URL="postgresql://postgres:[TU_CONTRASEÑA]@[ID_PROYECTO].supabase.co:5432/postgres"
DATABASE_URL="TU_CONNECTION_STRING_DE_SUPABASE"

# Clave secreta para firmar los tokens JWT. Puedes generar una con: openssl rand -hex 32
SECRET_KEY="TU_CLAVE_SECRETA_AQUI"
```

### 3. Configurar y Ejecutar el Backend (Python + FastAPI)

Desde la raíz del proyecto, sigue estos pasos:

1.  **Navega a la carpeta del backend:**
    ```bash
    cd backend
    ```

2.  **Crea y activa un entorno virtual:**
    ```bash
    # Crear el entorno virtual
    python -m venv .venv

    # Activar en Windows
    .venv\Scripts\activate

    # Activar en macOS/Linux
    source .venv/bin/activate
    ```

3.  **Instala las dependencias de Python:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Genera el cliente de Prisma:**
    Prisma necesita generar un cliente de Python basado en tu `schema.prisma`.
    ```bash
    npx prisma generate
    ```

5.  **Aplica las migraciones a la base de datos (Supabase):**
    Este comando creará las tablas (`Usuario`, `Role`, `File`) en tu base de datos de Supabase.
    ```bash
    npx prisma migrate deploy
    ```

6.  **Inicia el servidor del backend:**
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```
    El backend estará disponible en `http://127.0.0.1:8000`. Puedes ver la documentación interactiva de la API en `http://127.0.0.1:8000/docs`.

### 4. Configurar y Ejecutar el Frontend (Next.js)

Abre una **nueva terminal** en la raíz del proyecto.

1.  **Navega a la carpeta del frontend:**
    ```bash
    cd frontend
    ```

2.  **Instala las dependencias de Node.js:**
    ```bash
    pnpm install
    ```

3.  **Inicia el servidor de desarrollo del frontend:**
    ```bash
    pnpm dev
    ```
    La aplicación web estará disponible en `http://localhost:3000`. Si estás en una red local, también podrás acceder desde otros dispositivos a través de la IP de tu máquina (ej. `http://192.168.1.100:3000`).

---

¡Listo! Con estos pasos, tendrás tanto el backend como el frontend funcionando en tu máquina y conectados a tu base de datos de Supabase.
