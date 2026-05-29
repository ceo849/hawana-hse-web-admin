# HAWANA HSE — FIRST PILOT DELETE-BASED OWNER LOGOUT RUNTIME VALIDATION PLAN

Document Type: Delete-Based Owner Logout Runtime Validation Plan  
Repository: hawana-hse-web-admin  
Date: 2026-05-29  
Status: PLAN CREATED — LOGOUT EXECUTION NOT STARTED  
Mode: Stability First / Governance Only / No Code Change / No Data Change  

---

## 1) Purpose

This document defines the controlled runtime validation plan for OWNER logout using the confirmed Web logout route contract.

The confirmed Web logout route supports DELETE.

The previous logout attempt used POST and returned HTTP 405.

This plan uses the discovered route contract without changing code.

This document does not execute logout.

This document does not change code.

This document does not mutate database state.

This document does not modify companyId.

This document does not change Billing.

This document does not change Workflow.

---

## 2) Source Decision

Primary source decision:

- docs/FIRST_PILOT_WEB_LOGOUT_CONTRACT_DECISION_2026_05_29.md

Primary source discovery:

- docs/FIRST_PILOT_WEB_LOGOUT_ROUTE_CONTRACT_DISCOVERY_2026_05_29.md

Related Core evidence:

- docs/FIRST_PILOT_OWNER_LOGOUT_VALIDATION_METHOD_MISMATCH_EVIDENCE_2026_05_29.md

---

## 3) Confirmed Route Contract

Confirmed Web logout route:

app/api/auth/logout/route.ts

Confirmed Web logout HTTP method:

DELETE

Confirmed Web logout endpoint:

http://localhost:3005/api/auth/logout

Safe session evidence endpoint:

http://localhost:3005/api/debug/session

Previous incorrect method:

POST

Previous incorrect method result:

405

Root cause of previous failure:

WEB LOGOUT HTTP METHOD MISMATCH

---

## 4) Selected Controlled Tenant

Tenant name:

Hawana Internal Validation

Tenant id:

28b0d660-7367-4ab7-a05b-af7ae0041a99

Environment:

LOCAL DOCKER ONLY

Production tenant:

NO

First real pilot tenant:

NO

---

## 5) Approved User

Role:

OWNER

User email:

owner3@hawana.com

User full name:

Validation Owner

Other roles:

NOT APPROVED IN THIS STEP

---

## 6) Planned Execution Sequence

Approved execution sequence after separate runtime approval:

1. Verify local Web health.
2. Verify local Core health.
3. Create temporary cookie jar outside the project.
4. Enter OWNER password silently.
5. Execute temporary OWNER login setup through Web API Proxy.
6. Verify session presence before logout using boolean-only debug evidence.
7. Execute OWNER logout using DELETE through Web API Proxy.
8. Verify session absence after logout using boolean-only debug evidence.
9. Delete all temporary sensitive files from /tmp.
10. Verify git status remains clean.

Temporary login setup:

APPROVED ONLY AS LOGOUT PREREQUISITE

Logout method:

DELETE

Logout route:

/api/auth/logout

---

## 7) Architecture Boundary

Required execution path:

Web → API Proxy → Core

Browser-facing route:

/api/auth/logout

Core direct auth call:

NOT APPROVED

Direct SQL:

NOT APPROVED

Production endpoint:

NOT APPROVED

---

## 8) Evidence Capture Boundary

Approved evidence:

- Web health status
- Core health status
- temporary login setup HTTP status code
- temporary login setup success boolean
- session presence booleans before logout
- DELETE logout HTTP status code
- DELETE logout success boolean if returned
- session presence booleans after logout
- request host
- forwarded proto
- no sensitive values

Forbidden evidence:

- password value
- access token value
- refresh token value
- full cookie value
- authorization header value
- Set-Cookie full value
- production data
- real pilot tenant credentials

---

## 9) Strict Forbidden Scope

The following are not approved:

- production login
- production logout
- first real pilot login
- first real pilot logout
- ADMIN login
- MANAGER login
- WORKER login
- VIEWER login
- role expansion
- refresh validation
- runtime workflow validation
- billing validation
- user mutation
- tenant mutation
- database mutation
- companyId modification
- Billing change
- Workflow change
- direct Core auth call through port 3001
- direct SQL execution
- Docker restart
- Docker rebuild
- code change
- password output
- token output
- full cookie output
- route guessing

---

## 10) Stop Conditions

Execution must stop immediately if:

- command targets production domain
- command targets Core direct port 3001
- password is printed
- token value is printed
- full cookie value is printed
- Set-Cookie full value is printed
- HTTP 5xx occurs
- Docker restart becomes required
- code change becomes required
- database mutation becomes required
- API mutation beyond temporary auth login and DELETE logout becomes required
- logout endpoint does not use DELETE
- session evidence becomes ambiguous

---

## 11) Execution Approval Status

DELETE-based OWNER logout runtime execution:

NOT APPROVED BY THIS PLAN

Temporary OWNER login setup:

NOT APPROVED BY THIS PLAN

Runtime workflow validation:

NOT APPROVED

Database mutation:

NOT APPROVED

Code change:

NOT APPROVED

Production validation:

NOT APPROVED

Reason:

This document is a runtime validation plan only. Actual execution requires a separate explicit approval step.

---

## 12) Final Plan Decision

DELETE-based OWNER logout runtime validation plan:

CREATED

Approved planning option:

OPTION A

Confirmed Web logout method:

DELETE

Previous attempted method:

POST

Previous observed status:

405

Root cause:

WEB LOGOUT HTTP METHOD MISMATCH

Approved role:

OWNER

Approved user:

owner3@hawana.com

Approved tenant:

Hawana Internal Validation

Approved tenant id:

28b0d660-7367-4ab7-a05b-af7ae0041a99

Approved environment:

LOCAL DOCKER ONLY

Approved path:

Web → API Proxy → Core

Logout execution:

NOT STARTED

Runtime execution approval:

NOT APPROVED

Code change:

NOT APPROVED

Database mutation:

NOT APPROVED

Billing change:

NOT APPROVED

Workflow change:

NOT APPROVED

Next valid action:

EXPLICIT DELETE-BASED OWNER LOGOUT RUNTIME EXECUTION APPROVAL

Was anything deleted?

NO
