#!/usr/bin/env bash
set -e

# Puerto asignado por Render o por defecto 8000
PORT=${PORT:-8000}

echo "=== Iniciando FastAPI Backend ==="
cd /app/backend

# Verificamos que pip esté disponible e instalamos dependencias
pip install --upgrade pip
pip install -r requirements.txt

# Iniciamos FastAPI en segundo plano
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT &

# Iniciamos el frontend
cd /app/frontend
echo "=== Iniciando Next.js Frontend ==="
npm run build
npm start
