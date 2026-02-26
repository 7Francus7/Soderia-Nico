import httpx

BASE_URL = "http://localhost:8000/api/v1"

def test_products_module():
    print("--- Testing Products Module ---")
    try:
        # 1. Login
        login_data = {
            "username": "admin",
            "password": "adminpassword"
        }
        res = httpx.post(f"{BASE_URL}/auth/access-token", data=login_data)
        if res.status_code != 200:
            print("Login failed, cannot test.")
            return
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. List Products
        print("Listing products...")
        res = httpx.get(f"{BASE_URL}/products/", headers=headers)
        if res.status_code == 200:
            prods = res.json()
            print(f"Found {len(prods)} products.")
            for p in prods[:3]:
                print(f" - {p['name']} (${p['price']})")
        else:
            print(f"List failed: {res.status_code}")

        # 3. Create Product
        print("\nCreating new product...")
        new_prod = {
            "name": "Naranja 2L",
            "code": "NAR2L",
            "price": 350.0,
            "is_returnable": False
        }
        res = httpx.post(f"{BASE_URL}/products/", json=new_prod, headers=headers)
        if res.status_code == 200:
            created = res.json()
            print(f"Product created: {created['id']} - {created['name']}")
        else:
            print(f"Create failed: {res.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_products_module()
