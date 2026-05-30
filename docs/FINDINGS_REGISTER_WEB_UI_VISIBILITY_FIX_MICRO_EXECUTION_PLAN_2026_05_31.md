# HAWANA HSE — FINDINGS REGISTER WEB UI VISIBILITY FIX MICRO EXECUTION PLAN

Document Type: Web UI Visibility Fix Micro Execution Plan
Repository: hawana-hse-web-admin
Date: 2026-05-31
Status: PLAN CREATED — IMPLEMENTATION NOT STARTED
Mode: Stability First / Web UI Visibility Only / No Core Change / No Runtime Mutation

---

## 1) Purpose

This documdefines the exact minimal Web implementation scope for the RBAC-04 UI visibility fix.

The approved issue type is UI visibility mismatch.

Backend permission issue is not proven.

Core remains the source of truth.

The implementation must hide unauthorized mutation entry points from WORKER and VIEWER while preserving read-only navigation and authorized role visibility.

---

## 2) Source Approval

Execution approval exists in Core governance docs:

- docs/FINDINGS_REGISTER_RECLASSIFICATION_WEB_UI_VISIBILITY_FIX_EXECUTION_APPROVAL_2026_05_31.md

Comparison result exists in Core governance docs:

- docs/FINDINGS_REGISTER_RECLASSIFICATION_ROLE_BASED_UI_VISIBILITY_COMPARISON_RESULT_2026_05_31.md

---

## 3) Approved Architecture

Required architecture:

Web → API Proxy → Core

Allowed:

- Web rendering-layer role visibility checks only
- Existing cookie/JWT role decode
- Existing serverAppFetch(token)
- Existing API Proxy routes

Forbidden:

- Direct Core call from UI
- API Proxy bypass
- Core change
- API ract change
- Billing change
- companyId change
- Workflow change
- database mutation
- production deployment

---

## 4) Target Files

The implementation is limited to these files:

1. app/dashboard/page.tsx
2. app/dashboard/safety-reports/page.tsx
3. app/dashboard/safety-reports/[id]/page.tsx
4. app/dashboard/action-plans/[id]/page.tsx

No other file is approved in this micro-plan unless a build error proves a missing import/type issue.

---

## 5) Required File-Level Changes

### 5.1 app/dashboard/page.tsx

Change only Dashboard Quick Actions visibility.

Remove WORKER and VIEWER from:

+ Action Plan (from Report)

Expected roles after fix:

OWNER / ADMIN / MANAGER

Reason:

This entry point implies Action Plan creation from Safety Report, which Core does not authorize for WORKER or VIEWER.

---

### 5.2 app/dashboard/safety-reports/page.tsx

Add current role detection using existing access token and decodeJwtPayload.

Show + New Safety Report only to:

OWNER / ADMIN / MANAGER / WORKER

Hide from:

VIEWER / UNKNOWN

Reason:

Core authorizes WORKER to create Safety Reports but denies VIEWER create Safety Report.

---

### 5.3 app/dashboard/safety-reports/[id]/page.tsx

Add current role detection using existing access token and decodeJwtPayload.

Show + Create Action Plan only to:

OWNER / ADMIN / MANAGER

Show Edit only to:

OWNER / ADMIN / MANAGER

Hide both from:

WORKER / VIEWER / UNKNOWN

Reason:

Core denies WORKER and VIEWER Action Plan creation. Core denies WORKER and VIEWER Safety Report update.

---

### 5.4 app/dashboard/action-plans/[id]/page.tsx

Add current role detection using existing access token and decodeJwtPayload.

Show status transition buttons only to:

OWNER / ADMIN / MANAGER / WORKER

Hide from:

VIEWER / UNKNOWN

Show Edit only to:

OWNER / ADMIN / MANAGER

Hide from:

WORKER / VIEWER / UNKNOWN

Reason:

Core denies VIEWER Action Plan status update. Core denies VIEWER and WORKER general Action Plan edit/due-date update.

---

## 6) Required Verification

After implementation:

1. git diff review.
2. Type/build verification.
3. Read-only local browser observation for VIEWER.
4. Read-only local browser observation for WORKER.
5. Confirm no direct Core calls.
6. Confirm no API route changes.
7. Confirm no Billing / companyId / Workflow changes.

---

## 7) Stop Conditions

Stop immediately if the fix requires:

- Core modification
- API route modification
- API contract modification
- direct backend URL usage
- Billing logic change
- companyId logic change
- Workflow logic change
- auth/session redesign
- broad UI refactor
- production deployment

---

## 8) Final Plan Decision

Web UI visibility micro execution plan:

CREATED

Implementation:

NOT STARTED

Approved target files:

4

Approved change type:

WEB RENDERING VISIBILITY ONLY

Core changes:

NOT APPROVED

Billing changes:

NOT APPROVED

companyId changes:

NOT APPROVED

Workflow changes:

NOT APPROVED

API contract changes:

NOT APPROVED

Findings status changes:

NOT APPROVED

Production deployment:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

Was anything deleted?

NO
