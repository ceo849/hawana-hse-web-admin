# HAWANA HSE — WEB LOCAL BUILD APPROVAL CHECKPOINT

Document Type: Web Local Build Approval Checkpoint
Repository: hawana-hse-web-admin
Path: docs/deployment/WEB_LOCAL_BUILD_APPROVAL_CHECKPOINT_2026_06_01.md
Date: 2026-06-01
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Approval Checkpoint Only / No Runtime Change
Status: APPROVAL CREATED — LOCAL BUILD ONLY APPROVED FOR NEXT STEP

---

## 1) Purpose

This document approves the next controlled Web deployment preparation step:

LOCAL WEB BUILD VALIDATION ONLY

This checkpoint does not execute the build.

This checkpoint does not approve Docker image build.

This checkpoint does not approve Docker image push.

This checkpoint does not approve server pull.

This checkpoint does not approve container replacement.

This checkpoint does not approve production deployment.

---

## 2) Current Web Baseline

Repository:

hawana-hse-web-admin

Branch:

phase4.3-web-hardening

Current deployment preparation state:

WEB CURRENT STATE INSPECTION AND DEPLOYMENT READINESS PLAN CREATED

Latest readiness plan:

docs/deployment/WEB_CURRENT_STATE_INSPECTION_AND_DEPLOYMENT_READINESS_PLAN_2026_06_01.md

Latest governance authority:

docs/deployment/WEB_DEPLOYMENT_RUNBOOK.md

Current runbook status:

ACTIVE — MANDATORY BEFORE ANY WEB DEPLOYMENT

Runbook governance addendum:

PRESENT

---

## 3) Approved Action

Approved next action:

Run local Web build validation.

Allowed command:

npm run build

Allowed scope:

Local build validation only.

Expected output:

Build succeeds without TypeScript, Next.js, import, route, or runtime compile errors.

---

## 4) Not Approved

The following actions are not approved by this checkpoint:

- Docker image build
- Docker image push
- Artifact Registry push
- Server pull
- Web container replacement
- Core container action
- Postgres action
- Docker Compose action
- Production deployment
- Production runtime change
- DB change
- Billing change
- companyId change
- Workflow change
- Nginx change
- Docker network change

---

## 5) Architecture Protection

Mandatory architecture remains:

Web → API Proxy → Core → PostgreSQL

Build validation must not introduce or approve:

- Direct UI → Core calls
- Browser-side :3001 usage
- Frontend companyId authority
- Frontend Workflow derivation
- Frontend Billing derivation
- Core changes
- DB changes
- API contract changes

---

## 6) Required Build Validation Command

The next execution step may run:

npm run build

The build result must be documented in:

docs/deployment/WEB_LOCAL_BUILD_VALIDATION_RESULT_2026_06_01.md

The result document must include:

- Build command
- Build result
- Any warnings
- Any errors
- Whether Web Audit passed during push hook if applicable
- Confirmation that no Docker action occurred
- Confirmation that no production deployment occurred
- Next valid action

---

## 7) Failure Handling

If local build fails:

STOP.

Do not build Docker image.

Do not push image.

Do not pull on server.

Do not replace container.

Create a build failure evidence document.

Fix only the root cause through a separate controlled plan.

---

## 8) Next Valid Action

The next valid action is:

EXECUTE LOCAL WEB BUILD VALIDATION

The expected result file is:

docs/deployment/WEB_LOCAL_BUILD_VALIDATION_RESULT_2026_06_01.md

No Docker or production action is approved yet.

---

## 9) Safety Confirmation

This document is documentation only.

No code change was made.

No build was executed by creating this document.

No Docker action was executed.

No Docker image was built.

No Docker image was pushed.

No server pull was executed.

No container action was executed.

No DB change was executed.

No Billing change was executed.

No companyId change was executed.

No Workflow change was executed.

No Core change was executed.

No production deployment execution was performed.

Was anything deleted by creating this approval checkpoint?

NO

---

END OF DOCUMENT
