from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from sqlmodel import Session
from app.api import deps
from app.models.all_models import Delivery, User
from pydantic import BaseModel

router = APIRouter()

class SyncOperation(BaseModel):
    id: str # UUID from client
    type: str # 'DELIVERY_UPDATE', 'ORDER_CREATE', etc.
    payload: Dict[str, Any]
    timestamp: int

class SyncRequest(BaseModel):
    operations: List[SyncOperation]

@router.post("/", status_code=200)
def sync_data(
    sync_request: SyncRequest,
    db: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Sync offline operations from mobile/frontend.
    """
    results = []
    
    for op in sync_request.operations:
        try:
            if op.type == 'DELIVERY_UPDATE':
                # Example: payload = {"delivery_id": 123, "status": "delivered"}
                delivery_id = op.payload.get("delivery_id")
                new_status = op.payload.get("status")
                
                delivery = db.get(Delivery, delivery_id)
                if not delivery:
                     results.append({"op_id": op.id, "status": "error", "message": "Delivery not found"})
                     continue
                     
                delivery.status = new_status
                db.add(delivery)
                db.commit()
                db.refresh(delivery)
                results.append({"op_id": op.id, "status": "success"})

            else:
                results.append({"op_id": op.id, "status": "ignored", "message": "Unknown operation type"})
                
        except Exception as e:
            results.append({"op_id": op.id, "status": "error", "message": str(e)})

    return {"synced_ops": results}
