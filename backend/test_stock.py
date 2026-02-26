import httpx

BASE_URL = "http://localhost:8000/api/v1"

def test_stock_module():
    print("--- Testing Stock Module ---")
    try:
        # 1. Login
        res = httpx.post(f"{BASE_URL}/auth/access-token", data={"username": "admin", "password": "adminpassword"})
        if res.status_code != 200:
            print("Login failed")
            return
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. List Warehouses
        print("\nListing Warehouses...")
        res = httpx.get(f"{BASE_URL}/stock/warehouses", headers=headers)
        if res.status_code == 200:
            warehouses = res.json()
            for w in warehouses:
                print(f"- {w['name']} (ID: {w['id']})")
        else:
            print(f"Failed to list warehouses: {res.status_code}")

        # 3. List Stock
        print("\nListing Stock (All)...")
        res = httpx.get(f"{BASE_URL}/stock/", headers=headers)
        if res.status_code == 200:
            stock = res.json()
            print(f"Found {len(stock)} stock entries.")
            for s in stock[:3]:
                 print(f"- {s['product']} in {s['warehouse']}: {s['quantity']}")
        else:
             print(f"Failed to list stock: {res.status_code}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_stock_module()
