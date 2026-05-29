# HAWANA HSE — FIRST PILOT WEB LOGOUT CONTRACT DECISION

Document Type: Web Logout Contract Decision  
Repository: hawana-hse-web-admin  
Date: 2026-05-29  
Status: DECISION CREATED — LOGOUT RETRY NOT EXECUTED  
Mode: Stability First / Governance Only / No Code Change / No Data Change  

---

## 1) Purpose

This document records the governance decision after read-only discovery of the Web logout route contract.

The discovery confirmed that the current Web logout route supports DELETE, while the previous runtime validation attempt used POST and returned HTTP 405.

This document decides the next safe action before any Web logout code fix.

This document does not execute logout.

This document does not change code.

This document does not mutate database state.

This document does not modify companyId.

This document does not change Billing.

This document does not change Workflow.

---

## 2) Source Discovery

Primary source discovery:

- docs/FIRST_PILOT_WEB_LOGOUT_ROUTE_CONTRACT_DISCOVERY_2026_05_29.md

Discovered Web logout route:

- app/api/auth/logout/route.ts

Related client helper:

- src/auth/api.ts

---

## 3) Confirmed Facts

Current Web logout route method:

DELETE

Previous attempted method:

POST

Previous observed status:

405

Root cause:

WEB LOGOUT HTTP METHOD MISMATCH

Related client helper mismatch:

CONFIRMED

Client helper currently uses:

apiClient.post('/auth/logout', {})

Current route supports:

DELETE /api/auth/logout

---

## 4) Decision Options Reviewed

Option A:

Approve DELETE-based OWNER logout runtime validation using the current Web route contract.

Option B:

Create a controlled minimal Web code fix plan to align src/auth/api.ts with DELETE.

Option C:

Keep logout validation blocked until further review.

---

## 5) Selected Decision

Selected option:

OPTION A — APPROVE DELETE-BASED OWNER LOGOUT RUNTIME VALIDATION PLANNING

Reason:

The current route contract must be validated with its actual supported HTTP method before deciding whether the route itself is functionally correct.

A code fix for the client helper should not be executed before confirming that DELETE /api/auth/logout clears the expected cookies safely.

This keeps the next action evidence-based and avoids unnecessary code changes.

---

## 6) Approved Planning Boundary

Approved next planning scope:

- OWNER logout runtime validation using DELETE
- local Docker only
- Web API Proxy only
- temporary OWNER login setup only as logout prerequisite
- boolean-only session evidence before logout
- boolean-only session evidence after logout
- no password output
- no token output
- no full cookie output
- no production endpoint
- no database mutation
- no code change

Not approved by this decision:

- immediate code fix
- client helper modification
- route redesign
- Core logout behavior change
- Billing change
- Workflow change
- role expansion
- production validation
- first real pilot validation

---

## 7) Architecture Boundary

Required execution path remains:

Web → API Proxy → Core

Approved Web route for next planning:

DELETE /api/auth/logout

Direct Core call:

NOT APPROVED

Direct SQL:

NOT APPROVED

Production endpoint:

NOT APPROVED

---

## 8) Safety Result

Code change:

NO

Database mutation:

NO

API mutation:

NO

companyId modification:

NO

Billing change:

NO

Workflow change:

NO

Logout runtime execution:

NOT EXECUTED

Password output:

NO

Token output:

NO

Full cookie output:

NO

---

## 9) Final Decision

Web logout contract decision:

CREATED

Selected option:

OPTION A

Approved next planning action:

DELETE-BASED OWNER LOGOUT RUNTIME VALIDATION PLAN

Confirmed Web logout method:

DELETE

Previous attempted method:

POST

Previous observed status:

405

Root cause:

WEB LOGOUT HTTP METHOD MISMATCH

Client helper mismatch:

CONFIRMED

Code fix:

NOT APPROVED

Logout execution:

NOT EXECUTED

Database mutation:

NO

Billing change:

NO

Workflow change:

NO

Next valid action:

CREATE DELETE-BASED OWNER LOGOUT RUNTIME VALIDATION PLAN

Was anything deleted?

NO
