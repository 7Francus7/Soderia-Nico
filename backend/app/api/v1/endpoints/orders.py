from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, SQLModel
from app.api import deps
from app.models.all_models import (
    Order, OrderCreate, OrderRead, OrderItem, OrderItemCreate, OrderStatus, 
    Product, Client, User, PaymentMethod, PaymentStatus, CashMovement, ClientTransaction, TransactionType, Stock, Warehouse, Delivery, DeliveryStatus
)
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=OrderRead)
def create_order(
    *,
    session: Session = Depends(deps.get_session),
    order_in: OrderCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new order (Draft).
    """
    # Verify client exists
    if not session.get(Client, order_in.client_id):
        raise HTTPException(status_code=404, detail="Client not found")

    # Calculate total
    total_amount = 0.0
    valid_items = []
    
    # Pre-validate products
    for item in order_in.items:
        product = session.get(Product, item.product_id)
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} not found")
        # Calc item subtotal
        subtotal = item.quantity * item.unit_price
        total_amount += subtotal
        valid_items.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "subtotal": subtotal
        })

    # Create Order
    db_order = Order(
        client_id=order_in.client_id,
        created_by=current_user.id,
        notes=order_in.notes,
        total_amount=total_amount,
        status=OrderStatus.DRAFT
    )
    session.add(db_order)
    session.commit()
    session.refresh(db_order)

    # Create Items
    for item_data in valid_items:
        db_item = OrderItem(
            order_id=db_order.id,
            **item_data
        )
        session.add(db_item)
    
    session.commit()
    session.refresh(db_order)
    return db_order

@router.get("/", response_model=List[OrderRead])
def read_orders(
    client_id: Optional[int] = None,
    status: Optional[OrderStatus] = None,
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve orders with optional filtering.
    """
    query = select(Order)
    if client_id:
        query = query.where(Order.client_id == client_id)
    if status:
        query = query.where(Order.status == status)
    
    query = query.order_by(Order.created_at.desc())
    orders = session.exec(query.offset(skip).limit(limit)).all()
    return orders

@router.get("/{order_id}", response_model=OrderRead)
def read_order(
    order_id: int,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get order by ID.
    """
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}/confirm", response_model=OrderRead)
def confirm_order(
    order_id: int,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Confirm order. (Does not deduct stock strictly here, usually waits for delivery, 
    but could reserve. For now just status change).
    """
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.status != OrderStatus.DRAFT:
         raise HTTPException(status_code=400, detail="Only DRAFT orders can be confirmed")

    order.status = OrderStatus.CONFIRMED
    session.add(order)
    session.commit()
    session.refresh(order)
    return order

@router.post("/{order_id}/items", response_model=OrderRead)
def add_order_item(
    order_id: int,
    item_in: OrderItemCreate,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Add item to existing DRAFT order.
    """
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status != OrderStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Cannot modify non-DRAFT order")

    # Validate product
    product = session.get(Product, item_in.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    subtotal = item_in.quantity * item_in.unit_price
    
    # Add item
    db_item = OrderItem(
        order_id=order.id,
        product_id=item_in.product_id,
        quantity=item_in.quantity,
        unit_price=item_in.unit_price,
        subtotal=subtotal
    )
    session.add(db_item)
    
    # Update Order Total
    order.total_amount += subtotal
    session.add(order)
    
    session.commit()
    session.refresh(order)
    

    return order



class DeliverOrderRequest(SQLModel):
    payment_method: PaymentMethod
    notes: Optional[str] = None
    transfer_ref: Optional[str] = None
    returned_bottles: int = 0

@router.post("/{order_id}/deliver", response_model=OrderRead)
def deliver_order(
    order_id: int,
    deliver_in: DeliverOrderRequest,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Mark order as DELIVERED and process Payment.
    Atomic transaction: Order Status + Payment Record (Cash or Ledger).
    Idempotent: If already delivered, returns success.
    """
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Idempotency Check
    if order.status == OrderStatus.DELIVERED:
        return order

    # 1. Update Order Status
    order.status = OrderStatus.DELIVERED
    order.payment_method = deliver_in.payment_method
    order.paid_at = datetime.utcnow()
    order.delivered_at = datetime.utcnow()
    
    # 2. Process Payment
    client = session.get(Client, order.client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found associated with order")

    # Calculate returnables taken
    borrowed_bottles = 0
    items = session.exec(select(OrderItem).where(OrderItem.order_id == order.id)).all()
    for item in items:
        product = session.get(Product, item.product_id)
        if product and product.is_returnable:
            borrowed_bottles += item.quantity
            
    # Update bottles balance (positive means they owe us)
    client.bottles_balance += borrowed_bottles
    client.bottles_balance -= deliver_in.returned_bottles

    if deliver_in.payment_method == PaymentMethod.CURRENT_ACCOUNT:
        order.payment_status = PaymentStatus.ON_ACCOUNT
        
        # Create Ledger Transaction (DEBIT)
        transaction = ClientTransaction(
            client_id=order.client_id,
            type=TransactionType.DEBIT,
            amount=order.total_amount,
            concept=f"Pedido #{order.id} (Entregado)",
            description=deliver_in.notes or "Venta a Cuenta Corriente",
            reference_id=order.id,
            created_by=current_user.id
        )
        session.add(transaction)
        
        # Update Client Balance (Debt increases)
        client.balance += order.total_amount
        
    else:
        # CASH or TRANSFER or MIXED
        order.payment_status = PaymentStatus.PAID
        order.payment_amount = order.total_amount
        
        note = deliver_in.notes
        if deliver_in.transfer_ref:
            note = f"{note or ''} Ref: {deliver_in.transfer_ref}".strip()

        cash_movement = CashMovement(
            amount=order.total_amount,
            type="INCOME",
            concept=f"Cobro Pedido #{order.id}",
            payment_method=deliver_in.payment_method,
            reference_id=order.id,
            created_by=current_user.id
        )
        session.add(cash_movement)

    session.add(client)

    session.add(order)
    
    # Update Delivery status if needed (optional logic)
    # If order belongs to a delivery, we check if all orders are done? 
    # For now, we leave Delivery status simple or derived.
    
    session.commit()
    session.refresh(order)
    return order


@router.delete("/{order_id}", response_model=dict)
def delete_order(
    order_id: int,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete an order (only if DRAFT or CONFIRMED, not DELIVERED).
    """
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status == OrderStatus.DELIVERED:
        raise HTTPException(status_code=400, detail="No se puede eliminar un pedido ya entregado")
    
    # Remove order items first
    items = session.exec(select(OrderItem).where(OrderItem.order_id == order_id)).all()
    for item in items:
        session.delete(item)
    
    # Unlink from delivery if applicable
    if order.delivery_id:
        order.delivery_id = None
        session.add(order)
        session.commit()
    
    session.delete(order)
    session.commit()
    return {"message": "Pedido eliminado correctamente"}


@router.put("/{order_id}/cancel", response_model=OrderRead)
def cancel_order(
    order_id: int,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Cancel an order.
    """
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status == OrderStatus.DELIVERED:
        raise HTTPException(status_code=400, detail="No se puede cancelar un pedido ya entregado")
    
    order.status = OrderStatus.CANCELLED
    session.add(order)
    session.commit()
    session.refresh(order)
    return order
