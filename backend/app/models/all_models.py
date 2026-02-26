from datetime import datetime
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import UniqueConstraint
from enum import Enum

# --- ENUMS ---
class RoleEnum(str, Enum):
    ADMIN = "ADMIN"
    CHOFER = "CHOFER"
    SECRETARIA = "SECRETARIA"

class OrderStatus(str, Enum):
    DRAFT = "DRAFT"
    CONFIRMED = "CONFIRMED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class DeliveryStatus(str, Enum):
    PENDING = "PENDING"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    FAILED = "FAILED"

class PaymentMethod(str, Enum):
    CASH = "CASH"
    CURRENT_ACCOUNT = "CURRENT_ACCOUNT"
    TRANSFER = "TRANSFER"
    MIXED = "MIXED"

class TransactionType(str, Enum):
    DEBIT = "DEBIT"   # Increases debt (Purchase)

    CREDIT = "CREDIT" # Decreases debt (Payment)

class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    ON_ACCOUNT = "ON_ACCOUNT"

# --- USERS ---
class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    full_name: Optional[str] = None
    role: RoleEnum = RoleEnum.CHOFER
    is_active: bool = True

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

# --- CLIENTS ---
class ClientBase(SQLModel):
    name: str = Field(index=True)
    address: str
    phone: Optional[str] = None
    zone: Optional[str] = None
    balance: float = 0.0

class Client(ClientBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ClientCreate(ClientBase):
    pass

class ClientRead(ClientBase):
    id: int
    created_at: datetime

# --- PRODUCTS ---
class ProductBase(SQLModel):
    name: str = Field(index=True)
    code: str = Field(unique=True, index=True)
    price: float
    is_returnable: bool = False

class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class ProductCreate(ProductBase):
    pass

# --- STOCK ---
class Warehouse(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)

class Stock(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("warehouse_id", "product_id"),)
    id: Optional[int] = Field(default=None, primary_key=True)
    warehouse_id: int = Field(foreign_key="warehouse.id")
    product_id: int = Field(foreign_key="product.id")
    quantity: int = 0

# --- ORDERS & DELIVERIES ---
class OrderBase(SQLModel):
    client_id: int = Field(foreign_key="client.id")
    status: OrderStatus = OrderStatus.DRAFT
    payment_method: Optional[PaymentMethod] = None
    payment_status: PaymentStatus = PaymentStatus.PENDING
    payment_amount: float = 0.0 # Amount paid immediately (if MIXED or CASH)
    paid_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    notes: Optional[str] = None
    total_amount: float = 0.0

class Order(OrderBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_by: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    items: List["OrderItem"] = Relationship(back_populates="order")
    client: Optional["Client"] = Relationship()
    
    delivery_id: Optional[int] = Field(default=None, foreign_key="delivery.id")
    delivery: Optional["Delivery"] = Relationship(back_populates="orders")

class OrderItemBase(SQLModel):
    product_id: int = Field(foreign_key="product.id")
    quantity: int
    unit_price: float
    subtotal: float

class OrderItem(OrderItemBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    
    order: Optional[Order] = Relationship(back_populates="items")

class OrderItemCreate(SQLModel):
    product_id: int
    quantity: int
    unit_price: float

class OrderCreate(SQLModel):
    client_id: int
    items: List[OrderItemCreate]
    notes: Optional[str] = None

class OrderRead(OrderBase):
    id: int
    created_at: datetime
    items: List[OrderItemBase] = []
    client: Optional[ClientRead] = None
    delivery_id: Optional[int] = None


# --- DELIVERIES ---
# --- DELIVERIES (Repartos / Dispatches) ---
class DeliveryBase(SQLModel):
    status: DeliveryStatus = DeliveryStatus.PENDING
    notes: Optional[str] = None

class Delivery(DeliveryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship: One Delivery -> Many Orders
    orders: List["Order"] = Relationship(back_populates="delivery")

class DeliveryCreate(DeliveryBase):
    pass

class DeliveryRead(DeliveryBase):
    id: int
    created_at: datetime
    orders_count: int = 0
    delivered_count: int = 0
    
    # We will compute counts in the endpoint or using a property



# --- LEDGER (Cuentas Corrientes) ---
class ClientTransactionBase(SQLModel):
    client_id: int = Field(foreign_key="client.id", index=True)
    type: TransactionType
    amount: float # Positive value. Logic determines sign based on type.
    concept: str
    description: Optional[str] = None
    reference_id: Optional[int] = None # E.g., Order ID
    
class ClientTransaction(ClientTransactionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[int] = Field(foreign_key="user.id", default=None)
    
class ClientTransactionCreate(ClientTransactionBase):
    pass

class ClientTransactionRead(ClientTransactionBase):
    id: int
    created_at: datetime





# --- CASH FLOW (Caja) ---
class CashMovementBase(SQLModel):
    amount: float
    type: str = "INCOME" # INCOME / EXPENSE
    concept: str # "Venta #123", "Gasto Nafta", etc.
    payment_method: PaymentMethod = PaymentMethod.CASH # CASH / TRANSFER
    reference_id: Optional[int] = None # Order ID if applicable

class CashMovement(CashMovementBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[int] = Field(foreign_key="user.id", default=None)

class CashMovementCreate(CashMovementBase):
    pass

class CashMovementRead(CashMovementBase):
    id: int
    created_at: datetime


# --- AUTH SCHEMAS ---
class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    username: Optional[str] = None
