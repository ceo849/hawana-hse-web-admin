# HAWANA HSE — FIRST PILOT TEST TENANT AND TEST USERS READINESS DISCOVERY

Document Type: Test Tenant and Test Users Readiness Discovery  
Repository: hawana-hse-web-admin  
Date: 2026-05-30  
Status: DISCOVERY CREATED — RUNTIME EXECUTION NOT STARTED  
Mode: Stability First / Governance Only / No Code Change / No Data Change  

---

## 1) Purpose

This document records the controlled discovery scope for the First Pilot test tenant and test users readiness track.

The previous Web Logout track is closed.

The next open readiness blocker is auth runtime readiness not fully verified.

Before any additional runtime validation, the controlled test tenant and test users must be confirmed.

This document does not create a tenant.

This document does not create users.

This document does not change code.

This document does not execute runtime validation.

This document does not mutate database state.

This document does not modify companyId.

This document does not change Billing.

This document does not change Workflow.

---

## 2) Source Evidence

Primary next open track decision:

- docs/FIRST_PILOT_NEXT_OPEN_TRACK_DECISION_2026_05_30.md

Primary auth/session boundary discovery:

- docs/FIRST_PILOT_WEB_AUTH_ROUTE_SESSION_BOUNDARY_DISCOVERY_2026_05_28.md

Primary Web health API proxy verification:

- docs/FIRST_PILOT_WEB_HEALTH_API_PROXY_VERIFICATION_2026_05_28.md

Primary Web Logout track closure:

- docs/FIRST_PILOT_WEB_LOGOUT_TRACK_CLOSURE_DECISION_2026_05_30.md

---

## 3) Confirmed Previous Closed Track

Closed track:

WEB LOGOUT TRACK

Closure status:

CLOSED

Logout root cause:

CLIENT LOGOUT HELPER METHOD MISMATCH

Final logout method:

DELETE

Runtime validation:

VERIFIED

Session result:

AUTH COOKIES CLEARED

Architecture path:

Web → API Proxy → Core

---

## 4) Current Open Readiness Track

Selected open track:

TEST TENANT AND TEST USERS READINESS DISCOVERY

Reason:

Auth runtime readiness remains not fully verified.

Runtime validation was previously blocked until controlled tenant and controlled users are confirmed.

The system must avoid using production users or uncontrolled tenant data during First Pilot readiness validation.

---

## 5) Controlled Test Tenant Candidate

Controlled tenant name:

Hawana Internal Validation

Controlled tenant id:

28b0d660-7367-4ab7-a05b-af7ae0041a99

Tenant usage intent:

LOCAL FIRST PILOT READINESS VALIDATION ONLY

Tenant production status:

NOT PRODUCTION PILOT TENANT

Tenant creation in this step:

NO

Tenant mutation in this step:

NO

companyId modification:

NO

---

## 6) Controlled Test User Candidate

Controlled OWNER user:

owner3@hawana.com

Controlled user role:

OWNER

User usage intent:

LOCAL FIRST PILOT READINESS VALIDATION ONLY

User production status:

NOT REAL PILOT USER

User creation in this step:

NO

User mutation in this step:

NO

Password output:

NO

Token output:

NO

Cookie output:

NO

---

## 7) Additional Role Readiness Requirement

Additional roles may be required before broader runtime validation:

- ADMIN
- MANAGER
- WORKER
- VIEWER

Current readiness status for additional roles:

NOT CONFIRMED

Reason:

Only the OWNER local validation path has been used in the recent logout track.

Additional role readiness must not be assumed.

A separate controlled discovery or approval is required before using additional role accounts.

---

## 8) Approved Discovery Scope

Approved scope:

- inspect existing readiness documents
- record the controlled tenant candidate
- record the controlled OWNER user candidate
- identify additional role readiness gap
- confirm no production tenant is approved
- confirm no first real pilot user is approved
- confirm no runtime execution is approved
- confirm no DB mutation is approved

Not approved:

- code change
- database mutation
- tenant creation
- user creation
- role creation
- password output
- token output
- cookie output
- production validation
- first real pilot execution
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

## 9) Architecture Boundary

Required architecture remains:

Web → API Proxy → Core

Direct Core call from UI:

NOT APPROVED

Backend direct call from UI:

NOT APPROVED

companyId from client payload:

NOT APPROVED

Runtime mutation without explicit approval:

NOT APPROVED

Production domain usage:

NOT APPROVED

---

## 10) Safety Result

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

## 11) Discovery Result

Test tenant readiness discovery:

CREATED

Controlled tenant candidate:

Hawana Internal Validation

Controlled tenant id:

28b0d660-7367-4ab7-a05b-af7ae0041a99

Controlled OWNER user candidate:

owner3@hawana.com

Additional role users:

NOT CONFIRMED

Runtime validation:

NOT STARTED

Runtime approval:

NOT APPROVED

Next valid action:

CREATE TEST TENANT AND TEST USERS READINESS DECISION

Was anything deleted?

NO
