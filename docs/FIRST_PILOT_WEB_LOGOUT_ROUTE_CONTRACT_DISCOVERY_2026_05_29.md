# HAWANA HSE — FIRST PILOT WEB LOGOUT ROUTE CONTRACT DISCOVERY

Document Type: Web Logout Route Contract Discovery Evidence  
Repository: hawana-hse-web-admin  
Date: 2026-05-29  
Status: DISCOVERY RECORDED — LOGOUT RETRY NOT EXECUTED  
Mode: Stability First / Governance Only / Read-Only Evidence / No Code Change / No Data Change  

---

## 1) Purpose

This document records the read-only discovery result for the Web logout route contract.

The discovery was performed after OWNER logout validation returned HTTP 405 when POST was used against the Web logout endpoint.

This document identifies the actual Web API route method supported by the current source code.

This document does not execute logout.

This document does not approve logout retry.

This document does not change code.

This document does not mutate database state.

This document does not modify companyId.

This document does not change Billing.

This document does not change Workflow.

---

## 2) Source Evidence

Primary Core-side evidence:

- docs/FIRST_PILOT_OWNER_LOGOUT_VALIDATION_METHOD_MISMATCH_EVIDENCE_2026_05_29.md

Primary Web route discovery source:

- app/api/auth/logout/route.ts

Related Web auth route sources:

- app/api/auth/login/route.ts
- app/api/auth/refresh/route.ts
- src/auth/api.ts

---

## 3) Confirmed Web Logout Route

Route file:

app/api/auth/logout/route.ts

Confirmed exported HTTP method:

DELETE

Confirmed route behavior:

- returns JSON response with ok=true
- clears access_token cookie
- clears refresh_token cookie
- uses authCookieOptions
- does not call Core logout endpoint

Confirmed sensitive output:

NO

---

## 4) Previous Runtime Attempt Classification

Previous attempted endpoint:

http://localhost:3005/api/auth/logout

Previous attempted method:

POST

Observed HTTP status:

405

Classification:

WEB LOGOUT HTTP METHOD MISMATCH

Interpretation:

The previous HTTP 405 is consistent with calling a DELETE-only Next.js route using POST.

This result does not prove Core logout failure.

This result does not prove Web cookie cleanup failure.

This result proves that the previous runtime validation used the wrong HTTP method for the Web logout route contract.

---

## 5) Related Contract Finding

Client logout helper file:

src/auth/api.ts

Observed client logout call:

apiClient.post('/auth/logout', {})

Current Web logout route method:

DELETE

Finding:

CLIENT LOGOUT HELPER METHOD DOES NOT MATCH WEB LOGOUT ROUTE METHOD

Classification:

WEB CONTRACT MISMATCH

Impact:

Logout behavior through client helper may fail with HTTP 405 if the helper path is used as-is.

This finding requires a separate controlled fix decision before any code change.

---

## 6) Architecture Boundary

Required architecture remains:

Web → API Proxy → Core

Confirmed logout route layer:

Web API Proxy

Core direct endpoint usage:

NOT USED IN WEB LOGOUT ROUTE

Production validation:

NOT EXECUTED

Runtime workflow validation:

NOT EXECUTED

Database mutation:

NOT EXECUTED

---

## 7) Safety Result

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

Logout retry:

NO

Token output:

NO

Password output:

NO

Full cookie output:

NO

Read-only discovery:

YES

---

## 8) Required Next Decision

Before any further runtime logout validation, one of the following must be decided separately:

Option A:

Approve DELETE-based OWNER logout runtime validation using the current Web route contract.

Option B:

Create a controlled additive/minimal Web contract fix plan for src/auth/api.ts to align the client helper with DELETE.

Option C:

Keep logout validation blocked until Web logout behavior is formally corrected and approved.

No option is approved by this document.

---

## 9) Final Discovery Decision

Web logout route contract discovery:

RECORDED

Confirmed Web logout route:

app/api/auth/logout/route.ts

Confirmed Web logout method:

DELETE

Previous attempted method:

POST

Previous observed status:

405

Root cause:

WEB LOGOUT HTTP METHOD MISMATCH

Related client helper mismatch:

CONFIRMED

Code change:

NO

Database mutation:

NO

Billing change:

NO

Workflow change:

NO

Logout retry:

NOT EXECUTED

Next valid action:

WEB LOGOUT CONTRACT DECISION

Was anything deleted?

NO
