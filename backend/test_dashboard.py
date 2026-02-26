import requests
import sys

def test():
    # Login
    resp = requests.post("http://localhost:8000/api/v1/auth/access-token", data={"username": "admin", "password": "123456"}, headers={"Content-Type": "application/x-www-form-urlencoded"})
    if resp.status_code != 200:
        print("Login failed:", resp.status_code, resp.text)
        sys.exit(1)
    
    token = resp.json()["access_token"]
    
    # Get stats
    print("Testing /dashboard-stats...")
    stats_resp = requests.get("http://localhost:8000/api/v1/dashboard/dashboard-stats", headers={"Authorization": f"Bearer {token}"})
    print(stats_resp.status_code, stats_resp.text)
    
    print("\nTesting /deliveries/?limit=5...")
    deliv_resp = requests.get("http://localhost:8000/api/v1/deliveries/?limit=5", headers={"Authorization": f"Bearer {token}"})
    print(deliv_resp.status_code, deliv_resp.text)

if __name__ == "__main__":
    test()
