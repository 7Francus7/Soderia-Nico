# Dockerfile para Railway
FROM python:3.11-slim

# Variables de entorno para Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Instalar dependencias del sistema necesarias para psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE $PORT

# Comando de inicio: crea tablas y arranca el servidor
CMD ["sh", "-c", "python -c 'from app.database import create_db_and_tables; create_db_and_tables()' && uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
