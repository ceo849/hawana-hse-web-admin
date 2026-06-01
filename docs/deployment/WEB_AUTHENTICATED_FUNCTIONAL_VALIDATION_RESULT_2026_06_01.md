# HAWANA HSE — WEB AUTHENTICATED FUNCTIONAL VALIDATION RESULT — 2026-06-01

Document Type: Authenticated Functional Validation Result
Repository: hawana-hse-web-admin
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Status: WEB AUTHENTICATED FUNCTIONAL VALIDATION PASSED
Date: 2026-06-01

---

## 1) Purpose

This document records the authenticated functional validation result after the controlled Web container replacement.

This document is evidence only.

This document does not approve final closure.

This document does not approve backup deletion.

This document does not approve pilot execution.

---

## 2) Approval Reference

Authenticated validation was approved by:

web-authenticated-functional-validation-approval-checkpoint-2026-06-01

Approval scope:

AUTHENTICATED FUNCTIONAL VALIDATION ONLY

Not approved by that checkpoint:

- container replacement
- Docker run
- Docker rm
- Docker Compose
- backup deletion
- final deployment closure
- pilot execution
- Core change
- DB change
- Billing change
- companyId change
- Workflow change

---

## 3) Runtime State During Validation

Runtime containers observed:

- hawana-web: UP
- hawana-core: UP
- hawana-postgres: UP

Active Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Active Core image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

PostgreSQL image:

postgres:16-alpine

Backup Web container:

hawana-web-backup-before-controlled-deployment-2026-06-01

Backup Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-audit-governance-runtime-deployable-2026-05-24

Backup status:

PRESENT — EXITED SAFELY

---

## 4) Public Health Validation

Public health endpoint through Web API Proxy:

https://hawanaglobal.com/api/health

Observed result:

HTTP 200 OK

Response body:

{"status":"ok","timestamp":"2026-06-01T00:12:32.852Z"}

Health validation result:

PASSED

---

## 5) Authenticated Login Validation

Login endpoint:

/api/auth/login

Access path:

Web → API Proxy → Core

Observed result:

LOGIN_HTTP_STATUS=200

Login validation result:

PASSED

No password is recorded in this document.

No token is recorded in this document.

No cookie value is recorded in this document.

---

## 6) Authenticated API Proxy Validation

Authenticated API Proxy checks were executed after login using a temporary cookie jar.

The temporary cookie jar was removed after validation.

Validated endpoints:

1. /api/dashboard
2. /api/safety-reports
3. /api/action-plans
4. /api/users
5. /api/billing

Observed HTTP statuses:

- DASHBOARD_HTTP_STATUS=200
- SAFETY_REPORTS_HTTP_STATUS=200
- ACTION_PLANS_HTTP_STATUS=200
- USERS_HTTP_STATUS=200
- BILLING_HTTP_STATUS=200

Authenticated API Proxy validation result:

PASSED

---

## 7) Dashboard Data Preview

Dashboard response preview showed:

- users: 5
- companies: 1
- reports: 6
- actionPlans: 9
- reportStats.open: 1
- reportStats.inProgress: 0
- reportStats.closed: 5

Dashboard validation result:

PASSED

---

## 8) Safety Reports Data Preview

Safety Reports response preview returned data successfully.

Observed sample:

- title: Clean Workflow Test
- status: CLOSED
- companyId present
- siteProject relation present
- deletedAt: null

Safety Reports validation result:

PASSED

---

## 9) Action Plans Data Preview

Action Plans response preview returned data successfully.

Observed sample:

- title: AP-02 Manager Validation
- status: VERIFIED
- companyId present
- safetyReportId present
- completedByUserId present
- verifiedByUserId present

Action Plans validation result:

PASSED

---

## 10) Users Data Preview

Users response preview returned data successfully.

Observed sample roles:

- WORKER
- MANAGER

Observed tenant isolation field:

companyId present on returned users

Users validation result:

PASSED

---

## 11) Billing Data Preview

Billing response preview returned data successfully.

Observed billing state:

- subscriptionPlan: TRIAL
- subscriptionStatus: TRIAL
- effectiveBillingState: TRIAL
- access: ALLOWED
- status: TRIAL
- plan: TRIAL

Billing endpoint validation result:

PASSED

Important:

This validation did not change Billing.

This validation did not redesign Billing.

This validation only confirmed existing read behavior through Web API Proxy.

---

## 12) Architecture Validation

Required architecture:

Web → API Proxy → Core

Observed validation path:

- login through Web API Proxy
- dashboard through Web API Proxy
- safety reports through Web API Proxy
- action plans through Web API Proxy
- users through Web API Proxy
- billing through Web API Proxy

Architecture validation result:

PASSED

No direct UI → Core validation was accepted as evidence.

No direct Core public access was used as application validation.

---

## 13) Runtime Safety Confirmation

During authenticated validation:

- No container replacement was executed.
- No Docker run was executed.
- No Docker rm was executed.
- No Docker Compose action was executed.
- No backup deletion was executed.
- No final closure was executed.
- No pilot execution was approved.
- No Core change was made.
- No DB change was made.
- No Billing change was made.
- No companyId change was made.
- No Workflow change was made.

---

## 14) Validation Decision

Authenticated functional validation:

PASSED

Web deployment runtime state after authenticated validation:

STABLE

Active Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Core state:

UNCHANGED

PostgreSQL state:

UNCHANGED

Backup Web container:

PRESENT

---

## 15) Next Valid Action

The next valid action is:

CREATE WEB FINAL DEPLOYMENT CLOSURE APPROVAL CHECKPOINT

Expected next file:

docs/deployment/WEB_FINAL_DEPLOYMENT_CLOSURE_APPROVAL_CHECKPOINT_2026_06_01.md

This checkpoint may approve final closure documentation only.

It must not approve backup deletion.

It must not approve pilot execution.

Backup deletion, if needed later, must be handled by a separate controlled cleanup plan after final closure.

---

## 16) Safety Confirmation

This document records authenticated functional validation only.

No additional server action was executed by creating this document.

No container action was executed by creating this document.

No Docker run was executed by creating this document.

No Docker rm was executed by creating this document.

No Docker Compose action was executed.

No backup deletion was executed.

No final closure was executed by this document.

No pilot execution was approved.

No Core change was made.

No DB change was made.

No Billing change was made.

No companyId change was made.

No Workflow change was made.

Was anything deleted by creating this validation result?

NO

---

END OF DOCUMENT
