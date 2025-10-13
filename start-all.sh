#!/usr/bin/env bash
set -e

echo "=== Iniciando FastAPI Backend ==="
cd /app/backend
pip install --upgrade pip
pip install -r requirements.txt

# Inicia el backend en background en el puerto 8000
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &

echo "=== Iniciando Next.js Frontend ==="
cd /app/frontend
npm run build

# Render usa el puerto asignado por la variable $PORT
PORT=${PORT:-3000}
npm start -- -p $PORT
