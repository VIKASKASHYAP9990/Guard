from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_all_endpoints():
    print("Testing GET / ...")
    res = client.get("/")
    assert res.status_code == 200

    print("Testing GET /api/portfolio ...")
    res = client.get("/api/portfolio")
    assert res.status_code == 200
    pdata = res.json()
    print("  Portfolio Value:", pdata["portfolio_value"])
    print("  Holdings Count:", pdata["holdings_count"])
    print("  Alerts Count:", pdata["alerts_count"])

    print("Testing GET /api/holdings ...")
    res = client.get("/api/holdings")
    assert res.status_code == 200
    print("  Holdings retrieved:", len(res.json()))

    print("Testing GET /api/transactions ...")
    res = client.get("/api/transactions")
    assert res.status_code == 200
    print("  Transactions retrieved:", len(res.json()))

    print("Testing POST /api/behavior-analysis/run ...")
    res = client.post("/api/behavior-analysis/run")
    assert res.status_code == 200
    print("  Behavior analysis result:", res.json())

    print("Testing GET /api/alerts ...")
    res = client.get("/api/alerts")
    assert res.status_code == 200
    print("  Alerts retrieved:", len(res.json()))

    print("Testing GET /api/journal ...")
    res = client.get("/api/journal")
    assert res.status_code == 200

    print("Testing GET /api/planner ...")
    res = client.get("/api/planner")
    assert res.status_code == 200

    print("Testing GET /api/market/AAPL ...")
    res = client.get("/api/market/AAPL")
    assert res.status_code == 200

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all_endpoints()
