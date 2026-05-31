# HAWANA HSE — WEB CURRENT STATE INSPECTION AND DEPLOYMENT READINESS PLAN

Document Type: Web Deployment Readiness Plan
Repository: hawana-hse-web-admin
Path: docs/deployment/WEB_CURRENT_STATE_INSPECTION_AND_DEPLOYMENT_READINESS_PLAN_2026_06_01.md
Date: 2026-06-01
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes / Zero-Risk Deployment Preparation
Status: PLAN CREATED — WEB DEPLOYMENT NOT STARTED

---

## 1) Purpose

This document records the current Web repository state before any controlled Web production deployment activity.

It exists to create the first checkpoint in the Web deployment governance chain.

This document does not approve build execution.

This document does not approve Docker image build.

This document does not approve image push.

This document does not approve server pull.

This document does not approve Web container replacement.

This document does not approve production deployment execution.

This document does not approve Core, DB, Billing, companyId, Workflow, Nginx, or Docker network changes.

---

## 2) Current Repository State

Repository:

hawana-hse-web-admin

Branch:

phase4.3-web-hardening

Current HEAD before this document:

34a2284

Current HEAD commit:

docs: add web deployment runbook governance addendum

Current HEAD tag:

web-deployment-runbook-governance-addendum-2026-06-01

Remote alignment:

CONFIRMED BEFORE THIS PLAN

Working tree before this plan:

CLEAN BEFORE THIS PLAN

---

## 3) Current Web Governance State

The Web Deployment Runbook exists at:

docs/deployment/WEB_DEPLOYMENT_RUNBOOK.md

Current runbook status:

ACTIVE — MANDATORY BEFORE ANY WEB DEPLOYMENT

The runbook now includes:

19) MANDATORY WEB DEPLOYMENT GOVERNANCE ADDENDUM

The addendum requires:

- checkpoint-based production deployment
- no blind command execution
- disk-space gate before server pull
- controlled cleanup governance
- controlled Web replacement instead of blind rm -f as default
- rollback readiness before replacement
- functional validation after replacement
- final deployment closure
- current state handoff after closure

---

## 4) Current Web Code State

Latest meaningful Web code fix identified from Git history:

web-mobile-fab-empty-actions-visibility-fix-2026-05-31

Related implementation evidence exists in Web docs.

Latest repository HEAD is documentation-only after that implementation chain.

This plan does not modify code.

This plan does not validate code behavior by itself.

Build validation must be approved separately.

---

## 5) Current Core State Dependency

Core deployment is already closed and accepted in the Core repository.

Core current state anchor:

docs/deployment/CORE_CURRENT_STATE_AFTER_CONTROLLED_DEPLOYMENT_CLOSURE_2026_05_31.md

Core production runtime:

STABLE

Active Core image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

Core image platform:

linux/amd64

Core health:

PASSED

Core readiness:

PASSED

Authenticated Core validation:

PASSED

Core must not be touched during Web deployment.

---

## 6) Mandatory Architecture

The mandatory architecture remains:

Web → API Proxy → Core → PostgreSQL

Web deployment must preserve:

- UI uses /api only
- UI does not call Core directly
- UI does not use :3001
- server-side Web access uses serverAppFetch only
- HttpOnly cookie flow remains active
- CORE_API_BASE_URL remains server-side only
- NEXT_PUBLIC_API_BASE_URL remains /api
- Backend remains source of truth
- companyId remains JWT/backend-owned
- Billing remains backend-controlled
- Workflow remains backend-controlled

---

## 7) Current Production Web State To Verify Later

The current production Web image must be verified on server before deployment execution.

Known current production Web image from Core current state report:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-audit-governance-runtime-deployable-2026-05-24

Expected Web container:

hawana-web

Expected Web port mapping:

3005:3000

Expected Web network:

hawanaglobal_default

This document does not verify server runtime directly.

Server runtime verification must happen in a later read-only approval/evidence step.

---

## 8) Required Deployment Chain

The Web deployment must follow the controlled chain from the Web Runbook Governance Addendum.

Required chain:

1. Web current state inspection and deployment readiness plan
2. Local build approval checkpoint
3. Local build validation result
4. Web Docker image build approval checkpoint
5. Web image build and push validation result
6. Server pull approval checkpoint
7. Server pull result
8. Controlled Web container replacement approval checkpoint
9. Controlled Web container replacement result
10. Post-replacement functional validation approval checkpoint
11. Post-replacement functional validation result
12. Authenticated functional validation approval checkpoint
13. Authenticated functional validation result
14. Final Web deployment closure
15. Web current state report after closure

This document creates step 1 only.

---

## 9) What Is Approved By This Document

Approved:

- Documentation of Web current state inspection
- Documentation of Web deployment readiness plan
- Preparing the next approval checkpoint document
- Continuing with local build approval checkpoint only

Not approved:

- npm run build
- Docker image build
- Docker image push
- Server pull
- Web container replacement
- Production deployment
- Core change
- DB change
- Billing change
- companyId change
- Workflow change
- Nginx change
- Docker network change
- Cleanup or deletion

---

## 10) Next Valid Action

The next valid action is:

CREATE WEB LOCAL BUILD APPROVAL CHECKPOINT

The next file should be:

docs/deployment/WEB_LOCAL_BUILD_APPROVAL_CHECKPOINT_2026_06_01.md

That checkpoint may approve local build only.

It must not approve Docker image build, image push, server pull, container replacement, or production deployment.

---

## 11) Safety Confirmation

This document is documentation only.

No code change was made.

No build was executed.

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

Was anything deleted by creating this readiness plan?

NO

---

END OF DOCUMENT
