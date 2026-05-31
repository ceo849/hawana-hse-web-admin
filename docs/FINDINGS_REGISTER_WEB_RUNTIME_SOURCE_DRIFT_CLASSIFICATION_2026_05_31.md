# HAWANA HSE — WEB RUNTIME SOURCE DRIFT CLASSIFICATION
# تصنيف اختلاف Web Runtime عن Source الحالي

Document Type: Runtime / Source Drift Classification
Repository: hawana-hse-web-admin
Date: 2026-05-31
Mode: Stability First / Read-Only Evidence / No Runtime Change
Status: WEB RUNTIME DRIFT CONFIRMED — REBUILD NOT APPROVED YET

---

## 1) Purpose

This document records the confirmed difference between:

- Current Web source code
- Running local Docker Web runtime

The purpose is to classify the rvation still shows old UI behavior after the RBAC-04 Web UI visibility source fix was committed and pushed.

This document does not approve rebuild.

This document does not approve Docker restart.

This document does not approve production deployment.

---

## 2) Current Web Source State

Current branch:

phase4.3-web-hardening

Current implementation commit:

6ab73b0 fix: align web ui visibility with rbac policy

Current evidence commit:

6ab73b0 / follow-up evidence committed after implementation

Current implementation tag:

web-ui-visibility-rbac04-fix-implementation-2026-05-31

Evidence tag:

findings-register-web-ui-visibility-fix-implementation-evidence-2026-05-31

Source status:

RBAC-04 Web UI visibility fix exists in source.

---

## 3) Source Evidence

Current Web source contains the corrected Dashboard quick action visibility:

File:

app/dashboard/page.tsx

Current expected source behavior:

+ Action Plan (from Report)

Allowed roles:

- OWNER
- ADMIN
- MANAGER

Disallowed roles:

- WORKER
- VIEWER
- UNKNOWN

This confirms the source code no longer exposes the Action Plan from Report entry point to WORKER or VIEWER.

---

## 4) Runtime Evidence

Running local Web container:

hawana-web

Runtime image:

hawana-hse-web-admin:latest

Observed runtime container creation date:

2026-05-24

Runtime evidence showed the compiled Next.js server bundle still contains the old role list:

- OWNER
- ADMIN
- MANAGER
- WORKER
- VIEWER

This means the running Docker container is not using the latest committed Web source.

---

## 5) Classification

Issue type:

WEB RUNTIME SOURCE DRIFT

Source implementation status:

FIXED IN SOURCE

Running local Web runtime status:

STALE BUILD CONFIRMED

Browser observation status:

EXPECTED TO SHOW OLD BEHAVIOR UNTIL CONTROLLED WEB REBUILD / RUNTIME REFRESH

Primary conclusion:

The browser screenshots do not prove implementation failure.

They prove the currently running Web container is stale.

---

## 6) Architecture Boundary Review

Architecture remains:

Web → API Pry → Core

No direct Web → Core call was introduced.

No API route change was introduced.

No Core change was introduced by the Web UI visibility fix.

No Billing change was introduced.

No companyId logic change was introduced.

No Workflow change was introduced.

---

## 7) Core Runtime Review Summary

Core runtime was reviewed read-only in parallel.

Reviewed scope:

- Action Plans controller
- Action Plans service
- Safety Reports controller
- Sites Projects controller
- Running Core container dist files

Core findings:

- Action Plans RBAC exists in runtime dist.
- Worker assigned-only Action Plan access exists in runtime dist.
- Safety Reports RBAC exists in runtime dist.
- Sites Projects RBAC exists in runtime dist.
- companyId remains sourced from JWT / request user context.
- No Core runtime drift was proven in the reviewed RBAC scope.

Core classification:

CORE RBAC RUNTIME DRIFT NOT PROVEN

---

## 8) Risk Assessment

Risk level if no rebuild is performed:

HIGH for manual browser observationuracy.

Reason:

Manual browser observation will continue to reflect stale Web UI behavior.

Risk level of immediate uncontrolled rebuild:

NOT APPROVED

Reason:

Runtime actions must follow controlled runtime documentation and approval.

Recommended next action:

Create controlled Web local runtime refresh approval before any rebuild or container restart.

---

## 9) Explicit Non-Approvals

Web rebuild:

NOT APPROVED YET

Docker restart:

NOT APPROVED YET

Docker compose action:

NOT APPROVED

Core rebuild:

NOT APPROVED

Core container restart:

NOT APPROVED

Production deployment:

NOT APPROVED

Database query:

NOT APPROVED

Billing change:

NOT APPROVED

companyId change:

NOT APPROVED

Workflow change:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

---

## 10) Final Classification Decision

Web runtime source drift:

CONFIRMED

Web source implementation:

CONFIRMED FIXED

Running Web container:

CONFIRMED STALE

Core RBAC runtime drift:

NOT PROVEN

Root cause of unchanged browser UI:

STALE WEB CONTAINER BUILD

Next valid action:

CREATE CONTROLLED WEB LOCAL RUNTIME REFRESH APPROVAL

Was anything deleted?

NO
