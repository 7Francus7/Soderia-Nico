from datetime import datetime
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.api import deps
from app.models.all_models import (
    Delivery, DeliveryCreate, DeliveryRead, DeliveryStatus, 
    Order, OrderStatus, User
)

router = APIRouter()

# Schema for creating a delivery (dispatch) with a list of orders
from pydantic import BaseModel

class DeliveryCreateGroup(BaseModel):
    order_ids: List[int]
    notes: Optional[str] = None

@router.post("/", response_model=DeliveryRead)
def create_delivery(
    *,
    session: Session = Depends(deps.get_session),
    delivery_in: DeliveryCreateGroup,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create a new Dispatch (Reparto) grouping multiple orders.
    """
    # 1. Validate Orders
    orders = []
    for oid in delivery_in.order_ids:
        order = session.get(Order, oid)
        if not order:
            raise HTTPException(status_code=404, detail=f"Order {oid} not found")
        if order.delivery_id:
            raise HTTPException(status_code=400, detail=f"Order {oid} is already in a delivery")
        orders.append(order)

    # 2. Create Delivery/Dispatch
    delivery = Delivery(
        status=DeliveryStatus.PENDING,
        notes=delivery_in.notes,
        created_at=datetime.utcnow()
    )
    session.add(delivery)
    session.commit()
    session.refresh(delivery)

    # 3. Link Orders
    for order in orders:
        order.delivery_id = delivery.id
        session.add(order)
    
    session.commit()
    session.refresh(delivery)
    return delivery

@router.get("/", response_model=List[DeliveryRead])
def read_deliveries(
    status: Optional[str] = None,
    limit: int = 20,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get deliveries (Dispatches).
    """
    query = select(Delivery).order_by(Delivery.created_at.desc())
    if status:
        query = query.where(Delivery.status == status)
    
    query = query.limit(limit)
    deliveries = session.exec(query).all()
    
    # Calculate metrics for each delivery
    results = []
    for d in deliveries:
        # Load orders manually if lazy loading or to count
        # In SQLModel, d.orders should work if relationship is set, but better to be explicit or use eager loading if perf matters.
        # For now, simple access:
        orders_list = d.orders
        total = len(orders_list)
        delivered = sum(1 for o in orders_list if o.status == OrderStatus.DELIVERED)
        
        # Create Read model manually or iterate
        d_read = DeliveryRead.from_orm(d)
        d_read.orders_count = total
        d_read.delivered_count = delivered
        results.append(d_read)

    return results

@router.delete("/{delivery_id}", response_model=dict)
def delete_delivery(
    delivery_id: int,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a delivery (ungroup orders).
    """
    delivery = session.get(Delivery, delivery_id)
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")
    
    # Unlink orders (set delivery_id = None)
    for order in delivery.orders:
        order.delivery_id = None
        session.add(order)
        
    session.delete(delivery)
    session.commit()
    return {"message": "Reparto eliminado (pedidos liberados)"}
