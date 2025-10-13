#!/usr/bin/env bash
set -e

echo "=== Iniciando FastAPI Backend ==="
cd backend

# Verificamos si existe el entorno virtual
if [ -d ".venv" ]; then
  echo "Activando entorno virtual..."
  # Intentamos activarlo tanto para Linux/Mac como Windows Git Bash
  source .venv/bin/activate 2>/dev/null || source .venv/Scripts/activate 2>/dev/null || true
else
  echo "No se encontró entorno virtual (.venv). Instalando dependencias globalmente..."
  pip install -r requirements.txt
fi

# Verificamos si uvicorn está disponible
if ! command -v uvicorn &> /dev/null; then
  echo "Instalando uvicorn..."
  pip install uvicorn
fi

# Iniciamos el servidor FastAPI
echo "Levantando servidor FastAPI en puerto 8000..."
nohup python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &

cd ../frontend
echo "=== Iniciando Next.js Frontend ==="
npm install
npm run dev
