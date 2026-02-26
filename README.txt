# SISTEMA SODERÍA LOS DOS HERMANOS - MVP

Este proyecto contiene el esqueleto funcional del Backend y estucturas para Mobile y Admin.

## Estructura de Carpetas
*   `/backend`: API REST (FastAPI + SQLite).
*   `/base_soderia_mobile`: Estructura sugerida para App Flutter.
*   `/base_soderia_admin`: Estructura sugerida para Web Admin.
*   `ARQUITECTURA.md` y `MODELO_DATOS.md`: Documentación técnica.

## 1. Setup Backend

### Requisitos
*   Python 3.10+
*   Virtualenv (recomendado)

### Instalación
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
```

### Inicializar Base de Datos
Esto creará el archivo `soderia.db` y cargará usuarios y productos de ejemplo.
```bash
python initial_data.py
# Salida esperada: INFO:root:Initial data created
```

### Ejecutar Servidor
```bash
uvicorn app.main:app --reload
```
La API estará disponible en: `http://localhost:8000`
Documentación interactiva (Swagger): `http://localhost:8000/docs`

## 2. Pruebas Rápidas

1.  **Login Admin:**
    *   Ve a `/docs` -> `POST /api/v1/auth/access-token`
    *   User: `admin`, Pass: `123456`
    *   Copia el `access_token`.

2.  **Listar Clientes (Protegido):**
    *   Ve a `GET /api/v1/clients/`
    *   Clic en el candado "Authorize" y pega el token.
    *   Ejecuta. Deberías ver 3 clientes de ejemplo.

## 3. Próximos Pasos
1.  **Mobile:** Crear proyecto Flutter en `base_soderia_mobile` y copiar la estructura de `STRUCTURE.txt`.
2.  **Admin:** Crear proyecto Vite/React en `base_soderia_admin`.
3.  **Sync:** Implementar la lógica de cola en el móvil siguiendo la guía en `ARQUITECTURA.md`.
