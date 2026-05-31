# HAWANA HSE — WEB LOCAL BUILD VALIDATION RESULT

Document Type: Web Local Build Validation Evidence
Repository: hawana-hse-web-admin
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Local Build Only / No Production Change
Status: LOCAL BUILD VALIDATION PASSED
Date: 2026-06-01

---

## 1) Purpose

This document records the result of the approved local Web build validation.

This validation follows:

docs/deployment/WEB_LOCAL_BUILD_APPROVAL_CHECKPOINT_2026_06_01.md

This document does not approve Docker image build, image push, server pull, container replacement, or production deployment.

---

## 2) Execution Scope

Approved scope:

LOCAL WEB BUILD VALIDATION ONLY

Executed command:

npm run build

Not approved in this step:

- Docker image build
- Docker image push
- Server pull
- Web container replacement
- Core change
- DB change
- Billing change
- companyId change
- Workflow change
- Production deployment execution

---

## 3) Git Baseline

Branch:

phase4.3-web-hardening

Current HEAD:

a1984b1

Current commit:

a1984b1 docs: approve web local build validation

Current tags on HEAD:

web-local-build-approval-checkpoint-2026-06-01 

---

## 4) Build Result

Build command:

npm run build

Build exit code:



Build status:

PASSED

---

## 5) Build Output Tail

```text

> hawana-hse-web-admin@0.1.0 build
> next build

▲ Next.js 16.1.6 (Turbopack)
- Environments: .env.local, .env.production, .env

  Creating an optimized production build ...
✓ Compiled successfully in 2.5s
  Running TypeScript ...
  Collecting page data using 9 workers ...
  Generating static pages using 9 workers (0/23) ...
  Generating static pages using 9 workers (5/23) 
  Generating static pages using 9 workers (11/23) 
  Generating static pages using 9 workers (17/23) 
✓ Generating static pages using 9 workers (23/23) in 69.4ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /admin
├ ƒ /api/action-plans
├ ƒ /api/action-plans/[id]
├ ƒ /api/action-plans/[id]/due-date
├ ƒ /api/action-plans/[id]/status
├ ƒ /api/audit-log/[id]
├ ƒ /api/audit-logs
├ ƒ /api/auth/login
├ ƒ /api/auth/logout
├ ƒ /api/auth/refresh
├ ƒ /api/billing
├ ƒ /api/billing/checkout-session
├ ƒ /api/companies
├ ƒ /api/companies/[id]
├ ƒ /api/dashboard
├ ƒ /api/debug/session
├ ƒ /api/health
├ ƒ /api/platform/companies/[companyId]/users
├ ƒ /api/platform/metrics
├ ƒ /api/safety-reports
├ ƒ /api/safety-reports/[id]
├ ƒ /api/sites-projects
├ ƒ /api/sites-projects/[id]
├ ƒ /api/users
├ ƒ /api/users/[id]
├ ○ /billing/cancel
├ ○ /billing/success
├ ƒ /dashboard
├ ƒ /dashboard/action-plans
├ ƒ /dashboard/action-plans/[id]
├ ƒ /dashboard/action-plans/[id]/edit
├ ƒ /dashboard/action-plans/new
├ ƒ /dashboard/admin
├ ƒ /dashboard/audit-logs
├ ƒ /dashboard/billing
├ ƒ /dashboard/companies
├ ƒ /dashboard/companies/[id]
├ ƒ /dashboard/companies/[id]/edit
├ ƒ /dashboard/companies/new
├ ƒ /dashboard/safety-reports
├ ƒ /dashboard/safety-reports/[id]
├ ƒ /dashboard/safety-reports/[id]/edit
├ ƒ /dashboard/safety-reports/new
├ ƒ /dashboard/sites-projects
├ ƒ /dashboard/sites-projects/[id]
├ ƒ /dashboard/sites-projects/[id]/edit
├ ƒ /dashboard/sites-projects/new
├ ƒ /dashboard/users
├ ƒ /dashboard/users/[id]
├ ƒ /dashboard/users/new
└ ○ /login


ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## 6) Architecture Confirmation

This step did not change architecture.

Mandatory architecture remains:

Web → API Proxy → Core → PostgreSQL

Web must continue using:

- /api only
- serverAppFetch for server-side Core access
- HttpOnly Cookies
- Backend as source of truth

No direct UI → Core access was approved.

---

## 7) Protection Confirmation

No Core change was executed.

No DB change was executed.

No Billing change was executed.

No companyId change was executed.

No Workflow change was executed.

No Docker action was executed.

No Docker image was built.

No Docker image was pushed.

No server pull was executed.

No container action was executed.

No production deployment execution was performed.

---

## 8) Next Valid Action

Next valid action:

CREATE WEB DOCKER IMAGE BUILD APPROVAL CHECKPOINT

If build status is PASSED, the next file should be:

docs/deployment/WEB_DOCKER_IMAGE_BUILD_APPROVAL_CHECKPOINT_2026_06_01.md

If build status is FAILED, no Docker or deployment action is allowed.

---

## 9) Safety Confirmation

This document is documentation only after local build validation.

No production runtime action was performed.

Was anything deleted by creating this validation result?

NO

---

END OF DOCUMENT
