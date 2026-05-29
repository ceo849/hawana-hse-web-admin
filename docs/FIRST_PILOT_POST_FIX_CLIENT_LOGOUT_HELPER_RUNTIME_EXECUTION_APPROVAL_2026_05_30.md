# HAWANA HSE — FIRST PILOT POST-FIX CLIENT LOGOUT HELPER RUNTIME EXECUTION APPROVAL

Document Type: Post-Fix Client Logout Helper Runtime Execution Approval  
Repository: hawana-hse-web-admin  
Date: 2026-05-30  
Status: APPROVAL CREATED — POST-FIX CLIENT LOGOUT HELPER RUNTIME EXECUTION APPROVED FOR NEXT STEP ONLY  
Mode: Stability First / Governance Only / No Code Change / No Data Change  

---

## 1) Purpose

This document records the explicit approval boundary for the next controlled runtime validation after fixing the client logout helper.

The client logout helper now calls apiClient.delete('/auth/logout').

The Web logout route has already been verified using DELETE.

The code fix has already passed build validation.

This approval allows one local-only post-fix runtime validation of the client logout helper path.

This document does not change code.

This document does not execute logout.

This document does not mutate database state.

This document does not modify companyId.

This document does not change Billing.

This document does not change Workflow.

---

## 2) Source Plan and Evidence

Primary runtime validation plan:

- docs/FIRST_PILOT_POST_FIX_CLIENT_LOGOUT_HELPER_RUNTIME_VALIDATION_PLAN_2026_05_30.md

Primary code fix success evidence:

- docs/FIRST_PILOT_CLIENT_LOGOUT_HELPER_CODE_FIX_SUCCESS_EVIDENCE_2026_05_30.md

Primary code fix approval:

- docs/FIRST_PILOT_CLIENT_LOGOUT_HELPER_CODE_FIX_APPROVAL_2026_05_29.md

Primary API client DELETE support confirmation:

- docs/FIRST_PILOT_API_CLIENT_DELETE_SUPPORT_CONFIRMATION_2026_05_29.md

Primary DELETE-based logout success evidence:

- docs/FIRST_PILOT_DELETE_BASED_OWNER_LOGOUT_SUCCESS_EVIDENCE_2026_05_29.md

---

## 3) Confirmed Current State

Client helper file:

src/auth/api.ts

Current logout helper call:

apiClient.delete('/auth/logout')

Previous logout helper call:

apiClient.post('/auth/logout', {})

API client DELETE support:

CONFIRMED

Web logout route:

app/api/auth/logout/route.ts

Web logout method:

DELETE

Expected browser-facing path:

/api/auth/logout

Architecture path:

Web → API Proxy → Core

Build validation:

PASSED

---

## 4) Approved Runtime Execution Scope

Approved execution:

POST-FIX CLIENT LOGOUT HELPER RUNTIME VALIDATION ONLY

Approved environment:

LOCAL DOCKER ONLY

Approved user role:

OWNER

Approved user:

owner3@hawana.com

Approved tenant:

Hawana Internal Validation

Approved tenant id:

28b0d660-7367-4ab7-a05b-af7ae0041a99

Approved validation path:

Web → API Proxy → Core

Approved runtime objective:

Confirm that the fixed logout helper path using DELETE successfully clears the active Web auth cookies.

Temporary login setup:

APPROVED ONLY AS LOGOUT PREREQUISITE

Runtime logout execution:

APPROVED FOR NEXT STEP ONLY

---

## 5) Approved Execution Boundary

Approved execution sequence:

1. Verify clean git status.
2. Verify current commit and tag.
3. Verify Web health locally.
4. Verify Core health locally.
5. Prepare temporary cookie jar outside the project.
6. Enter OWNER password silently.
7. Execute temporary OWNER login setup through Web API Proxy.
8. Verify session presence before logout using boolean-only debug evidence.
9. Execute logout through the fixed DELETE-compatible helper path.
10. Verify session absence after logout using boolean-only debug evidence.
11. Delete all temporary sensitive files from /tmp.
12. Verify git status remains clean.

Approved evidence:

- Web health status
- Core health status
- login setup HTTP status code
- login setup success boolean
- session presence booleans before logout
- fixed logout HTTP status code
- fixed logout success boolean if returned
- session presence booleans after logout
- no sensitive values

---

## 6) Strict Forbidden Scope

The following are not approved:

- production login
- production logout
- first real pilot login
- first real pilot logout
- Core modification
- Web route modification
- API client modification
- auth redesign
- token handling redesign
- cookie handling redesign
- refresh behavior change
- Billing change
- companyId change
- Workflow change
- database mutation
- runtime workflow validation
- Docker restart
- Docker rebuild
- Docker compose up
- Docker compose down
- password output
- token output
- full cookie output
- Set-Cookie full value output
- route guessing

---

## 7) Stop Conditions

Execution must stop immediately if:

- command targets production domain
- command targets Core direct port 3001 from UI/client context
- password is printed
- token value is printed
- full cookie value is printed
- Set-Cookie full value is printed
- HTTP 5xx occurs
- Docker restart becomes required
- code change becomes required
- database mutation becomes required
- logout path does not use DELETE
- session evidence becomes ambiguous

---

## 8) Safety Result

Code change in this document:

NO

Database mutation:

NO

API route modification:

NO

Core modification:

NO

companyId modification:

NO

Billing change:

NO

Workflow change:

NO

Production validation:

NOT APPROVED

First real pilot validation:

NOT APPROVED

---

## 9) Final Approval Decision

Post-fix client logout helper runtime execution approval:

CREATED

Approved execution:

POST-FIX CLIENT LOGOUT HELPER RUNTIME VALIDATION ONLY

Current client helper method:

DELETE

Previous client helper method:

POST

Approved environment:

LOCAL DOCKER ONLY

Approved path:

Web → API Proxy → Core

Temporary login setup:

APPROVED ONLY AS LOGOUT PREREQUISITE

Runtime logout execution:

APPROVED FOR NEXT STEP ONLY

Code change:

NO

Database mutation:

NO

Billing change:

NO

Workflow change:

NO

Next valid action:

EXECUTE POST-FIX CLIENT LOGOUT HELPER RUNTIME VALIDATION LOCAL ONLY

Was anything deleted?

NO
