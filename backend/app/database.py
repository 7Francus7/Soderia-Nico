from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings

# SQLite necesita check_same_thread=False. PostgreSQL no acepta ese argumento.
is_sqlite = settings.DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,  # False en producción para no llenar los logs
    connect_args=connect_args,
)

def get_session():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
