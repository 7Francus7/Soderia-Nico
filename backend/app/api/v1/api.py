from fastapi import APIRouter
from app.api.v1.endpoints import products, orders, deliveries, clients, utils, auth, dashboard_utils, sync
# Note: dashboard_utils is new

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(deliveries.router, prefix="/deliveries", tags=["deliveries"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(dashboard_utils.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(sync.router, prefix="/sync", tags=["sync"])
