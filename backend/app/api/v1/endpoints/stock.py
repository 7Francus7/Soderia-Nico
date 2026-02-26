from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.api import deps
from app.models.all_models import Warehouse, Stock, Product

router = APIRouter()

@router.get("/warehouses", response_model=List[Warehouse])
def read_warehouses(
    session: Session = Depends(deps.get_session),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve all warehouses.
    """
    return session.exec(select(Warehouse)).all()

@router.get("/", response_model=List[Any])
def read_stock(
    warehouse_id: int = None,
    session: Session = Depends(deps.get_session),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve stock. Optional filter by warehouse.
    """
    query = select(Stock, Product, Warehouse).join(Product).join(Warehouse)
    if warehouse_id:
        query = query.where(Stock.warehouse_id == warehouse_id)
    
    results = session.exec(query).all()
    
    # Flatten response for easier consumption
    stock_list = []
    for s, p, w in results:
        stock_list.append({
            "warehouse": w.name,
            "product": p.name,
            "quantity": s.quantity,
            "product_id": p.id,
            "warehouse_id": w.id
        })
    return stock_list
