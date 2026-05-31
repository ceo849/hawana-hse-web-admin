# HAWANA HSE — WEB LOCAL RUNTIME REFRESH CANDIDATE RUNTIME RECONCILIATION
# مطابقة اسم Candidate المعتمد مع Runtime الفعلي قبل التحويل المحلي

Document Type: Runtime Governance Reconciliation
Project: Hawana HSE Web Admin
Repository: hawana-hse-web-admin
Date: 2026-05-31
Status: RECONCILIATION CREATED — SWITCH STILL NOT STARTED

─────────────────────────────────────
## 1) Purpose
─────────────────────────────────────

This document reconciles the controlled switch approval document with the actual running Web candidate container on local port 3007.

The purpose is to prevent a governance mismatch before executing any local runtime switch.

No runtime mutation is approved by this document.

─────────────────────────────────────
## 2) Current Approval Document Reference
─────────────────────────────────────

Approval document:

docs/FINDINGS_REGISTER_WEB_LOCAL_RUNTIME_REFRESH_CONTROLLED_SWITCH_APPROVAL_2026_05_31.md

Approval commit:

a88fbf8

Approval tag:

findings-register-web-local-runtime-refresh-controlled-switch-approval-2026-05-31

Approval status:

APPROVED — SWITCH NOT STARTED

Approved target port:

3005

Approved source port:

3007

─────────────────────────────────────
## 3) Mismatch Found During Read-Only Pre-Flight
─────────────────────────────────────

Expected candidate name in approval document:

hawana-web-candidate-rbac04-v2-2026-05-31

Actual running candidate name on port 3007:

hawana-web-candidate-rbac04-fab-2026-05-31

Actual candidate image tag:

hawana-hse-web-admin:local-rbac04-fab-refresh-2026-05-31

Actual candidate container ID:

cd5a62698ba3

Actual candidate port mapping:

3007 -> 3000

Actual candidate network:

hawana-hse-core_default

Actual candidate CORE_API_BASE_URL:

http://hawana-core:3001

Actual candidate NEXT_PUBLIC_API_BASE_URL:

/api

Actual candidate NEXT_PUBLIC_API_PREFIX:

/v1

Actual candidate DOCKER_ENV:

true

Actual candidate NODE_ENV:

production

─────────────────────────────────────
## 4) Runtime Validation Result
─────────────────────────────────────

The actual candidate on port 3007 was verified as the candidate containing the required Web UI fixes.

Validated evidence:

- Dashboard Quick Actions roles are restricted to OWNER / ADMIN / MANAGER where required.
- VIEWER unauthorized quick actions are not present.
- Candidate port 3007 responds to /login.
- Candidate port 3007 redirects unauthenticated /dashboard to /login.
- Web → API Proxy → Core boundary remains intact.
- Current stale Web runtime on port 3005 remains unchanged.
- Core remains running.
- PostgreSQL remains running and healthy.

Runtime validation status:

PASSED

─────────────────────────────────────
## 5) Reconciliation Decision
─────────────────────────────────────

The candidate approved for controlled local switch must be interpreted as the validated runtime on port 3007.

Correct reconciled candidate identity:

hawana-web-candidate-rbac04-fab-2026-05-31

Correct reconciled image tag:

hawana-hse-web-admin:local-rbac04-fab-refresh-2026-05-31

Correct reconciled source port:

3007

Correct reconciled final target port:

3005

The previous approval document remains valid only after applying this reconciliation.

─────────────────────────────────────
## 6) Explicitly Not Approved
─────────────────────────────────────

Core rebuild:

NOT APPROVED

Core restart:

NOT APPROVED

Database changes:

NOT APPROVED

Billing changes:

NOT APPROVED

companyId changes:

NOT APPROVED

Workflow changes:

NOT APPROVED

API contract changes:

NOT APPROVED

Production deployment:

NOT APPROVED

Docker compose down:

NOT APPROVED

Docker compose up:

NOT APPROVED

Volume deletion:

NOT APPROVED

Database reset:

NOT APPROVED

Seed execution:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

─────────────────────────────────────
## 7) Architecture Boundary
─────────────────────────────────────

Required architecture:

Web → API Proxy → Core

Architecture status:

PRESERVED

Direct UI to Core calls:

NOT APPROVED

Direct browser to Core calls:

NOT APPROVED

serverAppFetch boundary:

UNCHANGED

API Proxy boundary:

UNCHANGED

Core runtime:

UNCHANGED

Database runtime:

UNCHANGED

─────────────────────────────────────
## 8) Final Classification
─────────────────────────────────────

Candidate name mismatch:

CONFIRMED

Actual candidate on port 3007:

CONFIRMED

Candidate runtime validation:

PASSED

Controlled local switch:

NOT STARTED

Switch may proceed only against reconciled candidate:

hawana-web-candidate-rbac04-fab-2026-05-31

Production deployment:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

Was anything deleted?

NO
