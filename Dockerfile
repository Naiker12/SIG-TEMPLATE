# Dockerfile para monolito FastAPI + Next.js (Python + Node en el mismo contenedor)

FROM python:3.10-slim

# Instalamos Node.js 20 manualmente (ambos entornos coexistirán)
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Directorio de trabajo principal
WORKDIR /app

# Copiamos todo el proyecto
COPY . .

# Instalamos dependencias del backend
WORKDIR /app/backend
RUN pip install --upgrade pip && pip install -r requirements.txt

# Instalamos dependencias del frontend
WORKDIR /app/frontend
RUN npm install

# Volvemos al directorio principal
WORKDIR /app

# Copiamos y damos permisos al script
RUN chmod +x /app/start-all.sh

# Puerto que Render asignará
ENV PORT=10000
EXPOSE $PORT

# Comando principal
CMD ["/app/start-all.sh"]
