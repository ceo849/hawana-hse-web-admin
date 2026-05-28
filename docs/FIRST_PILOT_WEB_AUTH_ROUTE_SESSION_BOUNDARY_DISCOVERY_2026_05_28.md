# HAWANA HSE — FIRST PILOT WEB AUTH ROUTE SESSION BOUNDARY DISCOVERY

Document Type: Web Auth Route / Session Boundary Discovery  
Repository: hawana-hse-web-admin  
Date: 2026-05-28  
Status: READ-ONLY DISCOVERY COMPLETED — LOGIN NOT EXECUTED  
Mode: Stability First / Governance Only / Read Only / No Runtime Change / No Data Change  

---

## 1) Purpose

This document records the read-only Web auth route and session boundary discovery performed in the Web Admin repository.

This document identifies how Web auth proxy routes interact with Core auth endpoints and how session cookies are handled.

This document does not execute login.

This document does not execute refresh.

This document does not execute logout.

This document does not execute runtime validation.

This document does not approve runtime validation execution.

This document does not approve code change.

This document does not approve Web UI change.

This document does not approve Core code change.

This document does not approve Docker restart.

This document does not approve Docker rebuild.

This document does not approve docker compose up.

This document does not approve docker compose down.

This document does not approve tenant creation.

This document does not approve production database mutation.

This document does not approve API mutation.

This document does not approve Billing change.

This document does not approve companyId modification.

This document does not approve Workflow change.

This document does not approve API contract change.

This document does not approve first real external pilot execution.

---

## 2) Repository State

Repository:

- hawana-hse-web-admin

Branch:

- phase4.3-web-hardening

Observed commit:

- ef75afa

Observed tag:

- first-pilot-web-health-api-proxy-verification-2026-05-28

Observed status:

- clean before discovery
- clean after discovery

---

## 3) Source Files Inspected

The following files were inspected read-only:

- app/api/auth/login/route.ts
- app/api/auth/refresh/route.ts
- app/api/auth/logout/route.ts
- app/api/debug/session/route.ts
- src/lib/auth-cookie-options.ts
- lib/server-auth.ts
- src/lib/server-app-fetch.ts

No file was modified.

---

## 4) Login Route Source Discovery

Observed file:

- app/api/auth/login/route.ts

Observed method:

- POST

Observed Core target:

- CORE_API_BASE_URL + /v1/auth/login

Observed behavior:

- validates request body presence
- requires email
- requires password
- forwards email and password to Core auth login endpoint
- reads access token from Core response
- reads refresh token from Core response when present
- sets access_token cookie
- sets refresh_token cookie when present
- uses authCookieOptions for cookie options

Current login route source status:

CONFIRMED FROM SOURCE CODE

Important boundary:

Login was not executed.

No credentials were submitted.

No session was created by this discovery.

---

## 5) Refresh Route Source Discovery

Observed file:

- app/api/auth/refresh/route.ts

Observed method:

- POST

Observed Core target:

- CORE_API_BASE_URL + /v1/auth/refresh

Observed behavior:

- reads refresh_token from HttpOnly cookie store
- returns 401 if refresh token is missing
- forwards refreshToken to Core refresh endpoint
- reads access token from Core response
- sets renewed access_token cookie
- clears access_token and refresh_token cookies if refresh fails
- uses authCookieOptions for cookie options

Current refresh route source status:

CONFIRMED FROM SOURCE CODE

Important boundary:

Refresh was not executed.

No token was submitted.

No session was renewed by this discovery.

---

## 6) Logout Route Source Discovery

Observed file:

- app/api/auth/logout/route.ts

Observed method:

- DELETE

Observed behavior:

- returns ok true
- clears access_token cookie
- clears refresh_token cookie
- uses authCookieOptions for cookie options

Observed Core target:

- none

Current logout route source status:

CONFIRMED FROM SOURCE CODE

Important boundary:

Logout was not executed.

No session was cleared by this discovery.

---

## 7) Auth Cookie Options Discovery

Observed file:

- src/lib/auth-cookie-options.ts

Observed behavior:

- cookies are HttpOnly
- cookie path is /
- secure flag is derived from real request context
- HTTPS detection is proxy-aware through x-forwarded-proto
- SameSite is none when secure
- SameSite is lax when not secure
- production domain cookie is allowed only for hawanaglobal.com or subdomains over HTTPS

Current auth cookie option status:

CONFIRMED FROM SOURCE CODE

Architecture implication:

Auth cookie behavior is request-context driven and proxy-aware.

