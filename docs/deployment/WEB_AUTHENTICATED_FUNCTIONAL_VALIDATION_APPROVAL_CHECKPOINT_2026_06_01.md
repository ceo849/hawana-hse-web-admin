# HAWANA HSE — WEB AUTHENTICATED FUNCTIONAL VALIDATION APPROVAL CHECKPOINT

Document Type: Authenticated Functional Validation Approval Checkpoint
Repository: hawana-hse-web-admin
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Validation Only / No Runtime Change
Status: APPROVAL CREATED — AUTHENTICATED FUNCTIONAL VALIDATION ONLY APPROVED FOR NEXT STEP
Date: 2026-06-01

---

## 1) Purpose

This document approves the next controlled validation step after Web controlled container replacement and post-replacement functional validation.

The approved next step is authenticated functional validation only.

This document does not approve final deployment closure.

This document does not approve backup deletion.

This document does not approve pilot execution.

This document does not approve any Core, DB, Billing, companyId, Workflow, Nginx, Docker network, or volume change.

---

## 2) Previous Required Evidence

The previous required result file exists:

docs/deployment/WEB_POST_REPLACEMENT_FUNCTIONAL_VALIDATION_RESULT_2026_06_01.md

Previous result status:

WEB POST-REPLACEMENT FUNCTIONAL VALIDATION PASSED

Confirmed runtime state from previous evidence:

- Web container is running.
- Active Web image is the new image.
- Public /api/health returned 200 OK.
- Login page returned 200 OK.
- Dashboard without session redirected to login.
- Backup Web container exists.
- Core image remained unchanged.
- PostgreSQL remained unchanged.
- No Docker Compose action was executed.
- No backup deletion was executed.

---

## 3) Approved Scope

Approved action:

EXECUTE WEB AUTHENTICATED FUNCTIONAL VALIDATION

Approved validation type:

Authenticated Web validation through browser or controlled HTTP session validation.

Allowed checks:

- Login through Web
- Dashboard authenticated access
- Safety Reports authenticated access
- Action Plans authenticated access
- Users route behavior according to role
- Billing route read-only behavior
- Logout behavior
- Session persistence
- API Proxy flow
- No direct Core URL exposure from UI
- Web → API Proxy → Core preservation

Allowed read-only server checks if needed:

- docker ps
- docker inspect hawana-web
- docker inspect hawana-core
- docker logs hawana-web --tail
- curl public Web/API endpoints

---

## 4) Explicitly Not Approved

The following actions are not approved:

- Final deployment closure
- Backup Web container deletion
- Docker image deletion
- Docker volume deletion
- Docker Compose action
- Web container replacement
- Web container recreation
- Core restart
- Core replacement
- PostgreSQL restart
- DB migration
- Billing change
- companyId change
- Workflow change
- Nginx change
- Firewall change
- Pilot execution
- Tenant onboarding execution

---

## 5) Required Validation Evidence

The authenticated validation result must record:

- Validation method
- Authenticated role used
- Whether login succeeded
- Whether dashboard loaded
- Whether Safety Reports loaded
- Whether Action Plans loaded
- Whether Users route behavior matched role policy
- Whether Billing route behavior remained valid
- Whether logout worked
- Whether session behavior remained valid
- Whether API Proxy flow remained intact
- Whether direct Core access from UI was absent
- Web image after validation
- Core image after validation
- PostgreSQL status after validation
- Backup Web container status
- Any observed issue
- Final validation result

---

## 6) Required Architecture Confirmation

The validation must confirm:

Web → API Proxy → Core → PostgreSQL

The validation must not use direct UI → Core calls.

The validation must not validate by bypassing /api.

The validation must not use frontend-derived companyId.

The validation must not use frontend-derived Workflow state.

The validation must not use frontend-derived Billing state.

---

## 7) Failure Handling

If authenticated validation fails:

STOP.

Do not delete backup container.

Do not finalize deployment closure.

Do not change Core.

Do not change DB.

Do not change Billing.

Do not change companyId.

Do not change Workflow.

Do not change Nginx.

Do not change Docker network.

Document the failure in a result file.

Rollback may only be executed after a separate rollback approval checkpoint unless production availability is actively broken.

---

## 8) Expected Result File

The expected result file is:

docs/deployment/WEB_AUTHENTICATED_FUNCTIONAL_VALIDATION_RESULT_2026_06_01.md

This result file must be created after validation evidence is collected.

---

## 9) Next Valid Action

The next valid action is:

EXECUTE WEB AUTHENTICATED FUNCTIONAL VALIDATION

Expected next file:

docs/deployment/WEB_AUTHENTICATED_FUNCTIONAL_VALIDATION_RESULT_2026_06_01.md

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

No backup deletion was executed.

No final closure was executed.

No pilot execution was approved.

No Core change was made.

No DB change was made.

No Billing change was made.

No companyId change was made.

No Workflow change was made.

Was anything deleted by creating this approval checkpoint?

NO

---

END OF DOCUMENT
