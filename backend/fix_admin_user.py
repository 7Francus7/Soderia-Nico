from sqlmodel import Session, select
from app.database import engine, create_db_and_tables
from app.models.all_models import User, UserCreate, RoleEnum
from app.core.security import get_password_hash
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fix_admin_user():
    create_db_and_tables()
    with Session(engine) as session:
        # Delete existing admin if any
        existing_user = session.exec(select(User).where(User.username == "admin")).first()
        if existing_user:
            logger.info("Found existing admin. Deleting to recreate...")
            session.delete(existing_user)
            session.commit()
            
        # Create fresh admin
        logger.info("Creating fresh admin user...")
        admin_in = UserCreate(
            username="admin", 
            password="123456", 
            role=RoleEnum.ADMIN,
            full_name="Administrador"
        )
        # Explicitly hash password here
        hashed_pwd = get_password_hash(admin_in.password)
        
        admin = User(
            username=admin_in.username, 
            hashed_password=hashed_pwd,
            role=admin_in.role,
            full_name=admin_in.full_name
        )
        session.add(admin)
        session.commit()
        session.refresh(admin)
        
        logger.info(f"Admin user fixed. Username: 'admin', Password: '123456'")
        logger.info(f"Stored Hash: {admin.hashed_password[:10]}...")

if __name__ == "__main__":
    fix_admin_user()
