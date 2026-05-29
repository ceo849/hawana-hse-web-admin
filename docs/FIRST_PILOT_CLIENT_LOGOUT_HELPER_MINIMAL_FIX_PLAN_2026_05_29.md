# HAWANA HSE — FIRST PILOT CLIENT LOGOUT HELPER MINIMAL FIX PLAN

Document Type: Client Logout Helper Minimal Fix Plan  
Repository: hawana-hse-web-admin  
Date: 2026-05-29  
Status: PLAN CREATED — CODE FIX NOT EXECUTED  
Mode: Stability First / Governance Only / No Code Change / No Data Change  

---

## 1) Purpose

This document defines the minimal controlled fix plan for the client logout helper contract mismatch.

The Web logout route has already been verified using DELETE.

The current client logout helper still uses POST.

The required fix is limited to aligning the helper method with the verified Web route contract.

This document does not execute code change.

This document does not execute logout.

This document does not mutate database state.

This document does not modify companyId.

This document does not change Billing.

This document does not change Workflow.

---

## 2) Source Decision

Primary source decision:

- docs/FIRST_PILOT_CLIENT_LOGOUT_HELPER_CONTRACT_FIX_DECISION_2026_05_29.md

Primary success evidence:

- docs/FIRST_PILOT_DELETE_BASED_OWNER_LOGOUT_SUCCESS_EVIDENCE_2026_05_29.md

Primary Web logout contract discovery:

- docs/FIRST_PILOT_WEB_LOGOUT_ROUTE_CONTRACT_DISCOVERY_2026_05_29.md

---

## 3) Confirmed Current State

Client helper file:

src/auth/api.ts

Current logout helper behavior:

apiClient.post('/auth/logout', {})

Verified Web logout route:

app/api/auth/logout/route.ts

Verified Web logout method:

DELETE

Verified browser-facing endpoint:

/api/auth/logout

Verified logout runtime result:

SUCCESSFUL

Verified session result after logout:

AUTH COOKIES CLEARED

---

## 4) Minimal Fix Scope

Approved file for future fix:

src/auth/api.ts

Approved change type:

METHOD ALIGNMENT ONLY

Required future behavior:

logout helper should call DELETE-compatible client path for /auth/logout.

Preserve existing behavior:

- function name remains logout
- function return type remains Promise<void>
- existing try/catch remains
- error swallowing behavior remains unchanged
- no new auth logic
- no token handling change
- no route redesign
- no Core call from UI

---

## 5) Discovery Requirement Before Code Fix

Before code change, inspect src/lib/api-client.ts to confirm one of the following:

Option A:

apiClient already supports delete/delete method.

Option B:

apiClient does not support delete method and requires a minimal additive helper method.

Option C:

logout helper can safely use fetch against /api/auth/logout with DELETE while preserving Web API Proxy boundary.

No option is selected by this plan.

The next action must be an execution approval or a read-only source confirmation before code edit.

---

## 6) Architecture Boundary

Required architecture remains:

Web → API Proxy → Core

Browser-facing logout path:

/api/auth/logout

Direct Core call from UI:

NOT APPROVED

Backend direct call from UI:

NOT APPROVED

Billing change:

NOT APPROVED

companyId change:

NOT APPROVED

Workflow change:

NOT APPROVED

---

## 7) Strict Forbidden Scope

The following are not approved:

- immediate code edit without separate approval
- Core modification
- app/api/auth/logout/route.ts redesign
- auth architecture redesign
- token handling redesign
- refresh behavior change
- Billing change
- companyId change
- Workflow change
- runtime workflow validation
- database mutation
- production validation
- first real pilot validation

---

## 8) Safety Result

Code change:

NO

Database mutation:

NO

API mutation:

NO

companyId modification:

NO

Billing change:

NO

Workflow change:

NO

Logout execution:

NOT EXECUTED

Runtime workflow validation:

NOT STARTED

Production validation:

NOT APPROVED

---

## 9) Final Plan Decision

Client logout helper minimal fix plan:

CREATED

Approved future fix target:

src/auth/api.ts

Confirmed current helper method:

POST

Confirmed required route method:

DELETE

Fix type:

METHOD ALIGNMENT ONLY

Code fix:

NOT EXECUTED

Database mutation:

NO

Billing change:

NO

Workflow change:

NO

Next valid action:

READ-ONLY API CLIENT DELETE SUPPORT CONFIRMATION OR EXPLICIT CODE FIX APPROVAL

Was anything deleted?

NO
