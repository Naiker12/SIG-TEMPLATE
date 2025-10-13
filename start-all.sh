#!/usr/bin/env bash
set -e

# Puerto asignado por Render o por defecto 8000
PORT=${PORT:-8000}

echo "=== Iniciando FastAPI Backend ==="
cd /app/backend

# Por seguridad, nos aseguramos de tener las dependencias listas
pip install --upgrade pip
pip install -r requirements.txt

# Iniciamos el servidor FastAPI en background
echo "Levantando servidor FastAPI en puerto $PORT..."
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT &

# Regresamos a frontend
cd /app/frontend
echo "=== Iniciando Next.js Frontend ==="

# Instalamos dependencias (si no existen)
npm install

# Construimos e iniciamos en modo producción
npm run builds
npm start
