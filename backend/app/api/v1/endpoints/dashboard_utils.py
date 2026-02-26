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
    start_of_day = datetime.combine(today, datetime.min.time())
    
    # 1. Sales Today (Orders created today with status confirmed or delivered)
    # Using python filter for date to be safe with sqlite timestamps
    # Also valid: select(func.sum(Order.total_amount)).where(Order.created_at >= start_of_day)
    # But let's trust generic sqlmodel pattern
    
    # Optimization: query aggregate directly
    # Note: SQLite date comparisons can be tricky if stored as string. 
    # Provided seed uses 'YYYY-MM-DD HH:MM:SS' which sorts correctly as string.
    
    try:
        sales_today_query = select(func.sum(Order.total_amount)).where(Order.created_at >= start_of_day).where(Order.status != OrderStatus.CANCELLED)
        sales_today = session.exec(sales_today_query).one() or 0
    except Exception:
        # Fallback to python calculation if SQL date compare fails
        orders = session.exec(select(Order).where(Order.status != OrderStatus.CANCELLED)).all()
        sales_today = sum(o.total_amount for o in orders if o.created_at and o.created_at >= start_of_day)

    # 2. Pending Deliveries
    pending_count = session.exec(select(func.count(Delivery.id)).where(Delivery.status == DeliveryStatus.PENDING)).one()

    # 3. Critical Stock
    # Assuming critical is < 10 since min_stock field doesn't exist in Stock model yet
    critical_limit = 10 
    critical_stock_count = session.exec(select(func.count(Stock.id)).where(Stock.quantity <= critical_limit)).one()

    # 4. Overdue Balance
    # Assuming positive balance is debt.
    overdue_balance = session.exec(select(func.sum(Client.balance)).where(Client.balance > 0)).one() or 0

    # 5. Sales History (Last 7 days)
    sales_history = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_start = datetime.combine(day, datetime.min.time())
        day_next = datetime.combine(day + timedelta(days=1), datetime.min.time())
        
        # Query sum for this day
        # Query: >= day_start AND < day_next
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
        "critical_stock_count": critical_stock_count,
        "overdue_balance": overdue_balance,
        "sales_change_pct": 0, # Placeholder
        "pending_change": 0,   # Placeholder
        "sales_history": sales_history
    }
