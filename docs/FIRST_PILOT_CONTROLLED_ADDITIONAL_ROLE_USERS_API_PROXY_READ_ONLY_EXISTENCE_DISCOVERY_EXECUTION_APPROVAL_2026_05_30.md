# HAWANA HSE — FIRST PILOT CONTROLLED ADDITIONAL ROLE USERS API PXY READ-ONLY EXISTENCE DISCOVERY EXECUTION APPROVAL

Document Type: Controlled Additional Role Users API Proxy Read-Only Existence Discovery Execution Approval
Repository: hawana-hse-web-admin
Date: 2026-05-30
Status: APPROVAL CREATED — API PROXY READ-ONLY EXISTENCE DISCOVERY APPROVED FOR NEXT STEP ONLY
Mode: Stability First / Governance Only / No Code Change / No Data Change

---

## 1) Purpose

This document records the explicit approval boundary for controlled additional role users API Proxy read-only existence discovery.

The selected path is Web API Proxy read-only existence discovery.

The current evidence status is inconclusive.

Additional role users readiness is not verified.

The objective is to determine whether controlled local-only users exist for ADMIN, MANAGER, WORKER, and VIEWER.

This approval does not approve code change.

This approval does not approve database mutation.

This approval does not approve user creation.

This approval does not approve role creation.

This approval does notpprove Billing change.

This approval does not approve companyId change.

This approval does not approve Workflow change.

This approval does not approve production validation.

This approval does not approve first real pilot validation.

---

## 2) Source Evidence

Primary existence discovery path decision:

- docs/FIRST_PILOT_ADDITIONAL_ROLE_USERS_EXISTENCE_DISCOVERY_PATH_DECISION_2026_05_30.md

Primary read-only existence discovery plan:

- docs/FIRST_PILOT_CONTROLLED_ADDITIONAL_ROLE_USERS_READ_ONLY_EXISTENCE_DISCOVERY_PLAN_2026_05_30.md

Primary documentation discovery evidence:

- docs/FIRST_PILOT_CONTROLLED_ADDITIONAL_ROLE_USERS_DOCUMENTATION_DISCOVERY_EVIDENCE_2026_05_30.md

Primary read-only existence discovery execution approval:

- docs/FIRST_PILOT_CONTROLLED_ADDITIONAL_ROLE_USERS_READ_ONLY_EXISTENCE_DISCOVERY_EXECUTION_APPROVAL_2026_05_30.md

---

## 3) Approved Controlled Scope

Approved execution:

CONTROLLED ADDITIONAL ROLE USERS API PROXY READ-ONLY EXISTENCE DISCOVERY ONLY

Approved environment:

LOCAL DOCKER ONLY

Approved architecture path:

Web → API Proxy → Core

Approved controlled tenant:

Hawana Internal Validation

Approved controlled tenant id:

28b0d660-7367-4ab7-a05b-af7ae0041a99

Roles approved for discovery:

ADMIN / MANAGER / WORKER / VIEWER

Approved discovery type:

READ-ONLY EXISTENCE CHECK ONLY

Approved mutation:

NONE

---

## 4) Approved Evidence Boundary

Approved evidence may include only:

- Web health HTTP status
- API Proxy route HTTP status
- existence boolean per role
- safe email presence boolean per role
- safe role match boolean per role
- safe controlled tenant match boolean per role
- no password value
- no password hash value
- no token value
- no full cookie value
- no Set-Cookie full value
- no sensitive user payload dump

Allowed final outcomes:

- ALL ADDITIONAL ROLE USERS EXIST
- SOME ADDITIONAL ROLE USERS MISSING
- API PROXY READ-ONLY EXISTENCE DISCOVERY BLOCKED
- EVIDENCE INCONCLUSIVE

---

## 5) Approved Execution Boundary

Approved execution sequen
1. Verify clean git status.
2. Verify current commit and tag.
3. Verify source path decision exists.
4. Verify source read-only plan exists.
5. Verify Web health locally through Web entrypoint.
6. Use Web API Proxy path only.
7. Do not call Core directly.
8. Do not query DB directly.
9. Do not create users.
10. Do not create roles.
11. Do not modify code.
12. Do not mutate companyId.
13. Do not touch Billing.
14. Do not touch Workflow.
15. Record role existence result using booleans only.
16. Verify git status remains clean.

---

## 6) Endpoint Boundary

Approved route family:

Web API Proxy only

Approved path pattern:

/api/*

Direct Core port:

NOT APPROVED

Direct Core URL:

NOT APPROVED

Direct database access:

NOT APPROVED

Route guessing:

NOT APPROVED

If an existing safe API Proxy endpoint for users discovery is not clearly available, execution must stop and record blocker evidence.

---

## 7) Strict Forbidden Scope

The following are not approved:

- code change
- Web route modification
- Core modification
- API client modification
- database mutation
- direct database query
- direct Core call
- tenant creation
- user creation
- role creation
- companyId modification
- Billing change
- Workflow change
- production validation
- first real pilot validation
- Docker restart
- Docker rebuild
- Docker compose up
- Docker compose down
- password output
- password hash output
- token output
- full cookie output
- Set-Cookie full value output
- sensitive user payload dump
- route guessing

---

## 8) Stop Conditions

Execution must stop immediately if:

- git status is not clean before execution
- Web health does not return HTTP 200
- endpoint requires code change
- endpoint requires route creation
- endpoint requires direct Core call
- endpoint requires direct DB query
- endpoint requires database mutation
- endpoint requires user creation
- endpoint requires role creation
- endpoint requires production domain
- endpoint requires first real pilot credentials
- password value would be printed
- password hash value would be printed
- token value would be printed
- full cookie value would be printed
- Set-Cookie full value would be printed
- companyId mutation becomes involved
- Billing behavior becomes involved
- Workflow behavior becomes involved
- evidence becomes ambiguous

---

## 9) Safety Result

Code change in this document:

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

Runtime mutation:

NOT APPROVED

Production validation:

NOT APPROVED

First real pilot validation:

NOT APPROVED

---

## 10) Final Approval Decision

Controlled additional role users API Proxy read-only existence discovery execution approval:

CREATED

Approved execution:

CONTROLLED ADDITIONAL ROLE USERS API PROXY READ-ONLY EXISTENCE DISCOVERY ONLY

Approved environment:

LOCAL DOCKER ONLY

Approved architecture path:

Web → API Proxy → Core

Approved tenant:

Hawana Internal Validation

Approved tenant id:

28b0d660-7367-4ab7-a05b-af7ae0041a99

Roles approved for discovery:

ADMIN / MANAGER / WORKER / VIEWER

Direct DB query:

NOT APPROVED

Direct Core call:

NOT APPROVED

User creation:

NOT APPROVED

Role creation:

NOT APPROVED

Discovery execution:

APPROVED FOR NEXT STEP ONLY

Next valid action:

EXECUTE CONTROLLED ADDITIONAL ROLE USERS API PROXY READ-ONLY EXISTENCE DISCOVERY LOCAL ONLY

Was anything deleted?

NO
