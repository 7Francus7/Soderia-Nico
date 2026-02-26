from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from app.api import deps
from app.core import security
from app.models.all_models import User, UserCreate, UserRead, RoleEnum

router = APIRouter()


# ── Schemas ──────────────────────────────────────────────────────────────────
class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class UpdateUserRequest(BaseModel):
    full_name: Optional[str] = None
    role: Optional[RoleEnum] = None
    is_active: Optional[bool] = None

class CreateUserRequest(BaseModel):
    username: str
    password: str
    full_name: Optional[str] = None
    role: RoleEnum = RoleEnum.CHOFER


# ── GET /users/me ────────────────────────────────────────────────────────────
@router.get("/me", response_model=UserRead)
def get_current_user_info(current_user: User = Depends(deps.get_current_user)) -> Any:
    """Get current user info."""
    return current_user


# ── PUT /users/me/password ───────────────────────────────────────────────────
@router.put("/me/password")
def change_my_password(
    body: ChangePasswordRequest,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Change own password."""
    if not security.verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")
    current_user.hashed_password = security.get_password_hash(body.new_password)
    session.add(current_user)
    session.commit()
    return {"msg": "Contraseña actualizada correctamente"}


# ── GET /users/ ──────────────────────────────────────────────────────────────
@router.get("/", response_model=List[UserRead])
def list_users(
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """List all users (admin only)."""
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(status_code=403, detail="Solo administradores")
    users = session.exec(select(User)).all()
    return users


# ── POST /users/ ─────────────────────────────────────────────────────────────
@router.post("/", response_model=UserRead)
def create_user(
    body: CreateUserRequest,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Create a new user (admin only)."""
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(status_code=403, detail="Solo administradores")
    existing = session.exec(select(User).where(User.username == body.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un usuario con ese nombre")
    user = User(
        username=body.username,
        hashed_password=security.get_password_hash(body.password),
        full_name=body.full_name,
        role=body.role,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


# ── PUT /users/{user_id} ────────────────────────────────────────────────────
@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    body: UpdateUserRequest,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Update a user (admin only)."""
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(status_code=403, detail="Solo administradores")
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if body.full_name is not None:
        user.full_name = body.full_name
    if body.role is not None:
        user.role = body.role
    if body.is_active is not None:
        user.is_active = body.is_active
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


# ── PUT /users/{user_id}/password ────────────────────────────────────────────
@router.put("/{user_id}/password")
def reset_user_password(
    user_id: int,
    body: ChangePasswordRequest,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Reset any user's password (admin only). current_password is ignored."""
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(status_code=403, detail="Solo administradores")
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.hashed_password = security.get_password_hash(body.new_password)
    session.add(user)
    session.commit()
    return {"msg": f"Contraseña de {user.username} actualizada"}


# ── DELETE /users/{user_id} ──────────────────────────────────────────────────
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Delete a user (admin only, cannot delete self)."""
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(status_code=403, detail="Solo administradores")
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="No puedes eliminarte a ti mismo")
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    session.delete(user)
    session.commit()
    return {"msg": f"Usuario {user.username} eliminado"}
