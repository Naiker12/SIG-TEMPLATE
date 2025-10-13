# Dockerfile para monolito FastAPI + Next.js

# ---------------------------
# Etapa 1: Backend (FastAPI)
# ---------------------------
FROM python:3.10-slim AS backend
WORKDIR /app/backend

# Copiamos e instalamos dependencias
COPY backend/requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiamos el código del backend
COPY backend/ ./

# ---------------------------
# Etapa 2: Frontend (Next.js)
# ---------------------------
FROM node:20 AS frontend
WORKDIR /app/frontend

# Copiamos dependencias y código del frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./

# ---------------------------
# Etapa 3: Contenedor final (Monolito)
# ---------------------------
FROM node:20

# Copiamos backend y frontend desde las etapas anteriores
COPY --from=backend /app/backend /app/backend
COPY --from=frontend /app/frontend /app/frontend

# Definimos el puerto de Render
ENV PORT=10000

# Establecemos directorio de trabajo
WORKDIR /app

# Copiamos el script que inicia ambos servicios
COPY start-all.sh /app/start-all.sh
RUN chmod +x /app/start-all.sh

# Exponemos el puerto (Render usa este valor)
EXPOSE $PORT

# Comando principal
CMD ["/app/start-all.sh"]
