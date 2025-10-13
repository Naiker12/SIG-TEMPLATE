# Dockerfile para monolito FastAPI + Next.js

# Backend con Python 3.10 para compatibilidad de librerías
FROM python:3.10-slim AS backend

# Backend
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY backend/ ./

# Frontend con Node 20
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./

# Copiamos backend desde la etapa anterior
COPY --from=backend /app/backend /app/backend

# Puerto asignado por Render
ENV PORT=10000

# Copiamos el script que levanta ambos servicios
COPY start-all.sh /start-all.sh
RUN chmod +x /start-all.sh

EXPOSE $PORT

# Comando para levantar el monolito
CMD ["/start-all.sh"]
