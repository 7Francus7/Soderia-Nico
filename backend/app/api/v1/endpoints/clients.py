from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, desc
from app.api import deps
from app.models.all_models import Client, ClientCreate, ClientRead, User, ClientTransaction, ClientTransactionRead, TransactionType, PaymentMethod
from pydantic import BaseModel

router = APIRouter()

# --- Schemas (Local/Specific to actions) ---
class ClientUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None

class PaymentCreate(BaseModel):
    amount: float
    description: Optional[str] = "Pago a cuenta"

class ChargeCreate(BaseModel):
    amount: float
    description: Optional[str] = "Cargo manual"

# --- Endpoints ---

@router.get("/", response_model=List[ClientRead])
def read_clients(
    session: Session = Depends(deps.get_session),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    sort_by_debt: bool = False,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Retrieve clients with search and sorting."""
    query = select(Client)
    
    if search:
        # Case insensitive search on name
        query = query.where(Client.name.ilike(f"%{search}%"))
    
    if sort_by_debt:
        # sort by balance ascending (negative balance = debt)
        query = query.order_by(Client.balance.desc()) 
    else:
        query = query.order_by(Client.name.asc())

    clients = session.exec(query.offset(skip).limit(limit)).all()
    return clients

from fastapi import Header

@router.post("/", response_model=ClientRead)
def create_client(
    client_in: ClientCreate,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key") # Can receive header
) -> Any:
    """
    Create new client. 
    Implements Idempotency to prevent duplicates on retries.
    """
    # 1. Simple Anti-Duplicate check: Name + Address
    existing = session.exec(
        select(Client).where(Client.name == client_in.name, Client.address == client_in.address)
    ).first()
    
    if existing:
        # Return existing client instead of creating duplicate (Idempotent behavior)
        return existing
        
    # 2. (Optional) Could store idempotency_key in a separate table for strict enforcing
    # For now, natural key (name+address) is robust enough for user retries.

    client = Client.from_orm(client_in)
    client.balance = 0.0
    session.add(client)
    session.commit()
    session.refresh(client)
    return client

@router.get("/{client_id}/transactions", response_model=List[ClientTransactionRead])
def get_client_transactions(
    client_id: int,
    session: Session = Depends(deps.get_session),
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Retrieve transaction history for a client."""
    client = session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
        
    query = select(ClientTransaction).where(ClientTransaction.client_id == client_id).order_by(desc(ClientTransaction.created_at))
    transactions = session.exec(query.offset(skip).limit(limit)).all()
    return transactions

@router.put("/{client_id}", response_model=ClientRead)
def update_client(
    client_id: int,
    client_in: ClientUpdate,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Update a client."""
    client = session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    update_data = client_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)
    
    session.add(client)
    session.commit()
    session.refresh(client)
    return client

@router.post("/{client_id}/payment", response_model=dict)
def register_payment(
    client_id: int,
    payment: PaymentCreate,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Registrar un pago: Aumenta el balance del cliente."""
    client = session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    # Create Transaction Record (CREDIT -> Pago dismunuye deuda)
    transaction = ClientTransaction(
        client_id=client_id,
        type=TransactionType.CREDIT,
        amount=payment.amount,
        concept="Pago recibido",
        description=payment.description,
        created_by=current_user.id
    )
    session.add(transaction)

    # Update Client Balance (Subtract payment from debt)
    # Note: Balance represents DEBT. 
    # Current Logic: Balance > 0 is Debt.
    client.balance -= payment.amount
    
    session.add(client)
    session.commit()
    session.refresh(client)
    return {"message": "Pago registrado", "new_balance": client.balance}

@router.post("/{client_id}/charge", response_model=dict)
def register_charge(
    client_id: int,
    charge: ChargeCreate,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Registrar un cargo manual (baja el saldo / aumenta deuda)."""
    client = session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    # Create Transaction Record (DEBIT -> Cargo aumenta deuda)
    transaction = ClientTransaction(
        client_id=client_id,
        type=TransactionType.DEBIT,
        amount=charge.amount,
        concept="Cargo manual",
        description=charge.description,
        created_by=current_user.id
    )
    session.add(transaction)

    # Update Client Balance (Add charge to debt)
    client.balance += charge.amount
    
    session.add(client)
    session.commit()
    session.refresh(client)
    return {"message": "Cargo registrado", "new_balance": client.balance}

@router.delete("/{client_id}", response_model=dict)
def delete_client(
    client_id: int,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Eliminar un cliente."""
    client = session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    session.delete(client)
    session.commit()
    return {"message": "Cliente eliminado correctamente"}
