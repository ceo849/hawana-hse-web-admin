# HAWANA HSE — FIRST PILOT POST-FIX CLIENT LOGOUT HELPER RUNTIME VALIDATION PLAN

Document Type: Post-Fix Client Logout Helper Runtime Validation Plan  
Repository: hawana-hse-web-admin  
Date: 2026-05-30  
Status: PLAN CREATED — RUNTIME EXECUTION NOT STARTED  
Mode: Stability First / Governance Only / No Code Change / No Data Change  

---

## 1) Purpose

This document defines the controlled runtime validation plan after fixing the client logout helper method.

The client logout helper now calls apiClient.delete('/auth/logout').

The Web logout route has already been verified using DELETE.

The code fix has already passed build validation.

This plan validates the actual client helper path after the code fix.

This document does not execute logout.

This document does not change code.

This document does not mutate database state.

This document does not modify companyId.

This document does not change Billing.

This document does not change Workflow.

---

## 2) Source Evidence

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

## 4) Approved Future Runtime Validation Scope

Approved future validation target:

Client logout helper behavior after method alignment.

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

Approved validation purpose:

Confirm that the UI/client helper logout path no longer uses POST and successfully reaches the DELETE-compatible Web logout route.

---

## 5) Planned Execution Sequence

Approved execution sequence after separate runtime approval:

1. Verify clean git status.
2. Verify current commit and tag.
3. Verify Web health locally.
4. Verify Core health locally.
5. Prepare temporary cookie jar outside the project.
6. Enter OWNER password silently.
7. Execute temporary OWNER login setup through Web API Proxy.
8. Verify session presence before logout using boolean-only debug evidence.
9. Execute logout through the fixed client-helper-equivalent DELETE path.
10. Verify session absence after logout using boolean-only debug evidence.
11. Delete all temporary sensitive files from /tmp.
12. Verify git status remains clean.

Temporary login setup:

APPROVED ONLY AS LOGOUT PREREQUISITE AFTER SEPARATE EXECUTION APPROVAL

Runtime logout execution:

NOT APPROVED BY THIS PLAN

---

## 6) Evidence Capture Boundary

Approved evidence:

- Web health status
- Core health status
- temporary login setup HTTP status code
- temporary login setup success boolean
- session presence booleans before logout
- fixed logout path HTTP status code
- fixed logout success boolean if returned
- session presence booleans after logout
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

## 7) Strict Forbidden Scope

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
- route guessing

---

## 8) Stop Conditions

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

## 9) Execution Approval Status

Post-fix client logout helper runtime validation:

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

## 10) Final Plan Decision

Post-fix client logout helper runtime validation plan:

CREATED

Current client helper method:

DELETE

Previous client helper method:

POST

API client DELETE support:

CONFIRMED

Build validation:

PASSED

Approved environment:

LOCAL DOCKER ONLY

Approved path:

Web → API Proxy → Core

Runtime execution:

NOT STARTED

Runtime execution approval:

NOT APPROVED

Code change:

NO

Database mutation:

NO

Billing change:

NO

Workflow change:

NO

Next valid action:

CREATE EXPLICIT POST-FIX CLIENT LOGOUT HELPER RUNTIME EXECUTION APPROVAL

Was anything deleted?

NO
