# HAWANA HSE — FIRST PILOT ADDITIONAL ROLE USERS LOCAL SESSION COOKIE CREATION EXECUTION APPROVAL

Document Type: Additional Role Users Local Session Cookie Creation Execution Approval
Repository: hawana-hse-web-admin
Date: 2026-05-30
Status: APPROVAL CREATED — ROLE SESSION COOKIE CREATION APPROVED FOR NEXT STEP ONLY
Mode: Stability First / Approval Only / No Code Change / No Data Change

---

## 1) Purpose

This document records explicit approval to create local session cookie jars for existing additional role users.

This approval is required before executing the read-only accemoke test because role-specific GET testing requires authenticated sessions for each role.

Approved architecture path:

Web → API Proxy → Core

Approved login route:

POST /api/auth/login

Approved purpose:

Create temporary local cookie jars only for read-only smoke testing.

---

## 2) Source Approval

Primary source approval:

- docs/FIRST_PILOT_ADDITIONAL_ROLE_USERS_API_PROXY_READ_ONLY_ACCESS_SMOKE_TEST_EXECUTION_APPROVAL_2026_05_30.md

Reason this approval is required:

The smoke test approval allows GET-only route testing.

However, role-specific smoke testing requires prior authenticated sessions.

Session creation uses POST /api/auth/login and therefore requires separate explicit approval.

---

## 3) Approved Scope

Approved environment:

LOCAL ONLY

Approved users:

ADMIN / MANAGER / WORKER / VIEWER

Approved action:

CREATE TEMPORARY LOCAL SESSION COOKIE JARS ONLY

Approved login route:

POST /api/auth/login

Approved password handling:

INPUT ONLY — NO OUTPUT

Approved cookie handling:

TLE ONLY — NO FULL COOKIE OUTPUT

Approved token handling:

NO TOKEN OUTPUT

Approved next use:

READ-ONLY GET SMOKE TEST ONLY

---

## 4) Explicitly Not Approved

The following are not approved:

- user creation
- role creation
- database mutation
- companyId modification
- Billing change
- Workflow change
- direct Core call
- direct DB query
- backend bypass
- production validation
- first real pilot validation
- password output
- token output
- full cookie output
- full response output
- destructive Docker action
- Docker prune
- Docker volume deletion

---

## 5) Safety Boundary

Code change:

NO

Database mutation:

NO

User creation:

NO

Role creation:

NO

companyId modification:

NO

Billing change:

NO

Workflow change:

NO

Direct Core call:

NO

Direct DB query:

NO

Backend bypass:

NO

---

## 6) Final Approval Decision

Additional role users local session cookie creation execution approval:

CREATED

Approved execution:

CREATE TEMPORARY LOCAL ROLE SESSION COOKIE JARS ONLY

Approved environment:

LOCAL ONLY

Approved roles:

ADMIN / MANAGER / WORKER / VIEWER

Approved login route:

POST /api/auth/login

Approved architecture path:

Web → API Proxy → Core

Password output:

NO

Token output:

NO

Full cookie output:

NO

Database mutation:

NO

Next valid action:

EXECUTE CONTROLLED ADDITIONAL ROLE USERS LOCAL SESSION COOKIE CREATION LOCAL ONLY

Was anything deleted?

NO
