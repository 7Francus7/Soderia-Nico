from datetime import datetime, date, timedelta
from typing import Any, List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from app.api import deps
from app.models.all_models import Order, Delivery, Stock, DeliveryStatus, Client, OrderStatus

router = APIRouter()

@router.get("/dashboard-stats")
def get_dashboard_stats(
    session: Session = Depends(deps.get_session),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    today = date.today()
    yesterday = today - timedelta(days=1)
    start_of_today = datetime.combine(today, datetime.min.time())
    start_of_yesterday = datetime.combine(yesterday, datetime.min.time())
    
    # 1. Sales Today
    try:
        sales_today_query = select(func.sum(Order.total_amount)).where(
            Order.created_at >= start_of_today
        ).where(Order.status != OrderStatus.CANCELLED)
        sales_today = session.exec(sales_today_query).one() or 0
    except Exception:
        orders = session.exec(select(Order).where(Order.status != OrderStatus.CANCELLED)).all()
        sales_today = sum(o.total_amount for o in orders if o.created_at and o.created_at >= start_of_today)

    # 1b. Sales Yesterday (for comparison)
    try:
        sales_yesterday_query = select(func.sum(Order.total_amount)).where(
            Order.created_at >= start_of_yesterday
        ).where(
            Order.created_at < start_of_today
        ).where(Order.status != OrderStatus.CANCELLED)
        sales_yesterday = session.exec(sales_yesterday_query).one() or 0
    except Exception:
        sales_yesterday = 0

    # Calculate real change percentage
    if sales_yesterday and sales_yesterday > 0:
        sales_change_pct = round(((sales_today - sales_yesterday) / sales_yesterday) * 100, 1)
    else:
        sales_change_pct = 100 if sales_today > 0 else 0

    # 2. Pending Deliveries
    pending_count = session.exec(
        select(func.count(Delivery.id)).where(Delivery.status == DeliveryStatus.PENDING)
    ).one()

    # 2b. Orders pending (confirmed but not delivered)
    pending_orders = session.exec(
        select(func.count(Order.id)).where(Order.status == OrderStatus.CONFIRMED)
    ).one()

    # 3. Critical Stock
    critical_limit = 10 
    critical_stock_count = session.exec(
        select(func.count(Stock.id)).where(Stock.quantity <= critical_limit)
    ).one()

    # 4. Overdue Balance (total debt)
    overdue_balance = session.exec(
        select(func.sum(Client.balance)).where(Client.balance > 0)
    ).one() or 0
    
    # 4b. Number of debtors
    debtors_count = session.exec(
        select(func.count(Client.id)).where(Client.balance > 0)
    ).one()

    # 5. Total clients
    total_clients = session.exec(select(func.count(Client.id))).one()

    # 6. Today's order count
    try:
        orders_today_count = session.exec(
            select(func.count(Order.id)).where(
                Order.created_at >= start_of_today
            ).where(Order.status != OrderStatus.CANCELLED)
        ).one()
    except Exception:
        orders_today_count = 0

    # 7. Sales History (Last 7 days)
    sales_history = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_start = datetime.combine(day, datetime.min.time())
        day_next = datetime.combine(day + timedelta(days=1), datetime.min.time())
        
        daily_sum = session.exec(
            select(func.sum(Order.total_amount))
            .where(Order.created_at >= day_start)
            .where(Order.created_at < day_next)
            .where(Order.status != OrderStatus.CANCELLED)
        ).one() or 0
        
        sales_history.append({"date": day.strftime("%d/%m"), "amount": daily_sum})

    return {
        "sales_today": sales_today,
        "pending_deliveries": pending_count,
        "pending_orders": pending_orders,
        "critical_stock_count": critical_stock_count,
        "overdue_balance": overdue_balance,
        "debtors_count": debtors_count,
        "total_clients": total_clients,
        "orders_today_count": orders_today_count,
        "sales_change_pct": sales_change_pct,
        "pending_change": pending_orders,
        "sales_history": sales_history
    }
