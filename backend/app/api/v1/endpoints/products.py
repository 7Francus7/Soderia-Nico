from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.api import deps
from app.models.all_models import Product, ProductCreate

router = APIRouter()

@router.get("/", response_model=List[Product])
def read_products(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(deps.get_session),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve products.
    """
    products = session.exec(select(Product).offset(skip).limit(limit)).all()
    return products

@router.post("/", response_model=Product)
def create_product(
    *,
    session: Session = Depends(deps.get_session),
    product_in: ProductCreate,
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Create new product.
    """
    product = Product.from_orm(product_in)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

@router.get("/{product_id}", response_model=Product)
def read_product_by_id(
    product_id: int,
    session: Session = Depends(deps.get_session),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Get product by ID.
    """
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: int,
    product_in: ProductCreate,
    session: Session = Depends(deps.get_session),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Update a product.
    """
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

@router.delete("/{product_id}", response_model=dict)
def delete_product(
    product_id: int,
    session: Session = Depends(deps.get_session),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a product.
    """
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    session.delete(product)
    session.commit()
    return {"message": "Product deleted successfully"}
