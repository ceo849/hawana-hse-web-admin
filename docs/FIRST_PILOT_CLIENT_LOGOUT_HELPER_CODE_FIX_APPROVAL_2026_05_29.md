# HAWANA HSE — FIRST PILOT CLIENT LOGOUT HELPER CODE FIX APPROVAL

Document Type: Client Logout Helper Code Fix Approval  
Repository: hawana-hse-web-admin  
Date: 2026-05-29  
Status: APPROVAL CREATED — CODE FIX APPROVED FOR NEXT STEP ONLY  
Mode: Stability First / Governance Only / No Code Change In This Document / No Data Change  

---

## 1) Purpose

This document records the explicit approval boundary for the next minimal client logout helper code fix.

The current Web logout route has already been verified using DELETE.

The API client already supports DELETE.

The current client logout helper still uses POST.

The approved future code fix is limited to aligning the client logout helper method with the verified Web logout route contract.

This document does not execute the code fix.

This document does not execute logout.

This document does not mutate database state.

This document does not modify companyId.

This document does not change Billing.

This document does not change Workflow.

---

## 2) Source Evidence

Primary API client confirmation:

- docs/FIRST_PILOT_API_CLIENT_DELETE_SUPPORT_CONFIRMATION_2026_05_29.md

Primary minimal fix plan:

- docs/FIRST_PILOT_CLIENT_LOGOUT_HELPER_MINIMAL_FIX_PLAN_2026_05_29.md

Primary helper fix decision:

- docs/FIRST_PILOT_CLIENT_LOGOUT_HELPER_CONTRACT_FIX_DECISION_2026_05_29.md

Primary logout success evidence:

- docs/FIRST_PILOT_DELETE_BASED_OWNER_LOGOUT_SUCCESS_EVIDENCE_2026_05_29.md

Primary Web logout contract discovery:

- docs/FIRST_PILOT_WEB_LOGOUT_ROUTE_CONTRACT_DISCOVERY_2026_05_29.md

---

## 3) Confirmed Facts

Target file:

src/auth/api.ts

Current logout helper method:

POST

Current logout helper call:

apiClient.post('/auth/logout', {})

Verified Web logout route method:

DELETE

Verified Web logout endpoint:

/api/auth/logout

API client DELETE support:

CONFIRMED

API client modification needed:

NO

Web logout runtime validation:

VERIFIED

Logout HTTP status during validation:

200

Session after logout:

AUTH COOKIES CLEARED

Architecture path:

Web → API Proxy → Core

---

## 4) Approved Code Fix Scope

Approved file:

src/auth/api.ts

Approved change:

Replace the logout helper POST call with the existing apiClient.delete call.

Approved target behavior:

logout helper calls DELETE-compatible path for /auth/logout.

Expected code direction:

apiClient.delete('/auth/logout')

Preserve existing behavior:

- function name remains logout
- return type remains Promise<void>
- try/catch remains
- error swallowing behavior remains unchanged
- no new auth logic
- no new token logic
- no new cookie logic
- no route redesign
- no Core direct call
- no API client modification

---

## 5) Strict Forbidden Scope

The following are not approved:

- Core modification
- app/api/auth/logout/route.ts modification
- src/lib/api-client.ts modification
- auth architecture redesign
- token handling redesign
- cookie handling redesign
- refresh behavior change
- Billing change
- companyId change
- Workflow change
- role expansion
- database mutation
- production validation
- first real pilot validation
- runtime workflow validation

---

## 6) Architecture Boundary

Required architecture remains:

Web → API Proxy → Core

Browser-facing logout path:

/api/auth/logout

Client helper path input:

/auth/logout

API client normalized path:

/api/auth/logout

Direct Core call from UI:

NOT APPROVED

Backend direct call from UI:

NOT APPROVED

---

## 7) Safety Result

Code change in this document:

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

Production validation:

NOT APPROVED

---

## 8) Final Approval Decision

Client logout helper code fix approval:

CREATED

Approved future code target:

src/auth/api.ts

Approved future change:

Replace apiClient.post('/auth/logout', {}) with apiClient.delete('/auth/logout').

API client modification:

NOT APPROVED

Core modification:

NOT APPROVED

Web route modification:

NOT APPROVED

Architecture path:

Web → API Proxy → Core

Code fix execution:

APPROVED FOR NEXT STEP ONLY

Database mutation:

NO

Billing change:

NO

Workflow change:

NO

Next valid action:

EXECUTE MINIMAL CLIENT LOGOUT HELPER CODE FIX

Was anything deleted?

NO
