"""
AdminPortal API Test Suite
Tests all endpoints against http://localhost:5000
Run: python test_apis.py
"""

import json
import sys
import time
import urllib.request
import urllib.error

# Force UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

TS = int(time.time())  # unique suffix for emails per test run

BASE = "http://localhost:5000"

results = {"passed": 0, "failed": 0}
created_id  = None   # id from "Create User"
register_id = None   # id from "Register"


def req(method, path, body=None):
    url  = BASE + path
    data = json.dumps(body).encode() if body else None
    headers = {"Content-Type": "application/json"} if data else {}
    r = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read())
        except Exception:
            return e.code, {}


def check(name, status, body, expect_status, assertions=None):
    ok = status == expect_status
    msgs = []
    if assertions:
        for desc, val in assertions:
            if val:
                msgs.append(f"         [OK] {desc}")
            else:
                msgs.append(f"         [!!] {desc}")
                ok = False
    tag = "  PASS" if ok else "  FAIL"
    print(f"{tag}  [{status}] {name}")
    for m in msgs:
        print(m)
    if ok:
        results["passed"] += 1
    else:
        results["failed"] += 1
        if status != expect_status:
            print(f"         Expected {expect_status}, got {status}")
            print(f"         Response: {body}")


# ===================================================
print("\n" + "="*55)
print("  AdminPortal API Test Suite")
print("="*55)

# --- 1. Health Check --------------------------------
print("\n-- Health ------------------------------------------")
status, body = req("GET", "/health")
check("Health Check",
      status, body, 200,
      [("connected=true",  body.get("connected") is True),
       ("has user_count",  "user_count" in body)])

# --- 2. Root ----------------------------------------
print("\n-- Root --------------------------------------------")
status, body = req("GET", "/")
check("Root info", status, body, 200,
      [("has endpoints key", "endpoints" in body)])

# --- 3. Login ---------------------------------------
print("\n-- Auth / Login ------------------------------------")

status, body = req("POST", "/api/auth/login",
                   {"email": "truptilakshmi.tm@gmail.com", "password": "trupti@2005"})
check("Login - valid Super Admin", status, body, 200,
      [("role=Super Admin", body.get("role") == "Super Admin"),
       ("has id field",     "id" in body)])

status, body = req("POST", "/api/auth/login",
                   {"email": "alice@gmail.com", "password": "wrong_password"})
check("Login - wrong password -> 401", status, body, 401)

status, body = req("POST", "/api/auth/login",
                   {"password": "abc"})
check("Login - missing email -> 400", status, body, 400)

status, body = req("POST", "/api/auth/login",
                   {"email": "carol@gmail.com", "password": "password123"})
check("Login - Inactive account -> 403", status, body, 403)

status, body = req("POST", "/api/auth/login",
                   {"email": "emma@gmail.com", "password": "password123"})
check("Login - Pending account -> 403", status, body, 403,
      [("message contains 'pending'",
        "pending" in body.get("message", "").lower())])

# --- 4. Register ------------------------------------
print("\n-- Auth / Register ---------------------------------")

status, body = req("POST", "/api/auth/register",
                   {"name": "Test User", "email": f"testuser_{TS}@example.com",
                    "password": "pass123", "dept": "HR"})
check("Register - valid -> 201", status, body, 201,
      [("status=Pending", body.get("user", {}).get("status") == "Pending"),
       ("has id",         "id" in body.get("user", {}))])
if status == 201:
    register_id = body["user"]["id"]

status, body = req("POST", "/api/auth/register",
                   {"name": "Dup", "email": "alice@gmail.com", "password": "pass123"})
check("Register - duplicate email -> 400", status, body, 400)

status, body = req("POST", "/api/auth/register",
                   {"name": "Short", "email": "short_api@example.com", "password": "123"})
check("Register - short password -> 400", status, body, 400)

status, body = req("POST", "/api/auth/register",
                   {"email": "noemail@example.com", "password": "pass123"})
check("Register - missing name -> 400", status, body, 400)

# --- 5. Get All Users --------------------------------
print("\n-- Users CRUD --------------------------------------")

status, body = req("GET", "/api/users")
check("Get All Users -> 200 array", status, body, 200,
      [("is list",   isinstance(body, list)),
       (">=1 users", isinstance(body, list) and len(body) >= 1)])

# --- 6. Create User ----------------------------------
status, body = req("POST", "/api/users",
                   {"name": "Priya Sharma", "email": f"priya_{TS}@company.com",
                    "role": "Editor", "status": "Active", "dept": "Marketing"})
check("Create User - valid -> 201", status, body, 201,
      [("avatar=PS", body.get("avatar") == "PS"),
       ("has id",    "id" in body)])
if status == 201:
    created_id = body["id"]

status, body = req("POST", "/api/users",
                   {"name": "Dup", "email": "bob@yahoo.com"})
check("Create User - duplicate email -> 400", status, body, 400)

status, body = req("POST", "/api/users",
                   {"email": "noname@company.com"})
check("Create User - missing name -> 400", status, body, 400)

# --- 7. Update User ----------------------------------
if created_id:
    status, body = req("PUT", f"/api/users/{created_id}",
                       {"role": "Super Admin", "dept": "Leadership"})
    check("Update User - valid -> 200", status, body, 200,
          [("role=Super Admin", body.get("role") == "Super Admin"),
           ("dept=Leadership",  body.get("dept") == "Leadership")])
else:
    print("  SKIP  Update User (no created_id)")

status, body = req("PUT", "/api/users/99999", {"role": "Viewer"})
check("Update User - not found -> 404", status, body, 404)

# --- 8. Delete User ----------------------------------
if created_id:
    status, body = req("DELETE", f"/api/users/{created_id}")
    check("Delete User - valid -> 200", status, body, 200)
else:
    print("  SKIP  Delete User (no created_id)")

status, body = req("DELETE", "/api/users/99999")
check("Delete User - not found -> 404", status, body, 404)

# --- 9. Bulk Delete ----------------------------------
print("\n-- Bulk Delete -------------------------------------")

if register_id:
    status, body = req("POST", "/api/users/bulk-delete", {"ids": [register_id]})
    check("Bulk Delete - valid -> 200", status, body, 200,
          [("message has 'deleted'",
            "deleted" in body.get("message", "").lower())])
else:
    print("  SKIP  Bulk Delete - valid (no register_id)")

status, body = req("POST", "/api/users/bulk-delete", {"ids": []})
check("Bulk Delete - empty ids -> 400", status, body, 400)

# Note: sending {} with Content-Type so Flask parses body and returns 400 (not 415)
status, body = req("POST", "/api/users/bulk-delete", {})
check("Bulk Delete - missing ids -> 400", status, body, 400)

# --- Summary -----------------------------------------
total = results["passed"] + results["failed"]
print("\n" + "="*55)
print(f"  Results: {results['passed']}/{total} passed"
      + (f"  --  {results['failed']} FAILED" if results["failed"] else "  -- All passed!"))
print("="*55 + "\n")

if results["failed"]:
    raise SystemExit(1)
