# HAWANA HSE — FIRST PILOT ADDITIONAL ROLE USERS API PROXY ROUTE DISCOVERY EVIDENCE

Document Type: Additional Re Users API Proxy Route Discovery Evidence
Repository: hawana-hse-web-admin
Date: 2026-05-30
Status: ROUTE DISCOVERY COMPLETED — SAFE API PROXY USERS ROUTE FOUND
Mode: Stability First / Governance Only / No Code Change / No Data Change

---

## 1) Purpose

This document records the controlled route discovery evidence for additional role users API Proxy read-only existence discovery.

The approved discovery path is Web API Proxy read-only existence discovery.

The purpose of this step is only to confirm whether a safe existing Web API Proxy route exists before any read-only HTTP existence check.

This document does not execute runtime login.

This document does not execute runtime logout.

This document does not create users.

This document does not create roles.

This document does not change code.

This document does not mutate database state.

This document does not modify companyId.

This document does not change Billing.

This document does not change Workflow.

This document does not approve producti validation.

This document does not approve first real pilot validation.

---

## 2) Source Approval

Primary API Proxy read-only existence discovery execution approval:

- docs/FIRST_PILOT_CONTROLLED_ADDITIONAL_ROLE_USERS_API_PROXY_READ_ONLY_EXISTENCE_DISCOVERY_EXECUTION_APPROVAL_2026_05_30.md

Primary existence discovery path decision:

- docs/FIRST_PILOT_ADDITIONAL_ROLE_USERS_EXISTENCE_DISCOVERY_PATH_DECISION_2026_05_30.md

Primary documentation discovery evidence:

- docs/FIRST_PILOT_CONTROLLED_ADDITIONAL_ROLE_USERS_DOCUMENTATION_DISCOVERY_EVIDENCE_2026_05_30.md

---

## 3) Route Discovery Method

Discovery method:

LOCAL FILE INSPECTION ONLY

Runtime HTTP execution:

NOT STARTED

Runtime login:

NOT EXECUTED

Runtime logout:

NOT EXECUTED

Direct Core call:

NOT EXECUTED

Direct DB query:

NOT EXECUTED

Code change:

NO

Database mutation:

NO

---

## 4) Discovered Relevant Web API Routes

Discovered user-related Web API route:

app/api/users/route.ts

Supported safe read-only method:

GET

Exposed Web API Proxy path:

/api/users

Upstream Core path used internally by Web API Proxy:

/v1/users

Architecture path:

Web → API Proxy → Core

Token source:

HttpOnly access_token cookie read by Web API route through Next cookies()

companyId source:

Core/JWT only

companyId from client payload:

NOT USED

companyId from route path:

NOT USED

---

## 5) Deprecated Route Finding

Discovered deprecated route:

app/api/platform/companies/[companyId]/users/route.ts

Route status:

DISABLED

HTTP behavior:

410 Gone

Reason:

companyId must not come from request path or request body.

Decision:

REJECTED FOR ADDITIONAL ROLE USERS EXISTENCE DISCOVERY

Approved alternative:

Use /api/users only.

---

## 6) Safety Assessment

Safe API Proxy users route found:

YES

Approved route for future read-only existence discovery:

/api/users

Approved method:

GET

Requires authenticated session:

YES

Expected authentication source:

Existing HttpOnly access_token cookie

Password output required:

NO

Token output reed:

NO

Full cookie output required:

NO

Direct DB query required:

NO

Direct Core call required:

NO

User creation required:

NO

Role creation required:

NO

Code change required:

NO

Database mutation required:

NO

---

## 7) Not Approved By This Evidence

The following are not approved:

- runtime login
- runtime logout
- user creation
- role creation
- direct DB query
- direct Core call
- code change
- Web route modification
- Core modification
- Billing change
- companyId change
- Workflow change
- production validation
- first real pilot validation
- password output
- token output
- full cookie output
- sensitive user payload dump

---

## 8) Evidence Result

API Proxy route discovery:

COMPLETED

Safe users API Proxy route:

FOUND

Approved future route:

/api/users

Approved future method:

GET

Architecture path:

Web → API Proxy → Core

Deprecated companyId path route:

REJECTED

Additional role users actual existence:

NOT CHECKED IN THIS STEP

Additional role users readiness:

NOT VERIFIED

Current evidence status:

ROUTE FOUND — EXISTENCE CHECK NOT STARTED

Next valid action:

CREATE CONTROLLED ADDITIONAL ROLE USERS API PROXY READ-ONLY EXISTENCE DISCOVERY EXECUTION COMMAND PLAN

Was anything deleted?

NO
