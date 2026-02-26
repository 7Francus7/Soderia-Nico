from typing import Any, List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.api import deps
from app.models.all_models import Warehouse, User, RoleEnum

router = APIRouter()

@router.get("/warehouses/", response_model=List[Warehouse])
def read_warehouses(
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    return session.exec(select(Warehouse)).all()

@router.get("/users/drivers", response_model=List[User])
def read_drivers(
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    return session.exec(select(User).where(User.role == RoleEnum.CHOFER)).all()
