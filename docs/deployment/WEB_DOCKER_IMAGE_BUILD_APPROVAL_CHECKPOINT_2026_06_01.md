# HAWANA HSE — WEB DOCKER IMAGE BUILD APPROVAL CHECKPOINT

Document Type: Web Docker Image Build Approval Checkpoint
Repository: hawana-hse-web-admin
Path: docs/deployment/WEB_DOCKER_IMAGE_BUILD_APPROVAL_CHECKPOINT_2026_06_01.md
Date: 2026-06-01
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Status: APPROVAL CREATED — WEB DOCKER IMAGE BUILD AND PUSH ONLY APPROVED FOR NEXT STEP

---

## 1) Purpose

This document approves the next controlled step in the Web production deployment chain:

WEB DOCKER IMAGE BUILD AND PUSH ONLY

This checkpoint does not approve production server pull.

This checkpoint does not approve Web container replacement.

This checkpoint does not approve production deployment execution.

This checkpoint does not approve any Core, DB, Billing, companyId, Workflow, Nginx, Docker network, or infrastructure change.

---

## 2) Previous Completed Checkpoint

Previous checkpoint:

docs/deployment/WEB_LOCAL_BUILD_VALIDATION_RESULT_2026_06_01.md

Previous checkpoint status:

LOCAL BUILD VALIDATION PASSED

Current Git commit at approval time:

a689702

Current Git tag at approval time:

web-local-build-validation-result-2026-06-01

Build result:

PASSED

Web Audit result during push:

AUDIT CLEAN — Web Audit Passed — Push Allowed

---

## 3) Approved Scope

Approved for next step only:

- Build Web Docker image locally from Mac
- Force production platform:
  linux/amd64
- Push Web Docker image to Google Artifact Registry
- Record build result in evidence file

Required image repository:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web

Required image tag:

web-controlled-deployment-2026-06-01

Required full image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

---

## 4) Mandatory Build Command For Next Step

The next step may execute only this class of command:

docker buildx build \
  --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01 \
  --push \
  .

This is required because local machine may be Mac Apple Silicon and production server is Linux AMD64.

---

## 5) Explicitly Not Approved

The following actions are not approved by this checkpoint:

- Server pull
- Web container replacement
- Web container stop
- Web container rename
- Web container remove
- Docker Compose action
- Docker prune
- Docker volume action
- Server cleanup
- Core image build
- Core image push
- Core deployment
- Core restart
- DB change
- DB restart
- Billing change
- companyId change
- Workflow change
- Nginx change
- Docker network change
- Production deployment execution

---

## 6) Required Evidence For Next Step

The next result document must record:

- Command executed
- Image name
- Image tag
- Build platform
- Build result
- Push result
- Whether Web Audit blocked push
- Confirmation no server pull occurred
- Confirmation no container action occurred
- Confirmation no Core action occurred
- Confirmation no DB/Billing/companyId/Workflow action occurred
- Next valid action

Expected result file:

docs/deployment/WEB_DOCKER_IMAGE_BUILD_PUSH_VALIDATION_RESULT_2026_06_01.md

---

## 7) Failure Rule

If Docker build or push fails:

STOP.

Do not retry blindly.

Do not reuse a failed image tag after functional or platform failure.

Do not pull anything on server.

Do not touch production runtime.

Create a failure evidence document before continuing.

---

## 8) Next Valid Action

The next valid action is:

EXECUTE WEB DOCKER IMAGE BUILD AND PUSH VALIDATION

Expected result file:

docs/deployment/WEB_DOCKER_IMAGE_BUILD_PUSH_VALIDATION_RESULT_2026_06_01.md

No server pull is approved yet.

No production deployment execution is approved yet.

---

## 9) Safety Confirmation

This document is documentation only.

No code change was made.

No build was executed by creating this document.

No Docker action was executed by creating this document.

No Docker image was built by creating this document.

No Docker image was pushed by creating this document.

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
