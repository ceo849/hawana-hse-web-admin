# HAWANA HSE — FIRST PILOT CONTROLLED OWNER AUTH SESSION AFTER LOGOUT EVIDENCE CLARIFICATION PLAN

Document Type: Controlled OWNER Auth Session After Logout Evidence Clarification Plan  
Repository: hawana-hse-web-admin  
Date: 2026-05-30  
Status: PLAN CREATED — CLARIFICATION EXECUTION NOT STARTED  
Mode: Stability First / Governance Only / No Code Change / No Data Change  

---

## 1) Purpose

This document defines the clarification plan for the ambiguous session-after-logout evidence observed during controlled OWNER auth runtime validation.

The controlled OWNER login succeeded.

The session-before-logout evidence succeeded.

The cleanup logout endpoint returned HTTP 200.

However, the session-after-logout evidence was not accepted as conclusive because the boolean-only text scan still reported cookie, access token, and refresh token indicators after logout.

This plan does not assume whether the result is a real logout defect or a false positive in evidence collection.

This plan exists only to clarify the evidence collection method.

This document does not execute runtime validation.

This document does not change code.

This document does not mutate database state.

This document does not modify companyId.

This document does not change Billing.

This document does not change Workflow.

---

## 2) Source Evidence

Primary blocker evidence:

- docs/FIRST_PILOT_CONTROLLED_OWNER_AUTH_RUNTIME_BLOCKER_EVIDENCE_2026_05_30.md

Primary execution approval:

- docs/FIRST_PILOT_CONTROLLED_OWNER_AUTH_RUNTIME_EXECUTION_APPROVAL_2026_05_30.md

Primary validation plan:

- docs/FIRST_PILOT_CONTROLLED_OWNER_AUTH_RUNTIME_VALIDATION_PLAN_2026_05_30.md

Primary test tenant and test users readiness decision:

- docs/FIRST_PILOT_TEST_TENANT_AND_TEST_USERS_READINESS_DECISION_2026_05_30.md

---

## 3) Confirmed Blocker

Blocker:

SESSION AFTER LOGOUT EVIDENCE AMBIGUOUS

Observed after logout:

- session after logout HTTP status: 200
- session after logout debug ok boolean: true
- after logout cookie header present: true
- after logout access token present: true
- after logout refresh token present: true

Accepted conclusion:

OWNER auth runtime readiness is not verified.

Rejected conclusion:

Do not conclude that logout is broken without clarifying whether the evidence scan is accurate.

---

## 4) Clarification Objective

Clarification objective:

Determine whether the session-after-logout evidence is a true auth/session persistence issue or a false positive caused by scanning static field names or debug response labels.

Approved clarification approach:

Use stricter boolean-only checks that inspect explicit response fields or cookie jar state without printing sensitive values.

Approved clarification evidence:

- HTTP status codes
- explicit boolean fields only
- cookie name presence booleans only
- access token presence boolean only
- refresh token presence boolean only
- no token values
- no full cookie values
- no Set-Cookie values
- no password values

---

## 5) Approved Future Clarification Scope

Approved future clarification target:

SESSION AFTER LOGOUT EVIDENCE ONLY

Approved environment:

LOCAL DOCKER ONLY

Approved user:

owner3@hawana.com

Approved tenant:

Hawana Internal Validation

Approved tenant id:

28b0d660-7367-4ab7-a05b-af7ae0041a99

Approved architecture path:

Web → API Proxy → Core

Approved route family:

- /api/auth/login
- /api/debug/session
- /api/auth/logout

Approved method for logout:

DELETE

---

## 6) Planned Clarification Sequence

Approved execution sequence after separate explicit execution approval:

1. Verify clean git status.
2. Verify current commit and tag.
3. Verify Web health locally.
4. Prepare temporary cookie jar outside the project.
5. Enter OWNER password silently.
6. Execute controlled OWNER login through Web API Proxy.
7. Verify session before logout using strict boolean-only evidence.
8. Execute DELETE /api/auth/logout through Web API Proxy.
9. Inspect cookie jar state after logout using cookie name presence booleans only.
10. Inspect /api/debug/session response using explicit parsed fields only.
11. Record whether session-after-logout absence is proven or remains blocked.
12. Delete all temporary sensitive files from /tmp.
13. Verify git status remains clean.

Runtime execution:

NOT APPROVED BY THIS PLAN

Runtime login:

NOT APPROVED BY THIS PLAN

Runtime logout:

NOT APPROVED BY THIS PLAN

---

## 7) Strict Forbidden Scope

The following are not approved:

- production login
- production logout
- first real pilot login
- first real pilot logout
- ADMIN runtime validation
- MANAGER runtime validation
- WORKER runtime validation
- VIEWER runtime validation
- code change
- database mutation
- tenant creation
- user creation
- Core modification
- Web route modification
- API client modification
- auth redesign
- token handling redesign
- cookie handling redesign
- Billing change
- companyId change
- Workflow change
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

## 8) Safety Result

Code change:

NO

Database mutation:

NO

Tenant creation:

NO

User creation:

NO

companyId modification:

NO

Billing change:

NO

Workflow change:

NO

Runtime validation:

NOT STARTED

Runtime execution approval:

NOT APPROVED

Production validation:

NOT APPROVED

First real pilot validation:

NOT APPROVED

Password output:

NO

Token output:

NO

Cookie output:

NO

---

## 9) Final Plan Decision

Controlled OWNER auth session after logout evidence clarification plan:

CREATED

Clarification target:

SESSION AFTER LOGOUT EVIDENCE ONLY

Current blocker:

SESSION AFTER LOGOUT EVIDENCE AMBIGUOUS

Current runtime readiness:

NOT VERIFIED

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

CREATE EXPLICIT CONTROLLED OWNER AUTH SESSION AFTER LOGOUT EVIDENCE CLARIFICATION EXECUTION APPROVAL

Was anything deleted?

NO
