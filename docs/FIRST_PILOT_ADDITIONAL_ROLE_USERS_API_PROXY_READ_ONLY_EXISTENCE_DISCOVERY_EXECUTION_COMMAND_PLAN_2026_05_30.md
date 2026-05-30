# HAWANA HSE — FIRST PILOT ADDITIONAL ROLE USERS API PROXY READ-ONLY EXISTENCE DISCOVERY EXECUTION COMMAND PLAN

Document Type: API Proxy Read-Only Existence Discovery Execution Command Plan
Repository: hawana-hse-web-admin
Date: 2026-05-30
Status: COMMAND PLAN CREATED — EXECUTION NOT STARTED
Mode: Stability First / Governance Only / No Code Change / No Data Change

---

## 1) Purpose

This document defines the controlled execution command plan for additional role users API Proxy read-only existence discovery.

The safe Web API Proxy users route has been discovered.

Approved route:

GET /api/users

Approved architecture path:

Web → API Proxy → Core

This plan does not execute runtime login.

This plan does not execute runtime logout.

This plan does not create users.

This plan does not create roles.

This plan does not change code.

This plan does not mutate database stat plan does not modify companyId.

This plan does not change Billing.

This plan does not change Workflow.

This plan does not approve production validation.

This plan does not approve first real pilot validation.

---

## 2) Source Evidence

Primary route discovery evidence:

- docs/FIRST_PILOT_ADDITIONAL_ROLE_USERS_API_PROXY_ROUTE_DISCOVERY_EVIDENCE_2026_05_30.md

Primary API Proxy read-only existence discovery approval:

- docs/FIRST_PILOT_CONTROLLED_ADDITIONAL_ROLE_USERS_API_PROXY_READ_ONLY_EXISTENCE_DISCOVERY_EXECUTION_APPROVAL_2026_05_30.md

Primary path decision:

- docs/FIRST_PILOT_ADDITIONAL_ROLE_USERS_EXISTENCE_DISCOVERY_PATH_DECISION_2026_05_30.md

---

## 3) Approved Execution Boundary

Approved execution type:

READ-ONLY HTTP CHECK THROUGH WEB API PROXY ONLY

Approved environment:

LOCAL DOCKER ONLY

Approved route:

/api/users

Approved method:

GET

Approved architecture path:

Web → API Proxy → Core

Approved purpose:

Determine whether users with ADMIN, MANAGER, WORKER, and VIEWER roles visible through the approved Web API Proxy route under the current authenticated local controlled session.

---

## 4) Strict Forbidden Scope

The following are not approved:

- runtime login
- runtime logout
- direct Core call
- direct DB query
- user creation
- role creation
- code change
- Web route modification
- Core modification
- database mutation
- companyId modification
- Billing change
- Workflow change
- production validation
- first real pilot validation
- password output
- token output
- full cookie output
- raw credential output
- sensitive payload dump

---

## 5) Required Execution Controls

The execution command must:

- verify git status is clean before execution
- call only Web API Proxy route /api/users
- use existing browser/session cookie source only if already available locally
- avoid printing full cookies
- avoid printing tokens
- avoid printing passwords
- summarize only role existence booleans
- record whether ADMIN exists
- record whether MANAGER exists
- record whether WORKER exists
- record whether VIEWER exists
- record whether evidence is conclusive or inconclusive
- verify git status remains clean after execution

---

## 6) Approved Output Shape

The approved output must be boolean-only:

admin_exists=true_or_false_or_unknown

manager_exists=true_or_false_or_unknown

worker_exists=true_or_false_or_unknown

viewer_exists=true_or_false_or_unknown

evidence_status=CONCLUSIVE_OR_INCONCLUSIVE

No password values.

No token values.

No full cookie values.

No raw sensitive payload.

---

## 7) Safety Result

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

Runtime login:

NOT APPROVED

Runtime logout:

NOT APPROVED

Direct Core call:

NOT APPROVED

Direct DB query:

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

## 8) Final Command Plan Decision

API Proxy read-only existence discovery execution command plan:

CREATED

Approved route:

/api/users

Approved method:

GET

Architecture path:

Web → API Proxy → Core

Execution status:

NOT STARTED

Runtime login:

NOT APPROVED

Runtime logout:

NOT APPROVED

Direct Core call:

NOT APPROVED

Direct DB query:

NOT APPROVED

User creation:

NOT APPROVED

Database mutation:

NO

Next valid action:

EXECUTE CONTROLLED ADDITIONAL ROLE USERS API PROXY READ-ONLY EXISTENCE DISCOVERY LOCAL ONLY

Was anything deleted?

NO
