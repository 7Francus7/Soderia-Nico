from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sodería Nico"
    API_V1_STR: str = "/api/v1"

    # JWT — DEBE cambiarse en producción via variable de entorno SECRET_KEY
    SECRET_KEY: str = "CAMBIAR_ESTO_EN_PRODUCCION_CON_VARIABLE_DE_ENTORNO"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 días

    # Base de datos
    # - Desarrollo: sqlite:///./soderia.db  (default)
    # - Producción: Railway pone DATABASE_URL automáticamente como postgresql://...
    DATABASE_URL: str = "sqlite:///./soderia.db"

    # CORS — URL del frontend en producción
    FRONTEND_URL: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