---

## 8) Debug Session Route Discovery

Observed file:

- app/api/debug/session/route.ts

Observed method:

- GET

Observed behavior:

- reads cookies
- reads request headers
- reports NODE_ENV
- reports CORE_API_BASE_URL presence
- reports secure request interpretation
- reports auth cookie flags
- reports whether access_token is present
- reports whether refresh_token is present
- previews cookie values only

Current debug session route status:

CONFIRMED FROM SOURCE CODE

Important boundary:

Debug session route is read-only.

Debug session route does not execute login.

Debug session route does not mutate data.

---

## 9) Server Auth Helper Discovery

Observed file:

- lib/server-auth.ts

Observed behavior:

- reads access_token from cookies
- redirects to /login if access_token is missing
- returns access token when present

Current server auth helper status:

CONFIRMED FROM SOURCE CODE

---

## 10) Architecture Boundary

Expected architecture contract:

Web → API Proxy → Core

Current auth source discovery supports:

- Web auth routes call Core auth endpoints from server-side route handlers.
- Browser-facing auth paths remain under /api/auth.
- Core auth endpoints remain under /v1/auth.
- Tokens are persisted in HttpOnly cookies.
- Server-side protected pages rely on cookie-based access token presence.

Current architecture status:

WEB AUTH ROUTE SESSION BOUNDARY CONFIRMED FROM SOURCE CODE

Important boundary:

This is source discovery only.

This is not login validation.

This is not refresh runtime validation.

This is not logout runtime validation.

This is not tenant validation.

This is not role validation.

---

## 11) Non-Scope Confirmation

The following were not executed:

- code change
- login
- refresh
- logout
- runtime validation
- Docker restart
- Docker rebuild
- docker compose up
- docker compose down
- tenant creation
- database mutation
- API mutation

Execution safety result:

READ-ONLY DISCOVERY ONLY

---

## 12) Current Readiness Impact

Web auth login route source:

CONFIRMED

Web auth refresh route source:

CONFIRMED

Web auth logout route source:

CONFIRMED

Auth cookie option source:

CONFIRMED

Debug session route source:

CONFIRMED

Server auth helper source:

CONFIRMED

Auth runtime readiness:

NOT VERIFIED

Controlled test tenant:

NOT CONFIRMED

Required test users / roles:

NOT VERIFIED

Runtime validation execution:

NOT STARTED

---

## 13) Remaining Blockers Before Runtime Validation Approval

The following remain blockers before runtime validation approval:

- auth runtime readiness not verified
- controlled test tenant not confirmed
- required test users / roles not verified
- no runtime validation approval granted

Current blocker status:

RUNTIME VALIDATION STILL BLOCKED

---

## 14) Next Valid Action

The next valid action is controlled test tenant and test users readiness discovery.

Required discovery:

- identify whether a controlled test tenant already exists
- identify whether approved test users exist
- identify required roles for validation
- confirm no real customer data will be used
- avoid login execution
- avoid tenant creation
- avoid database mutation
- avoid API mutation

No code change is approved by this document.

No runtime validation execution is approved by this document.

---

## 15) Explicit Non-Scope

This discovery does not approve:

- runtime validation execution
- login validation
- refresh validation
- logout validation
- findings closure
- findings downgrade
- accepted risk
- Web UI change
- Core code change
- tenant creation
- tenant deletion
- tenant mutation
- production database mutation
- direct SQL execution
- API mutation
- Billing override
- companyId modification
- Workflow change
- API contract change
- Docker restart
- Docker rebuild
- docker compose up
- docker compose down
- runtime deployment
- first real external pilot execution

---

## 16) Final Discovery Decision

Web auth route and session boundary discovery:

COMPLETED AS READ-ONLY DISCOVERY

Login route source:

CONFIRMED

Refresh route source:

CONFIRMED

Logout route source:

CONFIRMED

Auth cookie options:

CONFIRMED

Debug session route:

CONFIRMED

Server auth helper:

CONFIRMED

Auth runtime readiness:

NOT VERIFIED

Controlled test tenant:

NOT CONFIRMED

Required test users / roles:

NOT VERIFIED

Runtime validation execution:

NOT STARTED

Runtime validation execution approval:

NOT APPROVED

Production validation:

NOT APPROVED

Production mutation:

NOT APPROVED

Findings Register status change:

NOT APPROVED

First real pilot tenant:

NOT APPROVED YET

First real external pilot:

NOT APPROVED YET

Was anything deleted?

NO
