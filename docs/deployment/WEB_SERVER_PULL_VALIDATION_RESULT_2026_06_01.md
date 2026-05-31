# HAWANA HSE — WEB SERVER PULL VALIDATION RESULT

Document Type: Web Server Pull Validation Result
Repository: hawana-hse-web-admin
Path: docs/deployment/WEB_SERVER_PULL_VALIDATION_RESULT_2026_06_01.md
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Server Pull Only / No Container Replacement
Status: WEB SERVER IMAGE PULL VALIDATION PASSED
Date: 2026-06-01

---

## 1) Purpose

This document records the result of the controlled Web server image pull validation.

This result follows:

docs/deployment/WEB_SERVER_PULL_APPROVAL_CHECKPOINT_2026_06_01.md

This document does not approve Web container replacement.

This document does not approve production deployment execution.

This document records evidence only.

---

## 2) Approved Scope Executed

Executed scope:

SERVER IMAGE PULL ONLY

Approved image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

The action executed was limited to:

- server disk space gate
- inode gate
- Docker disk usage review
- current runtime baseline capture
- current Web image capture
- current Core image capture
- current Postgres status capture
- Web image pull
- pulled image inspect
- runtime unchanged verification

No Web container replacement was executed.

No Docker run was executed.

No Docker rm was executed.

No Docker Compose action was executed.

No Core action was executed.

No DB action was executed.

No production deployment execution was performed.

---

## 3) Server Disk Space Gate

Root filesystem:

- Size: 29G
- Used: 20G
- Available: 9.7G
- Use: 67%

Result:

PASSED

Reason:

Available disk space is above the minimum 5GB threshold.

Root filesystem usage is below the 85% threshold.

---

## 4) Server Inode Gate

Root filesystem inode status:

- Inodes: 3.7M
- Used: 537K
- Free: 3.2M
- Use: 15%

Result:

PASSED

Reason:

Inodes are not under pressure.

---

## 5) Runtime Baseline Before Pull

Active containers before Web image pull:

hawana-core:

- Image: us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31
- Status: Up 2 hours
- Port: 127.0.0.1:3001->3001/tcp

hawana-web:

- Image: us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-audit-governance-runtime-deployable-2026-05-24
- Status: Up 7 days
- Port: 0.0.0.0:3005->3000/tcp, [::]:3005->3000/tcp

hawana-postgres:

- Image: postgres:16-alpine
- Status: Up 4 weeks
- Port: 5432/tcp

Baseline result:

CAPTURED

---

## 6) Pull Execution Result

Pull command target:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Pull result:

PASSED

Pull exit code:

0

Pull digest:

sha256:c9065201dca9abc28dcbe5739a3bd6fc530c32f3533b8b61cd1678d394cb26a5

Docker pull status:

Downloaded newer image.

---

## 7) Pulled Image Inspection

Pulled image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Operating system:

linux

Architecture:

amd64

Image ID:

sha256:c9065201dca9abc28dcbe5739a3bd6fc530c32f3533b8b61cd1678d394cb26a5

Platform validation result:

PASSED

Reason:

The image is linux/amd64 and suitable for the production server platform.

---

## 8) Runtime Unchanged Verification After Pull

Runtime after pull remained unchanged.

Active Web container still uses the old image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-audit-governance-runtime-deployable-2026-05-24

Active Core container still uses:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

Postgres remained running:

postgres:16-alpine

Result:

PASSED

No active runtime replacement happened during this step.

---

## 9) Governance Confirmation

This step did not change:

- Core
- PostgreSQL
- Billing
- companyId
- Workflow
- Docker network
- Nginx
- Volumes
- Active Web container

The new Web image is pulled on the server but is not yet active.

The active Web runtime is still the previous stable Web image.

---

## 10) Decision

Server image pull validation:

PASSED

Production Web container replacement:

NOT APPROVED BY THIS DOCUMENT

The next step requires a separate approval checkpoint.

---

## 11) Next Valid Action

The next valid action is:

CREATE CONTROLLED WEB CONTAINER REPLACEMENT APPROVAL CHECKPOINT

Expected next file:

docs/deployment/WEB_CONTROLLED_CONTAINER_REPLACEMENT_APPROVAL_CHECKPOINT_2026_06_01.md

This next checkpoint may approve controlled Web container replacement only.

It must define rollback before replacement.

It must preserve the old Web container as backup where possible.

It must not touch Core, PostgreSQL, Billing, companyId, Workflow, Nginx, Docker network, or volumes.

---

## 12) Safety Confirmation

This document records server pull validation only.

No container replacement was executed.

No Docker run was executed.

No Docker rm was executed.

No Docker Compose action was executed.

No Core change was made.

No DB change was made.

No Billing change was made.

No companyId change was made.

No Workflow change was made.

No production deployment execution was performed.

Was anything deleted by creating this validation result?

NO

---

END OF DOCUMENT
