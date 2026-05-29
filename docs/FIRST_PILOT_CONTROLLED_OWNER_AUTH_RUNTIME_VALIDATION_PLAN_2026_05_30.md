# HAWANA HSE — FIRST PILOT CONTROLLED OWNER AUTH RUNTIME VALIDATION PLAN

Document Type: Controlled OWNER Auth Runtime Validation Plan  
Repository: hawana-hse-web-admin  
Date: 2026-05-30  
Status: PLAN CREATED — RUNTIME EXECUTION NOT STARTED  
Mode: Stability First / Governance Only / No Code Change / No Data Change  

---

## 1) Purpose

This document defines the controlled local runtime validation plan for OWNER auth readiness.

The Web Logout track is closed.

The controlled test tenant readiness is confirmed for local First Pilot readiness validation only.

The controlled OWNER user readiness is confirmed for local First Pilot readiness validation only.

Additional role users are not confirmed.

This plan validates OWNER auth runtime readiness using the approved controlled tenant and controlled OWNER user.

This document does not execute login.

This document does not execute logout.

This document does not change code.

This document does not mutate database state.

This document does not modify companyId.

This document does not change Billing.

This document does not change Workflow.

---

## 2) Source Evidence

Primary test tenant and test users readiness decision:

- docs/FIRST_PILOT_TEST_TENANT_AND_TEST_USERS_READINESS_DECISION_2026_05_30.md

Primary test tenant and test users readiness discovery:

- docs/FIRST_PILOT_TEST_TENANT_AND_TEST_USERS_READINESS_DISCOVERY_2026_05_30.md

Primary next open track decision:

- docs/FIRST_PILOT_NEXT_OPEN_TRACK_DECISION_2026_05_30.md

Primary auth/session boundary discovery:

- docs/FIRST_PILOT_WEB_AUTH_ROUTE_SESSION_BOUNDARY_DISCOVERY_2026_05_28.md

Primary Web health API proxy verification:

- docs/FIRST_PILOT_WEB_HEALTH_API_PROXY_VERIFICATION_2026_05_28.md

---

## 3) Confirmed Controlled Scope

Controlled tenant:

Hawana Internal Validation

Controlled tenant id:

28b0d660-7367-4ab7-a05b-af7ae0041a99

Controlled user:

owner3@hawana.com

Controlled user role:

OWNER

Approved environment:

LOCAL DOCKER ONLY

Approved architecture path:

Web → API Proxy → Core

Production validation:

NOT APPROVED

First real pilot validation:

NOT APPROVED

Additional role validation:

NOT APPROVED

---

## 4) Approved Future Runtime Validation Target

Approved future validation target:

OWNER AUTH RUNTIME READINESS ONLY

Approved validation intent:

Confirm that the controlled OWNER user can authenticate through the Web API Proxy and that the Web session boundary reports auth/session presence using boolean-only evidence.

Approved route family:

- /api/auth/login
- /api/debug/session
- /api/auth/logout

Approved runtime evidence:

- Web health HTTP status
- Core health HTTP status
- login HTTP status
- login ok boolean
- access token field presence boolean
- session debug ok boolean
- cookie header presence boolean
- access token presence boolean
- refresh token presence boolean
- logout HTTP status
- logout ok boolean if returned
- session absence after cleanup/logout
- no sensitive values

---

## 5) Planned Execution Sequence

Approved execution sequence after separate runtime execution approval:

1. Verify clean git status.
2. Verify current commit and tag.
3. Verify Web health locally.
4. Verify Core health locally.
5. Prepare temporary cookie jar outside the project.
6. Enter OWNER password silently.
7. Execute controlled OWNER login through Web API Proxy.
8. Verify login result using boolean-only evidence.
9. Verify session presence using /api/debug/session with boolean-only evidence.
10. Execute controlled cleanup logout using DELETE /api/auth/logout.
11. Verify session absence after logout using boolean-only evidence.
12. Delete all temporary sensitive files from /tmp.
13. Verify git status remains clean.

Temporary login setup:

NOT APPROVED BY THIS PLAN

Runtime login execution:

NOT APPROVED BY THIS PLAN

Runtime logout execution:

NOT APPROVED BY THIS PLAN

---

## 6) Evidence Capture Boundary

Approved evidence format:

BOOLEAN AND HTTP STATUS ONLY

Allowed evidence:

- HTTP status codes
- true or false values
- route path names
- method names
- controlled tenant name
- controlled tenant id
- controlled user email
- role name

Forbidden evidence:

- password value
- access token value
- refresh token value
- full cookie value
- authorization header value
- Set-Cookie full value
- production data
- first real pilot credentials
- uncontrolled tenant data

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
- tenant creation
- user creation
- role creation
- database mutation
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

- git status is not clean before execution
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
- companyId mutation becomes required
- Billing behavior becomes involved
- Workflow behavior becomes involved
- session evidence becomes ambiguous

---

## 9) Safety Result

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

## 10) Final Plan Decision

Controlled OWNER auth runtime validation plan:

CREATED

Controlled tenant:

Hawana Internal Validation

Controlled tenant id:

28b0d660-7367-4ab7-a05b-af7ae0041a99

Controlled OWNER user:

owner3@hawana.com

Approved environment:

LOCAL DOCKER ONLY

Approved path:

Web → API Proxy → Core

Runtime validation:

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

CREATE EXPLICIT CONTROLLED OWNER AUTH RUNTIME EXECUTION APPROVAL

Was anything deleted?

NO
