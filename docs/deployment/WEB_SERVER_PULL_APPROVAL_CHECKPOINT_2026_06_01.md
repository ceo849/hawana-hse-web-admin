# HAWANA HSE — WEB SERVER PULL APPROVAL CHECKPOINT

Document Type: Production Server Pull Approval Checkpoint
Repository: hawana-hse-web-admin
Path: docs/deployment/WEB_SERVER_PULL_APPROVAL_CHECKPOINT_2026_06_01.md
Date: 2026-06-01
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Approval Checkpoint / No Runtime Change By This Document
Status: APPROVAL CREATED — SERVER IMAGE PULL ONLY APPROVED FOR NEXT STEP

---

## 1) Purpose

This document approves the next controlled Web deployment step:

SERVER IMAGE PULL ONLY

This checkpoint does not execute the pull.

This checkpoint does not approve Web container replacement.

This checkpoint does not approve production deployment completion.

This checkpoint does not approve Docker cleanup.

This checkpoint exists to ensure the target Web image is pulled on the production server only after readiness, disk, runtime, and rollback boundaries are clearly defined.

---

## 2) Approved Scope

Approved next action:

Pull the target Web Docker image on the production server.

Target image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Approved server-side action:

sudo docker pull us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Approved validation after pull:

- inspect pulled image
- confirm image exists on server
- confirm image OS is linux
- confirm image architecture is amd64
- confirm current hawana-web remains running
- confirm hawana-core remains running
- confirm hawana-postgres remains running
- confirm public /api/health remains healthy

---

## 3) Not Approved

The following actions are not approved by this checkpoint:

- Web container replacement
- stopping hawana-web
- removing hawana-web
- renaming hawana-web
- starting a new hawana-web container
- Docker Compose action
- Docker prune
- Docker cleanup
- Core container action
- PostgreSQL container action
- DB action
- Billing change
- companyId change
- Workflow change
- Nginx change
- Firewall change
- production deployment closure

---

## 4) Mandatory Pre-Pull Server Checks

Before pulling the target image, the following read-only server checks must pass:

df -h /

df -ih /

sudo docker system df -v

sudo docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

sudo docker inspect hawana-web --format='web_image={{.Config.Image}}'

sudo docker inspect hawana-core --format='core_image={{.Config.Image}}'

sudo docker inspect hawana-postgres --format='postgres_image={{.Config.Image}}'

curl -s https://hawanaglobal.com/api/health

Minimum safe conditions:

- root filesystem has at least 5GB available
- root filesystem is not above 85% usage
- inodes are not under pressure
- hawana-web is running
- hawana-core is running
- hawana-postgres is running
- public Web API health returns healthy response
- no restart loop exists

If any condition fails:

STOP.

Do not pull the image.

Create a controlled failure or cleanup plan.

---

## 5) Pull Command Approved For Next Step

The approved server pull command for the next execution step is:

sudo docker pull us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

After pull, inspect the image:

sudo docker image inspect us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01 --format 'image={{.RepoTags}} os={{.Os}} architecture={{.Architecture}} image_id={{.Id}}'

Expected:

- os=linux
- architecture=amd64

---

## 6) Required Result Evidence File

After executing the server pull step, create the result file locally:

docs/deployment/WEB_SERVER_PULL_VALIDATION_RESULT_2026_06_01.md

The result file must include:

- server disk state before pull
- current Web image before pull
- current Core image before pull
- current Postgres status before pull
- target image pull result
- target image architecture
- current hawana-web status after pull
- current hawana-core status after pull
- current hawana-postgres status after pull
- /api/health result after pull
- confirmation that no container replacement occurred
- confirmation that no Core change occurred
- confirmation that no DB change occurred
- confirmation that no Billing change occurred
- confirmation that no companyId change occurred
- confirmation that no Workflow change occurred
- next valid action

---

## 7) Rollback Boundary

Rollback is not required for server image pull only because the active Web container is not changed.

However, if the pull causes disk pressure or operational risk:

STOP.

Do not continue to container replacement.

Create a controlled remediation plan.

No cleanup is approved unless explicitly documented in a separate controlled cleanup plan.

---

## 8) Next Valid Action

The next valid action is:

EXECUTE WEB SERVER IMAGE PULL VALIDATION

Expected result file:

docs/deployment/WEB_SERVER_PULL_VALIDATION_RESULT_2026_06_01.md

No container replacement is approved yet.

No production deployment execution is approved yet.

---

## 9) Safety Confirmation

This document is documentation only.

No code change was made.

No build was executed.

No Docker action was executed by creating this document.

No image push was executed.

No server pull was executed by creating this document.

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
