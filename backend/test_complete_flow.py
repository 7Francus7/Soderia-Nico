from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.main import app
from app.database import engine
from app.models.all_models import Stock, Warehouse, User, RoleEnum

client = TestClient(app)

def test_full_flow():
    print(">>> Starting End-to-End Flow Test <<<")
    try:
        # 1. Login as Admin
        login_data = {"username": "admin", "password": "adminpassword"}
        response = client.post("/api/v1/auth/access-token", data=login_data)
        if response.status_code != 200:
            print("Login failed:", response.json())
            return
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("[OK] Logged in as Admin")

        # 2. Get Data for Test
        # Get Client
        with Session(engine) as session:
            # Check warehouse and user using ORM
            warehouse = session.exec(select(Warehouse)).first()
            chofer = session.exec(select(User).where(User.role == RoleEnum.CHOFER)).first()

        if not warehouse:
            print("[FAIL] No Warehouse found. Seed data missing.")
            return
        if not chofer:
            print("[FAIL] No Chofer found. Seed data missing.")
            return
            
        warehouse_id = warehouse.id
        chofer_id = chofer.id

        # List Clients
        r = client.get("/api/v1/clients/", headers=headers)
        assert r.status_code == 200
        clients = r.json()
        if not clients:
            print("[FAIL] No clients found. Run initial_data.py first.")
            return
        client_id = clients[0]["id"]
        print(f"[OK] Found Client ID: {client_id}")

        # List Products
        r = client.get("/api/v1/products/", headers=headers)
        products = r.json()
        product_id = products[0]["id"]
        print(f"[OK] Found Product ID: {product_id}")
        
        print(f"[OK] Found Warehouse ID: {warehouse_id}")
        print(f"[OK] Found Chofer ID: {chofer_id}")

        # 3. Create Order (Draft)
        order_payload = {
            "client_id": client_id,
            "items": [
                {"product_id": product_id, "quantity": 10, "unit_price": 100.0}
            ],
            "notes": "Test Order"
        }
        r = client.post("/api/v1/orders/", json=order_payload, headers=headers)
        if r.status_code != 200:
            print("[FAIL] Create Order:", r.text)
            return
        order_data = r.json()
        order_id = order_data["id"]
        print(f"[OK] Created Order ID: {order_id} (Status: {order_data['status']})")

        # 4. Confirm Order
        r = client.put(f"/api/v1/orders/{order_id}/confirm", headers=headers)
        if r.status_code != 200:
            print("[FAIL] Confirm Order:", r.text)
            return
        order_data = r.json()
        print(f"[OK] Confirmed Order (Status: {order_data['status']})")

        # 5. Assign Delivery
        delivery_payload = {
            "order_id": order_id,
            "warehouse_id": warehouse_id,
            "assigned_driver_id": chofer_id
        }
        r = client.post("/api/v1/deliveries/", json=delivery_payload, headers=headers)
        if r.status_code != 200:
            print("[FAIL] Assign Delivery:", r.text)
            return
        delivery_data = r.json()
        delivery_id = delivery_data["id"]
        print(f"[OK] Assigned Delivery ID: {delivery_id} (Status: {delivery_data['status']})")

        # 6. Start Delivery (In Transit)
        r = client.patch(f"/api/v1/deliveries/{delivery_id}/in-transit", headers=headers)
        print(f"[OK] Delivery In Transit (Status: {r.json()['status']})")

        # 7. Check Stock BEFORE Delivery
        with Session(engine) as session:
            # Use ORM
            stock_before_obj = session.exec(select(Stock).where(Stock.warehouse_id==warehouse_id, Stock.product_id==product_id)).first()
            qty_before = stock_before_obj.quantity if stock_before_obj else 0
        print(f"[INFO] Stock Before: {qty_before}")

        # 8. Complete Delivery
        r = client.patch(f"/api/v1/deliveries/{delivery_id}/deliver", headers=headers)
        if r.status_code != 200:
            print("[FAIL] Complete Delivery:", r.text)
            return
        print(f"[OK] Delivery Completed (Status: {r.json()['status']})")

        # 9. Verify Stock Deduction
        with Session(engine) as session:
            stock_after_obj = session.exec(select(Stock).where(Stock.warehouse_id==warehouse_id, Stock.product_id==product_id)).first()
            qty_after = stock_after_obj.quantity if stock_after_obj else 0
        
        print(f"[INFO] Stock After: {qty_after}")
        
        expected = qty_before - 10
        if qty_after == expected:
            print(f"[SUCCESS] Stock Deducted correctly! ({qty_before} -> {qty_after})")
        else:
            print(f"[FAIL] Stock Incorrect! Expected {expected}, got {qty_after}")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"[ERROR] Exception occurred: {e}")

if __name__ == "__main__":
    test_full_flow()
