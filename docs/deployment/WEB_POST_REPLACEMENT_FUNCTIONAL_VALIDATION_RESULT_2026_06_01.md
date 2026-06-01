# HAWANA HSE — WEB POST-REPLACEMENT FUNCTIONAL VALIDATION RESULT

Document Type: Web Deployment Validation Result
Repository: hawana-hse-web-admin
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Validation Only / No Runtime Change By This Document
Status: WEB POST-REPLACEMENT FUNCTIONAL VALIDATION PASSED
Date: 2026-06-01

---

## 1) Purpose

This document records the post-replacement functional validation result after the controlled Web container replacement.

This document is evidence only.

It does not approve final deployment closure.

It does not approve backup deletion.

It does not approve pilot execution.

---

## 2) Approval Reference

Approved by:

web-post-replacement-functional-validation-approval-checkpoint-2026-06-01

Approval scope:

POST-REPLACEMENT FUNCTIONAL VALIDATION ONLY

Not approved by that checkpoint:

- final deployment closure
- backup deletion
- pilot execution
- Core change
- DB change
- Billing change
- companyId change
- Workflow change
- Nginx change
- Docker Compose action

---

## 3) Validation Scope

The validation executed on the production server was limited to:

- current runtime status check
- active Web image check
- active Web image ID check
- Core image unchanged check
- PostgreSQL status unchanged check
- backup Web container existence check
- Web logs safe tail review
- public API health through Web/API Proxy
- public login page HTTP status
- public dashboard behavior without session
- direct Core public access check
- final runtime status check

No container replacement was executed during this validation step.

No Docker run was executed during this validation step.

No Docker rm was executed during this validation step.

No Docker Compose action was executed during this validation step.

---

## 4) Runtime Baseline During Validation

Current runtime status during validation:

hawana-web:

- Image: us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01
- Status: Up 5 minutes
- Ports: 0.0.0.0:3005->3000/tcp, [::]:3005->3000/tcp

hawana-core:

- Image: us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31
- Status: Up 3 hours
- Ports: 127.0.0.1:3001->3001/tcp

hawana-postgres:

- Image: postgres:16-alpine
- Status: Up 4 weeks
- Ports: 5432/tcp

Result:

PASSED

---

## 5) Active Web Image Validation

Active Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Active Web image ID:

sha256:c9065201dca9abc28dcbe5739a3bd6fc530c32f3533b8b61cd1678d394cb26a5

Result:

PASSED

---

## 6) Core And PostgreSQL Preservation Validation

Core image during validation:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

Core status:

Up 3 hours

PostgreSQL image:

postgres:16-alpine

PostgreSQL status:

Up 4 weeks

Result:

PASSED

No Core change was detected.

No PostgreSQL change was detected.

---

## 7) Backup Web Container Validation

Backup Web container:

hawana-web-backup-before-controlled-deployment-2026-06-01

Backup Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-audit-governance-runtime-deployable-2026-05-24

Backup Web status:

Exited (0) 5 minutes ago

Result:

PASSED

Backup container is preserved for rollback.

No backup deletion was executed.

---

## 8) Web Logs Validation

Web logs safe tail showed:

- Next.js 16.1.6
- Local URL available inside container
- Network URL available inside container
- Starting completed
- Ready in 900ms

Result:

PASSED

No restart loop was observed.

No fatal startup error was observed.

---

## 9) Public API Health Through Web/API Proxy

Validation command result:

HTTP status:

200 OK

Response body:

{"status":"ok","timestamp":"2026-05-31T23:59:14.806Z"}

Result:

PASSED

This confirms public health access through the Web/API Proxy path.

---

## 10) Public Login Page Validation

Login page HTTP status:

200 OK

Observed headers included:

- Content-Type: text/html; charset=utf-8
- X-Powered-By: Next.js
- Cache-Control: s-maxage=31536000

Result:

PASSED

The login page is reachable after Web replacement.

---

## 11) Dashboard Without Session Validation

Dashboard without session returned:

HTTP/1.1 307 Temporary Redirect

Redirect location:

/login?next=%2Fdashboard

Result:

PASSED

This is expected behavior for protected dashboard access without an authenticated session.

---

## 12) Direct Core Public Access Check

Direct Core public access check was executed against:

https://hawanaglobal.com:3001/v1/health

No successful public Core response was recorded in the provided output.

Result:

PASSED WITH OUTPUT LIMITATION

Interpretation:

The provided output does not show public Core exposure.

Core remains internally bound according to runtime status:

127.0.0.1:3001->3001/tcp

---

## 13) Final Runtime Status After Validation

Final runtime status after validation:

hawana-web:

- Image: us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01
- Status: Up 5 minutes
- Ports: 0.0.0.0:3005->3000/tcp, [::]:3005->3000/tcp

hawana-core:

- Image: us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31
- Status: Up 3 hours
- Ports: 127.0.0.1:3001->3001/tcp

hawana-postgres:

- Image: postgres:16-alpine
- Status: Up 4 weeks

Result:

PASSED

---

## 14) Functional Validation Decision

Post-replacement functional validation result:

PASSED

Accepted validations:

- Web container running
- Web active image confirmed
- Web active image ID confirmed
- Web logs safe tail reviewed
- Public API health through Web/API Proxy passed
- Login page reachable
- Dashboard protection redirect works without session
- Core image unchanged
- PostgreSQL unchanged
- Backup Web container preserved
- Runtime status stable after validation

Remaining before final closure:

- authenticated browser/session validation if required
- final deployment closure
- current state report after closure
- backup deletion decision later, only after explicit approval

---

## 15) Next Valid Action

The next valid action is:

CREATE WEB AUTHENTICATED FUNCTIONAL VALIDATION APPROVAL CHECKPOINT

Expected next file:

docs/deployment/WEB_AUTHENTICATED_FUNCTIONAL_VALIDATION_APPROVAL_CHECKPOINT_2026_06_01.md

This checkpoint may approve authenticated validation only.

It must not approve backup deletion.

It must not approve final closure.

It must not approve pilot execution.

---

## 16) Safety Confirmation

This document records post-replacement functional validation only.

No additional server action was executed by creating this document.

No container action was executed by creating this document.

No Docker run was executed by creating this document.

No Docker rm was executed by creating this document.

No Docker Compose action was executed.

No backup deletion was executed.

No final closure was executed.

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
