# HAWANA HSE — FIRST PILOT ADDITIONAL ROLE USERS EXISTENCE DISCOVERY PATH DECISION

Document Type: Additional Role Users Existence Discovery Path Decision
Repository: hawana-hse-web-admin
Date: 2026-05-30
Status: DECISION CREATED — API PROXY READ-ONLY PATH SELECTED
Mode: Stability First / Governance Only / No Code Change / No Data Change

---

## 1) Purpose

This document records the architectural decision for the next controlled additional role users existence discovery path.

The current evidence status is inconclusive.

The additional role users readiness is not verified.

The approved discovery must prove whether controlled local-only users exist for ADMIN, MANAGER, WORKER, and VIEWER.

This decision selects the architecture-compliant discovery path.

This decision does not execute runtime validation.

This decision does not create users.

This decision doet create roles.

This decision does not change code.

This decision does not mutate database state.

This decision does not modify companyId.

This decision does not change Billing.

This decision does not change Workflow.

---

## 2) Source Evidence

Primary read-only existence discovery execution approval:

- docs/FIRST_PILOT_CONTROLLED_ADDITIONAL_ROLE_USERS_READ_ONLY_EXISTENCE_DISCOVERY_EXECUTION_APPROVAL_2026_05_30.md

Primary read-only existence discovery plan:

- docs/FIRST_PILOT_CONTROLLED_ADDITIONAL_ROLE_USERS_READ_ONLY_EXISTENCE_DISCOVERY_PLAN_2026_05_30.md

Primary documentation discovery evidence:

- docs/FIRST_PILOT_CONTROLLED_ADDITIONAL_ROLE_USERS_DOCUMENTATION_DISCOVERY_EVIDENCE_2026_05_30.md

Primary additional role users readiness decision:

- docs/FIRST_PILOT_ADDITIONAL_ROLE_USERS_READINESS_DECISION_2026_05_30.md

---

## 3) Current State

Documentation-only discovery:

EXECUTED

Actual controlled role user existence:

NOT PROVEN

Additional role users readiness:

NOT VERIFIED

Evidence status:

INCONCLUSIVE

Roles requiring existence discovery:

ADMIN / MANAGER / WORKER / VIEWER

Controlled tenant:

Hawana Internal Validation

Controlled tenant id:

28b0d660-7367-4ab7-a05b-af7ae0041a99

---

## 4) Path Options Reviewed

Option A:

Direct database read-only query.

Decision:

REJECTED FOR THIS TRACK

Reason:

Direct DB access bypasses the approved Web → API Proxy → Core application architecture for application readiness validation.

Option B:

Direct Core call.

Decision:

REJECTED

Reason:

Direct Core call bypasses Web API Proxy boundary.

Option C:

Web API Proxy read-only discovery.

Decision:

SELECTED

Reason:

This preserves the required architecture path:

Web → API Proxy → Core

It keeps Backend as source of truth.

It avoids database mutation.

It avoids user creation.

It avoids direct Core access from UI/client context.

---

## 5) Selected Path

Selected discovery path:

WEB API PROXY READ-ONLY EXISTENCE DISCOVERY

Required architecture path:

Web → API Proxy → Core

ironment for future execution:

LOCAL DOCKER ONLY

Approved controlled tenant:

Hawana Internal Validation

Approved controlled tenant id:

28b0d660-7367-4ab7-a05b-af7ae0041a99

Roles requiring discovery:

ADMIN / MANAGER / WORKER / VIEWER

Expected evidence:

- HTTP status only
- role existence booleans
- safe email presence if returned by existing API
- tenant match boolean if safely available
- no password values
- no password hash values
- no token values
- no full cookie values

---

## 6) Not Approved By This Decision

The following are not approved:

- code change
- database mutation
- tenant creation
- user creation
- role creation
- direct DB query
- direct Core call
- production validation
- first real pilot validation
- Billing change
- companyId change
- Workflow change
- Core modification
- Web route modification
- Docker restart
- Docker rebuild
- Docker compose up
- Docker compose down

---

## 7) Required Next Step

Before execution, create a separate explicit execution approval for:

CONTROLLED ADDITIONAL ROLE USERS API PROXY READ-ONLY EXISTENCE DISCOVERY

The execution approval must define:

- exact endpoint path
- exact method
- allowed role checks
- allowed evidence fields
- forbidden output
- stop conditions
- no mutation guarantee

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

Role creation:

NO

companyId modification:

NO

Billing change:

NO

Workflow change:

NO

Direct DB query:

NOT APPROVED

Direct Core call:

NOT APPROVED

Runtime validation:

NOT STARTED

Runtime approval:

NOT APPROVED BY THIS DECISION

Production validation:

NOT APPROVED

First real pilot validation:

NOT APPROVED

---

## 9) Final Path Decision

Additional role users existence discovery path decision:

RECORDED

Selected path:

WEB API PROXY READ-ONLY EXISTENCE DISCOVERY

Architecture path:

Web → API Proxy → Core

Current evidence status:

INCONCLUSIVE

Additional role users readiness:

NOT VERIFIED

Roles requiring discovery:

ADMIN / MANAGER / WORKER / VIEWER

Direct DB query:

REJECTED FOR THIS TRACK

Direct Core call:

REJECTED

User creation:

NOT APPROVED

Database mutation:

NO

Next valid action:

CREATE CONTROLLED ADDITIONAL ROLE USERS API PROXY READ-ONLY EXISTENCE DISCOVERY EXECUTION APPROVAL

Was anything deleted?

NO
