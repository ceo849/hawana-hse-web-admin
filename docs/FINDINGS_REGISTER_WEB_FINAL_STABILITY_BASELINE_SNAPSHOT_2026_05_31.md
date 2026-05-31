# HAWANA HSE — WEB FINAL STABILITY BASELINE SNAPSHOT
# لقطة الاستقرار النهائية للـ Web بعد إغلاق Local Runtime Refresh

Document Type: Final Stability Baseline Snapshot
Project: Hawana HSE Web Admin
Repository: hawana-hse-web-admin
Date: 2026-05-31
Status: BASELINE SNAPSHOT CREATED — STABLE

─────────────────────────────────────
## 1) Purpose
─────────────────────────────────────

This document records the final read-only stability baseline after completing and closing the Web local runtime refresh.

The purpose is to establish a clean engineering reference point before any later controlled action.

This document confirms:

- Web local runtime refresh is closed.
- Controlled local Web runtime switch is closed.
- Post-switch browser validation passed.
- Runtime inventory completed.
- Cleanup classification completed.
- Architecture remains Web → API Proxy → Core.
- Production deployment is not approved.
- First real external pilot is not approved yet.

─────────────────────────────────────
## 2) Git Baseline
─────────────────────────────────────

Repository:

hawana-hse-web-admin

Branch:

phase4.3-web-hardening

Current HEAD:

6e99244

Current commit:

docs: add web local runtime refresh closure index

Current tag:

findings-register-web-local-runtime-refresh-closure-index-2026-05-31

Remote alignment:

CONFIRMED

HEAD and origin/phase4.3-web-hardening resolved to the same commit:

6e992440af6374e078a6555069701e4824b73920

Git working tree status:

CLEAN before this baseline document creation.

─────────────────────────────────────
## 3) Closure Documents Verified
─────────────────────────────────────

The following final closure documents exist:

1. docs/FINDINGS_REGISTER_WEB_LOCAL_RUNTIME_REFRESH_CLOSURE_INDEX_2026_05_31.md

Classification:

WEB LOCAL RUNTIME REFRESH CLOSED

2. docs/FINDINGS_REGISTER_WEB_LOCAL_RUNTIME_REFRESH_FINAL_CLOSURE_2026_05_31.md

Classification:

FINAL CLOSURE COMPLETED

3. docs/FINDINGS_REGISTER_WEB_LOCAL_RUNTIME_REFRESH_POST_CLOSURE_RUNTIME_INVENTORY_2026_05_31.md

Classification:

POST-CLOSURE RUNTIME INVENTORY COMPLETED

4. docs/FINDINGS_REGISTER_WEB_LOCAL_RUNTIME_REFRESH_POST_CLOSURE_CLEANUP_CLASSIFICATION_2026_05_31.md

Classification:

CLEANUP CLASSIFIED — CLEANUP NOT APPROVED

5. docs/FINDINGS_REGISTER_WEB_DIRECT_CORE_URL_SIGNAL_CLASSIFICATION_2026_05_31.md

Classification:

DIRECT CORE URL SIGNAL CLASSIFIED — ACTIVE RUNTIME VIOLATION NOT PROVEN

─────────────────────────────────────
## 4) Active Runtime Baseline
─────────────────────────────────────

Active Web runtime:

Container name:

hawana-web

Container ID observed:

a390ec00e25d

Image:

hawana-hse-web-admin:local-rbac04-fab-refresh-2026-05-31

Runtime state:

running

StartedAt:

2026-05-31T01:24:58.058553716Z

Restart policy:

unless-stopped

Network:

hawana-hse-core_default

Port mapping:

Host 3005 → Container 3000

Classification:

VALID ACTIVE WEB RUNTIME

─────────────────────────────────────
## 5) Core and Database Baseline
─────────────────────────────────────

Core runtime:

Container name:

hawana-core

Container ID observed:

4d0b1be3311c

State:

running

StartedAt:

2026-05-30T16:26:22.038713334Z

Restart policy:

unless-stopped

Core restart during final baseline:

NOT PERFORMED

Database runtime:

Container name:

hawana-postgres

Container ID observed:

9d66e3f8aff7

State:

running

Health:

healthy

StartedAt:

2026-05-30T16:26:22.038701084Z

Restart policy:

unless-stopped

Database touch during final baseline:

NOT PERFORMED

─────────────────────────────────────
## 6) HTTP Baseline
─────────────────────────────────────

HTTP check:

http://localhost:3005/login

Observed result:

200 OK

Classification:

LOGIN ROUTE AVAILABLE

HTTP check:

http://localhost:3005/dashboard

Observed result:

307 Temporary Redirect

Redirect target:

/login?next=%2Fdashboard

Classification:

AUTH PROTECTION WORKING AS EXPECTED

─────────────────────────────────────
## 7) Architecture Baseline
─────────────────────────────────────

Required architecture:

Web → API Proxy → Core

Architecture status:

PRESERVED

Observed Web page/source usage:

serverAppFetch is used across the dashboard pages and server-side pages.

Important boundary:

Web pages must call /api through serverAppFetch.

API Proxy routes may call Core internally using CORE_API_BASE_URL.

Direct browser/UI to Core:

NOT APPROVED

Direct page-level backend bypass:

NOT APPROVED

Backend source of truth:

UNCHANGED

API contract:

UNCHANGED

Billing:

UNCHANGED

companyId:

UNCHANGED

Workflow:

UNCHANGED

─────────────────────────────────────
## 8) Runtime Inventory Classification
─────────────────────────────────────

Active Web runtime:

KEEP

hawana-core:

KEEP

hawana-postgres:

KEEP

Candidate containers:

PRESERVE UNTIL SEPARATE CLEANUP APPROVAL

Rollback stale Web container:

PRESERVE UNTIL SEPARATE CLEANUP APPROVAL

Old exited containers:

PRESERVE UNTIL SEPARATE CLEANUP APPROVAL

Old backup images:

PRESERVE UNTIL SEPARATE CLEANUP APPROVAL

Docker prune:

NOT APPROVED

Cleanup execution:

NOT APPROVED

─────────────────────────────────────
## 9) Forbidden Actions Remain Not Approved
─────────────────────────────────────

Production deployment:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

Cleanup execution:

NOT APPROVED

Docker prune:

NOT APPROVED

Core restart:

NOT APPROVED

DB touch:

NOT APPROVED

Billing change:

NOT APPROVED

companyId change:

NOT APPROVED

Workflow change:

NOT APPROVED

API contract change:

NOT APPROVED

─────────────────────────────────────
## 10) Final Stability Classification
─────────────────────────────────────

Final Web stability baseline snapshot:

COMPLETED

Web local runtime refresh:

CLOSED

Controlled local Web runtime switch:

CLOSED

Post-switch browser validation:

PASSED

Runtime inventory:

COMPLETED

Cleanup classification:

COMPLETED

Active Web runtime:

VALID

Core runtime:

UNCHANGED

Database runtime:

UNCHANGED

Architecture status:

Web → API Proxy → Core PRESERVED

Production deployment:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

Was anything deleted?

NO
