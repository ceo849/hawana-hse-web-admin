# HAWANA HSE — FIRST PILOT DELETE-BASED OWNER LOGOUT RUNTIME EXECUTION APPROVAL

Document Type: Delete-Based Owner Logout Runtime Execution Approval  
Repository: hawana-hse-web-admin  
Date: 2026-05-29  
Status: APPROVAL CREATED — DELETE-BASED OWNER LOGOUT EXECUTION APPROVED FOR NEXT STEP ONLY  
Mode: Stability First / Governance Only / No Code Change / No Data Change  

---

## 1) Purpose

This document records the explicit approval boundary for the next controlled DELETE-based OWNER logout runtime validation execution.

This approval follows the confirmed Web logout route contract.

The approved Web logout method is DELETE.

The previous POST-based logout attempt returned HTTP 405 because the Web route supports DELETE.

This document approves only the next OWNER logout validation execution using DELETE under local Docker conditions.

This document does not approve code change.

This document does not approve client helper modification.

This document does not approve route redesign.

This document does not approve Core logout behavior change.

This document does not approve production validation.

This document does not approve first real pilot validation.

This document does not approve database mutation.

This document does not approve companyId modification.

This document does not approve Billing change.

This document does not approve Workflow change.

---

## 2) Source Plan

Primary source plan:

- docs/FIRST_PILOT_DELETE_BASED_OWNER_LOGOUT_RUNTIME_VALIDATION_PLAN_2026_05_29.md

Primary source decision:

- docs/FIRST_PILOT_WEB_LOGOUT_CONTRACT_DECISION_2026_05_29.md

Primary route discovery:

- docs/FIRST_PILOT_WEB_LOGOUT_ROUTE_CONTRACT_DISCOVERY_2026_05_29.md

Previous method mismatch evidence:

- docs/FIRST_PILOT_OWNER_LOGOUT_VALIDATION_METHOD_MISMATCH_EVIDENCE_2026_05_29.md

---

## 3) Confirmed Route Contract

Confirmed Web logout route:

app/api/auth/logout/route.ts

Confirmed Web logout method:

DELETE

Approved local Web logout endpoint:

http://localhost:3005/api/auth/logout

Approved safe session evidence endpoint:

http://localhost:3005/api/debug/session

Previous incorrect method:

POST

Previous incorrect method result:

405

Root cause:

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

Approved role:

OWNER

Approved user email:

owner3@hawana.com

Approved user full name:

Validation Owner

Other roles:

NOT APPROVED IN THIS STEP

---

## 6) Approved Execution Boundary

Approved execution:

DELETE-BASED OWNER LOGOUT VALIDATION ONLY

Approved path:

Web → API Proxy → Core

Approved logout method:

DELETE

Approved logout route:

/api/auth/logout

Approved local Web logout endpoint:

http://localhost:3005/api/auth/logout

Approved safe session evidence endpoint:

http://localhost:3005/api/debug/session

Temporary login setup:

APPROVED ONLY AS LOGOUT PREREQUISITE

Approved credential handling:

USE ALREADY-KNOWN LOCAL TEST CREDENTIALS OUTSIDE DOCUMENTATION

Approved password input method:

ZSH-COMPATIBLE SILENT PASSWORD INPUT

---

## 7) Approved Runtime Sequence

Approved runtime sequence:

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

---

## 8) Strict Forbidden Scope

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
- client helper modification
- route redesign
- password output
- token output
- full cookie output
- route guessing
- POST logout retry

---

## 9) Evidence Capture Boundary

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
- wrong tenant appears
- wrong role appears
- companyId mismatch appears

---

## 11) Approval Decision

DELETE-based OWNER logout runtime execution:

APPROVED FOR NEXT STEP ONLY

Temporary OWNER login setup:

APPROVED ONLY AS LOGOUT PREREQUISITE

Runtime workflow validation:

NOT APPROVED

Refresh validation:

NOT APPROVED

Code change:

NOT APPROVED

Client helper modification:

NOT APPROVED

Database mutation:

NOT APPROVED

Production validation:

NOT APPROVED

---

## 12) Final Approval Decision

DELETE-based OWNER logout runtime execution approval:

CREATED

Approved execution:

DELETE-BASED OWNER LOGOUT VALIDATION ONLY

Approved method:

DELETE

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

Temporary login setup:

APPROVED ONLY AS LOGOUT PREREQUISITE

Password output:

NOT APPROVED

Token output:

NOT APPROVED

Full cookie output:

NOT APPROVED

Runtime workflow validation:

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

EXECUTE DELETE-BASED OWNER LOGOUT RUNTIME VALIDATION LOCAL ONLY

Was anything deleted?

NO
