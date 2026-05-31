# HAWANA HSE — WEB POST-REPLACEMENT FUNCTIONAL VALIDATION APPROVAL CHECKPOINT

Document Type: Web Deployment Approval Checkpoint
Repository: hawana-hse-web-admin
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Controlled Validation Only / No Runtime Change By This Document
Status: APPROVAL CREATED — POST-REPLACEMENT FUNCTIONAL VALIDATION ONLY APPROVED FOR NEXT STEP
Date: 2026-06-01

---

## 1) Purpose

This document approves the next controlled validation step after Web container replacement.

The Web container replacement result has been recorded.

This checkpoint approves functional validation only.

This checkpoint does not approve final closure.

This checkpoint does not approve backup deletion.

This checkpoint does not approve pilot execution.

---

## 2) Previous Required Evidence

Required previous result:

docs/deployment/WEB_CONTROLLED_CONTAINER_REPLACEMENT_RESULT_2026_06_01.md

Required status:

WEB CONTROLLED CONTAINER REPLACEMENT PASSED

Current active Web image after replacement:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Backup Web container:

hawana-web-backup-before-controlled-deployment-2026-06-01

Backup status:

PRESERVED

---

## 3) Approved Scope

Approved next action:

POST-REPLACEMENT FUNCTIONAL VALIDATION

Allowed validation actions:

- Verify Web container is running.
- Verify active Web image.
- Review safe Web logs tail.
- Verify public API health through Web API Proxy.
- Verify Core remains unchanged.
- Verify PostgreSQL remains unchanged.
- Verify Dashboard loads.
- Verify Safety Reports route loads.
- Verify Action Plans route loads.
- Verify Users route behavior.
- Verify Billing route behavior remains valid.
- Verify session persistence where applicable.
- Verify logout behavior where applicable.
- Verify API Proxy flow remains intact.
- Verify no direct Core URL appears in browser-visible output.

---

## 4) Explicitly Not Approved

This checkpoint does not approve:

- backup container deletion
- image deletion
- Docker prune
- Docker Compose action
- Nginx change
- Core change
- DB change
- Billing change
- companyId change
- Workflow change
- code change
- final deployment closure
- first real pilot execution

---

## 5) Mandatory Architecture Validation

The validation must confirm that the mandatory architecture remains:

Web → API Proxy → Core → PostgreSQL

Required confirmations:

- UI uses /api.
- Core is not called directly from UI.
- :3001 is not exposed in browser-visible UI output.
- server-side Core access remains behind Web API Proxy.
- CORE_API_BASE_URL remains server-side only.
- NEXT_PUBLIC_API_BASE_URL remains /api.
- Backend remains source of truth.
- companyId remains backend/JWT-owned.

---

## 6) Server Validation Boundaries

Server validation may use read-only commands only unless a failure requires rollback.

Allowed read-only server checks:

- docker ps
- docker inspect
- docker logs --tail
- curl health endpoints

Rollback is allowed only if the new Web runtime fails validation.

Rollback must preserve:

- Core
- PostgreSQL
- Billing
- companyId
- Workflow
- Docker network
- volumes
- Nginx

---

## 7) Expected Validation Result File

The expected result file is:

docs/deployment/WEB_POST_REPLACEMENT_FUNCTIONAL_VALIDATION_RESULT_2026_06_01.md

That file must record:

- Web active image
- Web runtime status
- Web logs status
- Public API health result
- Core unchanged confirmation
- PostgreSQL unchanged confirmation
- API Proxy validation result
- UI route validation result
- Session/logout validation result if performed
- Whether rollback was needed
- Whether rollback was executed
- Next valid action

---

## 8) Failure Handling

If validation fails:

STOP.

Do not continue to final closure.

Do not delete backup container.

Do not change Core.

Do not change DB.

Do not change Nginx.

Do not change Docker network.

Collect evidence and decide whether rollback is required.

---

## 9) Next Valid Action

The next valid action is:

EXECUTE WEB POST-REPLACEMENT FUNCTIONAL VALIDATION

Expected result file:

docs/deployment/WEB_POST_REPLACEMENT_FUNCTIONAL_VALIDATION_RESULT_2026_06_01.md

No final deployment closure is approved yet.

No backup deletion is approved yet.

No pilot execution is approved yet.

---

## 10) Safety Confirmation

This document is documentation only.

No server action was executed by creating this document.

No container action was executed by creating this document.

No Docker run was executed.

No Docker rm was executed.

No Docker Compose action was executed.

No Core change was made.

No DB change was made.

No Billing change was made.

No companyId change was made.

No Workflow change was made.

No production deployment execution was performed.

Was anything deleted by creating this approval checkpoint?

NO

---

END OF DOCUMENT
