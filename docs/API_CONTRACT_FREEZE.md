# HAWANA HSE — API CONTRACT FREEZE

Project: Hawana HSE Platform  
API Version: v1  
Status: FROZEN — PRODUCTION CONTRACT  
Phase: Phase 5 → Phase 6 Transition  

--------------------------------------------------

## 1. Purpose

This document freezes the Core API contract before Phase 6 (Mobile Layer).

Objective:

- Ensure stable integration for Web Admin and Mobile  
- Prevent breaking changes  
- Enforce strict API governance  

--------------------------------------------------

## 2. Freeze Rule (CRITICAL)

From this point:

ALL v1 endpoints are STABLE.

Allowed changes:

✔ Backward-compatible additions  
✔ Optional fields  

Forbidden:

❌ Breaking changes  
❌ Removing fields  
❌ Changing response structure  

If required:

→ Create new version:

/v2/...

--------------------------------------------------

## 3. Authentication Contract

Authentication uses JWT.

Token payload:

- sub (userId)  
- email  
- role  
- companyId  

Rules:

- companyId MUST be trusted from JWT only  
- NEVER accepted from client payload  

--------------------------------------------------

## 4. Multi-Tenant Enforcement

All endpoints are scoped by:

companyId  

Rules:

- No cross-tenant access  
- All queries filtered by companyId  
- Isolation enforced at backend  

--------------------------------------------------

## 5. Users Endpoints

GET /v1/users  
GET /v1/users/{id}  
POST /v1/users  
PATCH /v1/users/{id}  

--------------------------------------------------

## 6. Companies Endpoints

GET /v1/companies  
GET /v1/companies/{id}  
POST /v1/companies  
PATCH /v1/companies/{id}  

--------------------------------------------------

## 7. Sites / Projects Endpoints

GET /v1/sites-projects  
GET /v1/sites-projects/{id}  
POST /v1/sites-projects  
PATCH /v1/sites-projects/{id}  

--------------------------------------------------

## 8. Safety Reports Endpoints

GET /v1/safety-reports  
GET /v1/safety-reports/{id}  
POST /v1/safety-reports  
PATCH /v1/safety-reports/{id}  

Workflow:

OPEN  
IN_PROGRESS  
CLOSED  

Rules:

- CLOSED reports are immutable  

--------------------------------------------------

## 9. Action Plans Endpoints

GET /v1/action-plans  
GET /v1/action-plans/{id}  
POST /v1/action-plans  
PATCH /v1/action-plans/{id}  

Workflow:

OPEN  
IN_PROGRESS  
COMPLETED  
VERIFIED  

Rules:

- VERIFIED actions are read-only  
- Self-verification is NOT allowed  

--------------------------------------------------

## 10. Billing & Access Control (Phase 5)

Access to endpoints depends on subscription state.

States:

- ACTIVE  
- TRIAL  
- BLOCKED  

Enforced via:

BillingActiveGuard  

--------------------------------------------------

## 11. Health & Monitoring Endpoints

GET /v1/health  
GET /v1/health/ready  

--------------------------------------------------

## 12. Error Contract

All errors follow unified format:

- statusCode  
- error  
- message  
- timestamp  
- path  
- method  
- errorType (OPERATIONAL / SYSTEM)  

--------------------------------------------------

## 13. Versioning Policy

v1 is frozen.

Future changes:

- v2 introduced for breaking changes  
- v1 remains backward-compatible  

--------------------------------------------------

## 14. Enforcement Level

This contract is:

✔ Mandatory  
✔ Production-critical  
✔ Non-negotiable  

Any violation is:

API Contract Breach  

--------------------------------------------------

## 15. Final Statement

API v1 is officially FROZEN.

- Safe for Web Admin ✔  
- Safe for Mobile ✔  
- Stable for Production ✔  

--------------------------------------------------