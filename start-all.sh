#!/usr/bin/env bash
set -e

# Puerto asignado por Render o por defecto 8000
PORT=${PORT:-8000}

echo "=== Iniciando FastAPI Backend ==="
cd backend

# Instalamos dependencias (ya están en Docker, pero por seguridad)
pip install --upgrade pip
pip install -r requirements.txt

# Verificamos uvicorn
if ! command -v uvicorn &> /dev/null; then
  echo "Instalando uvicorn..."
  pip install uvicorn
fi

# Levantamos FastAPI en background
echo "Levantando servidor FastAPI en puerto $PORT..."
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT &

cd ../frontend
echo "=== Iniciando Next.js Frontend ==="
npm install
# Modo producción en Docker
npm run build
npm start
