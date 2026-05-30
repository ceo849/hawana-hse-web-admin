# HAWANA HSE — FIRST PILOT ADDITIONAL ROLE USERS API PROXY READ-ONLY ACCESS SMOKE TEST SUCCESS EVIDENCE

Document Type: Additional Role Users API Proxy Read-Only Access Smoke Test Success Evidence
Repository: hawana-hse-web-admin
Date: 2026-05-30
Status: SMOKE TEST EXECUTED — READ-ONLY ACCESS VERIFIED
Mode: Stability First / Evidence Only / No Code Change / No Data Change

---

## 1) Execution Scope

Environment:

LOCAL ONLY

Method:

GET ONLY

Architecture path:

Web → API Proxy → Core

Roles tested:

ADMIN / MANAGER / WORKER / VIEWER

Routes tested:

- GET /api/users
- GET /api/dashboard
- GET /api/sites-projects
- GET /api/safety-reports
- GET /api/action-plans

---

## 2) Smoke Test Results

ADMIN:

GET /api/users: 200
GET /api/dash00
GET /api/sites-projects: 200
GET /api/safety-reports: 200
GET /api/action-plans: 200

MANAGER:

GET /api/users: 403
GET /api/dashboard: 200
GET /api/sites-projects: 200
GET /api/safety-reports: 200
GET /api/action-plans: 200

WORKER:

GET /api/users: 403
GET /api/dashboard: 200
GET /api/sites-projects: 200
GET /api/safety-reports: 200
GET /api/action-plans: 200

VIEWER:

GET /api/users: 403
GET /api/dashboard: 200
GET /api/sites-projects: 200
GET /api/safety-reports: 200
GET /api/action-plans: 200

---

## 3) RBAC Interpretation

ADMIN access to GET /api/users:

ALLOWED

MANAGER access to GET /api/users:

FORBIDDEN AS EXPECTED

WORKER access to GET /api/users:

FORBIDDEN AS EXPECTED

VIEWER access to GET /api/users:

FORBIDDEN AS EXPECTED

Operational read-only routes:

ACCESSIBLE FOR ALL TESTED ROLES

RBAC behavior:

VERIFIED AS EXPECTED

---

## 4) Safety Result

Code change:

NO

Database mutation:

NO

User creation:

NO

Role creation:

NO

companyId modification:

NO

Billing change:

NO

Workflow change:

NO

POST during smoke test:

NO

PATCH:

NO

PUT:

NO

DELETE:

NO

Direct Core call:

NO

Direct DB query:

NO

Token output:

NO

Full cookie output:

NO

Full response output:

NO

---

## 5) Final Evidence Decision

Additional role users API Proxy read-only access smoke test:

EXECUTED

Execution result:

SUCCESS

GET-only boundary:

RESPECTED

ADMIN read-only access:

VERIFIED

MANAGER read-only access:

VERIFIED

WORKER read-only access:

VERIFIED

VIEWER read-only access:

VERIFIED

RBAC restriction on GET /api/users for non-admin roles:

VERIFIED AS EXPECTED

Architecture path:

Web → API Proxy → Core

Additional role users pilot readiness:

READ-ONLY ACCESS VERIFIED

Next valid action:

CREATE FIRST PILOT ADDITIONAL ROLE USERS READ-ONLY ACCESS CLOSURE REPORT

Was anything deleted?

NO
