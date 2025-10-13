# Dockerfile para monolito FastAPI + Next.js
FROM python:3.11-slim AS backend

# Backend
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY backend/ .

# Frontend
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .

# Copiamos backend también al contenedor final
COPY --from=backend /app/backend /app/backend

# Puerto asignado por Render
ENV PORT=10000

# Script para levantar todo
COPY start-all.sh /start-all.sh
RUN chmod +x /start-all.sh

EXPOSE $PORT

CMD ["/start-all.sh"]
