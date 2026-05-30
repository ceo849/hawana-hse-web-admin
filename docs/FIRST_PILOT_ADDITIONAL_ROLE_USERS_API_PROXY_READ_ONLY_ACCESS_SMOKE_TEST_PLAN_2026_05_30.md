# HAWANA HSE — FIRST PILOT ADDITIONAL ROLE USERS API PROXY READ-ONLY ACCESS SMOKE TEST PLAN

Document Type: Additional Role Users API Proxy Read-Only Access Smoke Test Plan
Repository: hawana-hse-web-admin
Date: 2026-05-30
Status: PLAN CREATED — READ-ONLY ACCESS SMOKE TEST NOT STARTED
Mode: Stability First / Plan Only / No Code Change / No Data Change

---

## 1) Purpose

This document defines the next controlled smoke test plan after confirming that additionole users exist.

The goal is to verify read-only API Proxy access behavior for existing additional role users without changing data.

This is a plan only.

No runtime test is approved by this document.

---

## 2) Source Evidence

Primary source evidence:

- docs/FIRST_PILOT_ADDITIONAL_ROLE_USERS_API_PROXY_EXISTENCE_DISCOVERY_SUCCESS_EVIDENCE_2026_05_30.md

Confirmed existence result:

ADMIN user existence: VERIFIED

MANAGER user existence: VERIFIED

WORKER user existence: VERIFIED

VIEWER user existence: VERIFIED

Users count:

5

Architecture path confirmed:

Web → API Proxy → Core

---

## 3) Planned Smoke Test Scope

Planned access path:

Web → API Proxy → Core

Planned method:

GET only

Planned routes:

- GET /api/users
- GET /api/dashboard
- GET /api/sites-projects
- GET /api/safety-reports
- GET /api/action-plans

Planned users:

- ADMIN
- MANAGER
- WORKER
- VIEWER

Planned validation type:

READ-ONLY ACCESS SMOKE TEST

---

## 4) Explicitly Not Approved

The following are not approved by t:

- runtime execution
- login as additional role users
- password output
- token output
- full cookie output
- full response output
- POST requests
- PATCH requests
- PUT requests
- DELETE requests
- database mutation
- user creation
- role creation
- companyId modification
- Billing change
- Workflow change
- direct Core call
- direct DB query
- production validation
- first real pilot validation

---

## 5) Required Future Approval

Before execution, a separate approval document is required:

CREATE CONTROLLED ADDITIONAL ROLE USERS API PROXY READ-ONLY ACCESS SMOKE TEST EXECUTION APPROVAL

That approval must define:

- approved users
- approved routes
- approved method
- expected safe output format
- token/cookie non-disclosure controls
- no mutation boundary
- evidence capture format

---

## 6) Safety Boundary

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

Runtime execution:

NO

Direct Core call:

NO

Direct DB query:

NO

---

## 7) Final Plan Decision

Additional role users API Proxy read-only access smoke test plan:

CREATED

Execution status:

NOT STARTED

Approved path:

Web → API Proxy → Core

Approved method for future execution:

GET ONLY

Planned roles:

ADMIN / MANAGER / WORKER / VIEWER

Runtime execution:

NOT APPROVED BY THIS PLAN

Database mutation:

NO

Next valid action:

CREATE CONTROLLED ADDITIONAL ROLE USERS API PROXY READ-ONLY ACCESS SMOKE TEST EXECUTION APPROVAL

Was anything deleted?

NO
