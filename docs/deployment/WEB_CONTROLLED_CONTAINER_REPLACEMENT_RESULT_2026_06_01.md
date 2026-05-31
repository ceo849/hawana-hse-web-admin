# HAWANA HSE — WEB CONTROLLED CONTAINER REPLACEMENT RESULT

Document Type: Controlled Web Container Replacement Result  
Repository: hawana-hse-web-admin  
Layer: Web Admin Production Runtime  
Architecture: Web → API Proxy → Core → PostgreSQL  
Mode: Stability First / Controlled Replacement / Zero-Risk Deployment Chain  
Status: WEB CONTROLLED CONTAINER REPLACEMENT PASSED  
Date: 2026-06-01  

---

## 1) Purpose

This document records the result of the controlled Web container replacement on the production server.

This document is evidence only.

It does not approve final deployment closure.

It does not approve backup deletion.

It does not approve pilot execution.

---

## 2) Approved Scope

Approved by:

web-controlled-container-replacement-approval-checkpoint-2026-06-01

Approved action:

Controlled replacement of hawana-web only.

Not approved:

- Core change
- DB change
- Billing change
- companyId change
- Workflow change
- Nginx change
- Docker Compose action
- Volume deletion
- Image deletion
- Backup deletion
- First real external pilot execution

---

## 3) Replacement Execution Result

Execution location:

Production server

Execution type:

Controlled Web container replacement

Replacement result:

PASSED

New Web container name:

hawana-web

New active Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

New Web image ID:

sha256:c9065201dca9abc28dcbe5739a3bd6fc530c32f3533b8b61cd1678d394cb26a5

Image platform:

linux/amd64

New Web container ID:

453eb89233775dd6bbc9397cb64d13aeebac4773cc3c48b0d6d7fa3944367631

Runtime status after replacement:

hawana-web Up

Port mapping:

0.0.0.0:3005->3000/tcp  
[::]:3005->3000/tcp

---

## 4) Old Web Backup Container

Old Web container was preserved as backup.

Backup container name:

hawana-web-backup-before-controlled-deployment-2026-06-01

Backup Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-audit-governance-runtime-deployable-2026-05-24

Backup Web image ID before replacement:

sha256:f953ed6187372677ecb6821177ee880cd13d748314745d1928a830275d9cab18

Backup container status after replacement:

Exited (0)

Backup deletion status:

NOT APPROVED

Rollback availability:

AVAILABLE

---

## 5) Environment Preservation

Current Web environment was saved to a restricted server file before replacement.

Restricted env backup path:

/home/ceo/hawana-web-env-backup-before-controlled-deployment-2026-06-01.env

Permissions:

-rw-------

Owner:

root root

Secrets were not printed in the terminal output.

---

## 6) Runtime Baseline Before Replacement

Before replacement, active containers were:

hawana-core:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

Status:

Up 3 hours

Ports:

127.0.0.1:3001->3001/tcp

hawana-web:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-audit-governance-runtime-deployable-2026-05-24

Status:

Up 7 days

Ports:

0.0.0.0:3005->3000/tcp  
[::]:3005->3000/tcp

hawana-postgres:

postgres:16-alpine

Status:

Up 4 weeks

Ports:

5432/tcp

---

## 7) Runtime State After Replacement

After replacement, active containers were:

hawana-web:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Status:

Up

Ports:

0.0.0.0:3005->3000/tcp  
[::]:3005->3000/tcp

hawana-core:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

Status:

Up 3 hours

Ports:

127.0.0.1:3001->3001/tcp

hawana-postgres:

postgres:16-alpine

Status:

Up 4 weeks

Ports:

5432/tcp

---

## 8) Health Validation

Public API health through Web/API Proxy:

HTTP status:

200 OK

Response body:

{"status":"ok","timestamp":"2026-05-31T23:53:29.365Z"}

Health validation result:

PASSED

Important note:

Health validation is necessary but not sufficient for final deployment closure.

Functional validation is still required.

---

## 9) Architecture Preservation

Architecture status:

Web → API Proxy → Core preserved

Core image after replacement:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

Core change:

NO

Postgres status:

Running

DB change:

NO

Billing change:

NO

companyId change:

NO

Workflow change:

NO

Nginx change:

NO

Docker Compose action:

NO

Volume deletion:

NO

Image deletion:

NO

---

## 10) Execution Concern

A terminal paste corruption was visible in the submitted command text.

Observed issue:

A pasted command line contained malformed terminal text before execution continued.

Assessment:

The actual executed output shows that the controlled replacement completed successfully and the expected post-replacement state was achieved.

Control decision:

Do not ignore the paste corruption.

Do not proceed directly to final closure.

Proceed only to post-replacement functional validation approval checkpoint.

---

## 11) Result Decision

Controlled Web container replacement result:

PASSED

Production Web image replacement:

COMPLETED

Rollback path:

AVAILABLE

Old Web backup:

PRESERVED

Final deployment closure:

NOT APPROVED YET

Functional validation:

REQUIRED NEXT

---

## 12) Next Valid Action

The next valid action is:

CREATE POST-REPLACEMENT FUNCTIONAL VALIDATION APPROVAL CHECKPOINT

Expected next file:

docs/deployment/WEB_POST_REPLACEMENT_FUNCTIONAL_VALIDATION_APPROVAL_CHECKPOINT_2026_06_01.md

This checkpoint may approve validation only.

It must not approve backup deletion, final closure, or pilot execution.

---

## 13) Safety Confirmation

This document records the Web controlled container replacement result only.

No additional server action was executed by creating this document.

No Core change was made.

No DB change was made.

No Billing change was made.

No companyId change was made.

No Workflow change was made.

No Nginx change was made.

No Docker Compose action was executed.

No volume was deleted.

No image was deleted.

Was anything deleted by creating this validation result?

NO

---

END OF DOCUMENT
