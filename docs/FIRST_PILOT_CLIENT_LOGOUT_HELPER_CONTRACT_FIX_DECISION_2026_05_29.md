# HAWANA HSE — FIRST PILOT CLIENT LOGOUT HELPER CONTRACT FIX DECISION

Document Type: Client Logout Helper Contract Fix Decision  
Repository: hawana-hse-web-admin  
Date: 2026-05-29  
Status: DECISION CREATED — CODE FIX NOT EXECUTED  
Mode: Stability First / Governance Only / No Code Change / No Data Change  

---

## 1) Purpose

This document records the governance decision after successful DELETE-based OWNER logout runtime validation.

The validation confirmed that the Web logout route works correctly when called with DELETE.

The remaining mismatch is inside the client logout helper.

The current client helper uses POST against /auth/logout.

The current Web route supports DELETE for /api/auth/logout.

This document decides whether a controlled minimal client helper fix should be planned.

This document does not change code.

This document does not execute logout.

This document does not mutate database state.

This document does not modify companyId.

This document does not change Billing.

This document does not change Workflow.

---

## 2) Source Evidence

Primary success evidence:

- docs/FIRST_PILOT_DELETE_BASED_OWNER_LOGOUT_SUCCESS_EVIDENCE_2026_05_29.md

Primary execution approval:

- docs/FIRST_PILOT_DELETE_BASED_OWNER_LOGOUT_RUNTIME_EXECUTION_APPROVAL_2026_05_29.md

Primary runtime validation plan:

- docs/FIRST_PILOT_DELETE_BASED_OWNER_LOGOUT_RUNTIME_VALIDATION_PLAN_2026_05_29.md

Primary Web logout contract decision:

- docs/FIRST_PILOT_WEB_LOGOUT_CONTRACT_DECISION_2026_05_29.md

Primary Web logout contract discovery:

- docs/FIRST_PILOT_WEB_LOGOUT_ROUTE_CONTRACT_DISCOVERY_2026_05_29.md

---

## 3) Confirmed Facts

Confirmed Web logout route:

app/api/auth/logout/route.ts

Confirmed Web logout method:

DELETE

Confirmed Web logout endpoint:

/api/auth/logout

Runtime validation result:

VERIFIED

Runtime logout HTTP status:

200

Runtime logout success boolean:

true

Runtime session after logout:

AUTH COOKIES CLEARED

Architecture path used:

Web → API Proxy → Core

---

## 4) Current Client Helper Finding

Client helper file:

src/auth/api.ts

Current client helper behavior:

apiClient.post('/auth/logout', {})

Expected route contract:

DELETE /api/auth/logout

Finding:

CLIENT LOGOUT HELPER METHOD DOES NOT MATCH WEB LOGOUT ROUTE METHOD

Impact:

Logout behavior through the client helper may fail with HTTP 405 if the helper path is used as-is.

The Web route itself is already verified using DELETE.

The remaining issue is a client-side helper contract mismatch, not a Web route failure.

---

## 5) Decision Options Reviewed

Option A:

Approve a controlled minimal code fix plan for src/auth/api.ts only.

Option B:

Do not fix the helper and keep manual DELETE logout validation as evidence only.

Option C:

Redesign logout behavior across Web and Core.

---

## 6) Selected Decision

Selected option:

OPTION A — CREATE CONTROLLED MINIMAL CLIENT LOGOUT HELPER FIX PLAN

Reason:

The route contract is already verified.

The helper mismatch is narrow and isolated.

The safest next action is not direct code editing, but a separate minimal fix plan.

The fix must align the helper method with the existing verified Web route contract.

The fix must not redesign auth.

The fix must not touch Core.

The fix must not touch Billing.

The fix must not touch companyId.

The fix must not touch Workflow.

---

## 7) Approved Planning Boundary

Approved next planning scope:

- inspect src/auth/api.ts
- inspect src/lib/api-client.ts only if needed to confirm DELETE support
- create a minimal client logout helper fix plan
- target only logout helper method alignment
- preserve existing logout swallow-error behavior unless separately approved
- no runtime execution
- no code change in this decision step
- no database mutation

Not approved:

- immediate code change
- Core change
- Web route redesign
- auth architecture redesign
- token handling redesign
- Billing change
- companyId change
- Workflow change
- role expansion
- production validation
- first real pilot validation

---

## 8) Architecture Boundary

Required architecture remains:

Web → API Proxy → Core

Browser-facing logout route:

/api/auth/logout

Verified Web logout method:

DELETE

Core direct call from UI:

NOT APPROVED

Backend direct call from UI:

NOT APPROVED

---

## 9) Safety Result

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

## 10) Final Decision

Client logout helper contract fix decision:

CREATED

Selected option:

OPTION A

Approved next planning action:

CREATE CLIENT LOGOUT HELPER MINIMAL FIX PLAN

Confirmed route method:

DELETE

Current helper method:

POST

Mismatch:

CONFIRMED

Runtime route validation:

VERIFIED

Code fix:

NOT EXECUTED

Database mutation:

NO

Billing change:

NO

Workflow change:

NO

Next valid action:

CREATE CLIENT LOGOUT HELPER MINIMAL FIX PLAN

Was anything deleted?

NO
