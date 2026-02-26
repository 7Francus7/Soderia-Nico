import logging
from sqlmodel import Session, select
from app.database import engine, create_db_and_tables
from app.models.all_models import User, UserCreate, Product, ProductCreate, Client, ClientCreate, RoleEnum, Warehouse, Stock, Delivery
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    create_db_and_tables()
    
    with Session(engine) as session:
        # Check if admin exists
        user = session.exec(select(User).where(User.username == "admin")).first()
        if not user:
            logger.info("Creating admin user...")
            admin_in = UserCreate(
                username="admin", 
                password="adminpassword", 
                role=RoleEnum.ADMIN,
                full_name="Administrador"
            )
            admin = User(
                username=admin_in.username, 
                hashed_password=get_password_hash(admin_in.password),
                role=admin_in.role,
                full_name=admin_in.full_name
            )
            session.add(admin)
            
        # Check if chofer exists
        chofer_user = session.exec(select(User).where(User.username == "chofer")).first()
        if not chofer_user:
            logger.info("Creating chofer user...")
            chofer_in = UserCreate(
                username="chofer", 
                password="choferpassword", 
                role=RoleEnum.CHOFER,
                full_name="Chofer Repartidor"
            )
            chofer = User(
                username=chofer_in.username, 
                hashed_password=get_password_hash(chofer_in.password),
                role=chofer_in.role,
                full_name=chofer_in.full_name
            )
            session.add(chofer)
            
        # Create products
        if not session.exec(select(Product)).first():
            logger.info("Seeding products...")
            products = [
                Product(name="Soda Sifón 1L", code="S1L", price=150.0, is_returnable=True),
                Product(name="Agua Bidón 20L", code="A20L", price=800.0, is_returnable=True),
                Product(name="Agua Pack 1.5L x6", code="AP15", price=1200.0, is_returnable=False),
                Product(name="Gas Garrafa 10kg", code="G10", price=4500.0, is_returnable=True),
                Product(name="Dispenser Frio/Calor", code="DISP01", price=50000.0, is_returnable=False) # Activo
            ]
            session.add_all(products)
            
        # Create clients
        if not session.exec(select(Client)).first():
            logger.info("Seeding clients...")
            clients = [
                Client(name="Juan Perez", address="Av. San Martin 123", zone="Centro"),
                Client(name="Restaurante El Pollito", address="Rivadavia 450", zone="Centro", tax_id="30-11111111-1"),
                Client(name="Maria Gonzalez", address="Belgrano 900", zone="Norte"),
            ]
            session.add_all(clients)

        session.commit()

        # Create warehouses and stock
        if not session.exec(select(Warehouse)).first():
            logger.info("Seeding warehouses...")
            central = Warehouse(name="Depósito Central")
            camion1 = Warehouse(name="Camión 1 - Reparto")
            session.add(central)
            session.add(camion1)
            session.commit()
            
            # Initial Stock in Central
            products = session.exec(select(Product)).all()
            for p in products:
                session.add(Stock(warehouse_id=central.id, product_id=p.id, quantity=1000))
            session.commit()
    logger.info("Initial data created")

if __name__ == "__main__":
    init_db()
