from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
import os

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# ── CORS ─────────────────────────────────────────────────────────────────────
# En desarrollo: permite localhost.
# En producción: agrega el dominio de Vercel via variable de entorno FRONTEND_URL.
#   Ej: FRONTEND_URL=https://soderia-nico.vercel.app
_base_origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

frontend_url = os.getenv("FRONTEND_URL", "")
if frontend_url:
    _base_origins.append(frontend_url)
    # Permitir también variantes con/sin trailing slash
    _base_origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_base_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# ── Startup: crear tablas y datos iniciales ───────────────────────────────────
@app.on_event("startup")
def on_startup():
    from app.database import create_db_and_tables
    create_db_and_tables()
    # Crear usuario admin y datos base si no existen
    try:
        from initial_data import init_db
        init_db()
    except Exception as e:
        print(f"[startup] init_db: {e}")

@app.get("/")
def root():
    return {"message": "Soderia API is running ✅", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}
