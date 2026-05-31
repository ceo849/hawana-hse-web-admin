# HAWANA HSE — WEB LOCAL RUNTIME REFRESH POST-CLOSURE RUNTIME INVENTORY
# حصر Runtime بعد إغلاق Web Local Runtime Refresh

Document Type: Runtime Evidence / Post-Closure Inventory
Project: Hawana HSE Web Admin
Repository: hawana-hse-web-admin
Date: 2026-05-31
Status: POST-CLOSURE INVENTORY COMPLETED — READ ONLY

─────────────────────────────────────
## 1) Purpose
─────────────────────────────────────

This document records the read-only runtime inventory after closing the Web local runtime refresh.

The purpose is to confirm that the refreshed Web runtime is active on local port 3005 and that Core, DB, Billing, companyId, Workflow, API contracts, and production deployment were not touched.

─────────────────────────────────────
## 2) Git Baseline
─────────────────────────────────────

Branch:

phase4.3-web-hardening

Current HEAD:

45c2553

Current tag:

findings-register-web-local-runtime-refresh-final-closure-2026-05-31

Current commit message:

docs: close web local runtime refresh

Git status:

CLEAN

─────────────────────────────────────
## 3) Active Web Runtime
─────────────────────────────────────

Active Web container:

hawana-web

Active Web container ID:

a390ec00e25d

Active Web image:

hawana-hse-web-admin:local-rbac04-fab-refresh-2026-05-31

Active Web image digest:

sha256:5b6e8251fe27383d729eabc0b6b9a963938811c318724d12f5ce5fc0834550db

Runtime state:

Up

Port mapping:

3005 -> 3000

Restart policy:

unless-stopped

Network:

hawana-hse-core_default

Runtime status:

VALID

─────────────────────────────────────
## 4) Core and DB Runtime State
─────────────────────────────────────

Core container:

hawana-core

Core container ID:

4d0b1be3311c

Core state:

running

Core start time:

2026-05-30T16:26:22.038713334Z

Core status:

UNCHANGED

Database container:

hawana-postgres

Database container ID:

9d66e3f8aff7

Database state:

running

Database health:

healthy

Database start time:

2026-05-30T16:26:22.038701084Z

Database status:

UNCHANGED

─────────────────────────────────────
## 5) HTTP Checks
─────────────────────────────────────

GET /login on port 3005:

200 OK

GET /dashboard on port 3005 without authentication:

307 Temporary Redirect

Redirect target:

/login?next=%2Fdashboard

Result:

EXPECTED

─────────────────────────────────────
## 6) Runtime Contract
─────────────────────────────────────

Runtime architecture:

Web → API Proxy → Core

CORE_API_BASE_URL:

http://hawana-core:3001

NEXT_PUBLIC_API_BASE_URL:

/api

NEXT_PUBLIC_API_PREFIX:

/v1

NODE_ENV:

production

DOCKER_ENV:

true

Architecture status:

PRESERVED

─────────────────────────────────────
## 7) Remaining Non-Active Containers
─────────────────────────────────────

The following non-active or auxiliary Web containers were observed:

1. hawana-web-candidate-rbac04-fab-2026-05-31
   - Status: running
   - Port: 3007
   - Classification: candidate runtime

2. hawana-web-candidate-rbac04-2026-05-31
   - Status: running
   - Port: 3006
   - Classification: earlier candidate runtime

3. hawana-web-stale-before-switch-2026-05-31
   - Status: exited
   - Classification: rollback container preserved

4. hawana-web-test
   - Status: exited
   - Classification: old test container

5. hawana-web-admin-container
   - Status: exited
   - Classification: old container

6. hawana-web-admin
   - Status: exited
   - Classification: old container

No cleanup was executed.

Cleanup is not approved in this document.

Any cleanup must be handled later by a separate cleanup plan and separate approval.

─────────────────────────────────────
## 8) Images Inventory Observation
─────────────────────────────────────

Multiple historical Web images and backup tags exist locally.

Examples include:

- local-rbac04-fab-refresh-2026-05-31
- local-rbac04-refresh-2026-05-31
- latest
- multiple backup-20260509-* images
- older Artifact Registry images

Classification:

LOCAL IMAGE INVENTORY ONLY

No image deletion was executed.

No Docker prune was executed.

No cleanup was approved.

─────────────────────────────────────
## 9) Explicitly Not Performed
─────────────────────────────────────

Container deletion:

NOT PERFORMED

Container removal:

NOT PERFORMED

Image deletion:

NOT PERFORMED

Docker prune:

NOT PERFORMED

Docker compose:

NOT PERFORMED

Core rebuild:

NOT PERFORMED

Core restart:

NOT PERFORMED

DB restart:

NOT PERFORMED

DB mutation:

NOT PERFORMED

Billing change:

NOT PERFORMED

companyId change:

NOT PERFORMED

Workflow change:

NOT PERFORMED

Production deployment:

NOT PERFORMED

─────────────────────────────────────
## 10) Final Classification
─────────────────────────────────────

Post-closure runtime inventory:

COMPLETED

Active Web runtime:

VALID

Core runtime:

UNCHANGED

Database runtime:

UNCHANGED

Architecture status:

Web → API Proxy → Core PRESERVED

Cleanup status:

NOT STARTED

Cleanup approval:

NOT APPROVED

Production deployment:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

Was anything deleted?

NO
