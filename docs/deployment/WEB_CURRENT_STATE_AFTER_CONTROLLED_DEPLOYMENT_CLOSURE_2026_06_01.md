# HAWANA HSE — WEB CURRENT STATE AFTER CONTROLLED DEPLOYMENT CLOSURE
# حالة الويب الحالية بعد إغلاق النشر المنضبط

Document Type: Web Current State Anchor
Repository: hawana-hse-web-admin
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Date: 2026-06-01
Status: CURRENT WEB STATE LOCKED AFTER CONTROLLED DEPLOYMENT CLOSURE

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document is the current-state anchor for the Web Admin layer after the controlled Web deployment closure.

It must be read before any future Web deployment, Web cleanup, Web pilot readiness work, or Web chat handoff continuation.

This document does not replace historical evidence files.

It defines the current accepted Web state after the latest controlled deployment.

────────────────────────────────────────────
2) CURRENT GIT STATE
────────────────────────────────────────────

Repository:

hawana-hse-web-admin

Branch:

phase4.3-web-hardening

Current accepted commit:

4851bc7

Current accepted commit message:

docs: close web controlled deployment

Current accepted tag:

web-controlled-deployment-final-closure-2026-06-01

Remote alignment:

origin/phase4.3-web-hardening aligned at current accepted commit during final closure commit.

Working tree after final closure commit:

CLEAN

────────────────────────────────────────────
3) CURRENT WEB DEPLOYMENT STATE
────────────────────────────────────────────

Web controlled deployment:

CLOSED

Deployment result:

ACCEPTED

Production Web runtime:

STABLE

Active Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Active Web image id:

sha256:c9065201dca9abc28dcbe5739a3bd6fc530c32f3533b8b61cd1678d394cb26a5

Active Web container:

hawana-web

Active Web container status during validation:

Up

Public Web port mapping:

0.0.0.0:3005->3000/tcp

[::]:3005->3000/tcp

────────────────────────────────────────────
4) CURRENT CORE STATE OBSERVED DURING WEB DEPLOYMENT
────────────────────────────────────────────

Core container:

hawana-core

Core image observed during Web validation:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

Core status during Web validation:

Up

Core exposure model:

127.0.0.1:3001->3001/tcp

Core was not changed during Web deployment.

Core was not rebuilt during Web deployment.

Core was not restarted during Web deployment.

Core image remained unchanged.

────────────────────────────────────────────
5) CURRENT POSTGRES STATE OBSERVED DURING WEB DEPLOYMENT
────────────────────────────────────────────

PostgreSQL container:

hawana-postgres

PostgreSQL image:

postgres:16-alpine

PostgreSQL status during Web validation:

Up

PostgreSQL was not changed.

PostgreSQL was not restarted.

No DB migration was executed.

No DB data was changed.

No DB volume was deleted.

────────────────────────────────────────────
6) BACKUP AND ROLLBACK STATE
────────────────────────────────────────────

Previous Web container was preserved as backup.

Backup Web container name:

hawana-web-backup-before-controlled-deployment-2026-06-01

Backup Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-audit-governance-runtime-deployable-2026-05-24

Backup Web container status during validation:

Exited (0)

Backup deletion status:

NOT APPROVED

Backup cleanup status:

PENDING SEPARATE CONTROLLED CLEANUP PLAN IF NEEDED

Rollback state:

Rollback path remains available through preserved backup container and recorded previous image.

No backup deletion is approved by this document.

────────────────────────────────────────────
7) VALIDATION RESULTS
────────────────────────────────────────────

Local build validation:

PASSED

Web Docker image build and push validation:

PASSED

Server image pull validation:

PASSED

Controlled Web container replacement:

PASSED

Post-replacement functional validation:

PASSED

Authenticated functional validation:

PASSED

Public API health through Web/API Proxy:

PASSED

Login through Web API Proxy:

PASSED

Dashboard API through Web/API Proxy:

PASSED

Safety Reports API through Web/API Proxy:

PASSED

Action Plans API through Web/API Proxy:

PASSED

Users API through Web/API Proxy:

PASSED

Billing API through Web/API Proxy:

PASSED

Public login page:

PASSED

Unauthenticated dashboard redirect to login:

PASSED

No direct Core public access signal:

CONTROLLED

────────────────────────────────────────────
8) ARCHITECTURE STATE
────────────────────────────────────────────

Mandatory architecture:

Web → API Proxy → Core → PostgreSQL

Current architecture status:

PRESERVED

Web UI must continue using:

/api

Server-side Core access must continue using:

serverAppFetch

HttpOnly cookie flow:

PRESERVED

Backend source of truth:

PRESERVED

companyId authority:

JWT / Backend only

Billing authority:

Backend only

Workflow authority:

Backend only

Direct UI → Core access:

NOT APPROVED

Frontend companyId authority:

NOT APPROVED

Frontend Billing derivation:

NOT APPROVED

Frontend Workflow derivation:

NOT APPROVED

────────────────────────────────────────────
9) FILES CREATED DURING CONTROLLED WEB DEPLOYMENT CHAIN
────────────────────────────────────────────

The controlled Web deployment chain produced the following governance files:

1. docs/deployment/WEB_CURRENT_STATE_INSPECTION_AND_DEPLOYMENT_READINESS_PLAN_2026_06_01.md
2. docs/deployment/WEB_LOCAL_BUILD_APPROVAL_CHECKPOINT_2026_06_01.md
3. docs/deployment/WEB_LOCAL_BUILD_VALIDATION_RESULT_2026_06_01.md
4. docs/deployment/WEB_DOCKER_IMAGE_BUILD_APPROVAL_CHECKPOINT_2026_06_01.md
5. docs/deployment/WEB_DOCKER_IMAGE_BUILD_PUSH_VALIDATION_RESULT_2026_06_01.md
6. docs/deployment/WEB_SERVER_PULL_APPROVAL_CHECKPOINT_2026_06_01.md
7. docs/deployment/WEB_SERVER_PULL_VALIDATION_RESULT_2026_06_01.md
8. docs/deployment/WEB_CONTROLLED_CONTAINER_REPLACEMENT_APPROVAL_CHECKPOINT_2026_06_01.md
9. docs/deployment/WEB_CONTROLLED_CONTAINER_REPLACEMENT_RESULT_2026_06_01.md
10. docs/deployment/WEB_POST_REPLACEMENT_FUNCTIONAL_VALIDATION_APPROVAL_CHECKPOINT_2026_06_01.md
11. docs/deployment/WEB_POST_REPLACEMENT_FUNCTIONAL_VALIDATION_RESULT_2026_06_01.md
12. docs/deployment/WEB_AUTHENTICATED_FUNCTIONAL_VALIDATION_APPROVAL_CHECKPOINT_2026_06_01.md
13. docs/deployment/WEB_AUTHENTICATED_FUNCTIONAL_VALIDATION_RESULT_2026_06_01.md
14. docs/deployment/WEB_FINAL_DEPLOYMENT_CLOSURE_APPROVAL_CHECKPOINT_2026_06_01.md
15. docs/deployment/WEB_CONTROLLED_DEPLOYMENT_FINAL_CLOSURE_2026_06_01.md
16. docs/deployment/WEB_CURRENT_STATE_AFTER_CONTROLLED_DEPLOYMENT_CLOSURE_2026_06_01.md

────────────────────────────────────────────
10) CURRENT OPEN ITEMS
────────────────────────────────────────────

Backup Web container cleanup:

OPEN — NOT APPROVED

Web docs physical organization:

OPEN — NOT URGENT

Root docs cleanup:

OPEN — CLASSIFICATION FIRST ONLY

First real external pilot:

NOT APPROVED YET

Pilot execution:

NOT APPROVED

Production backup deletion:

NOT APPROVED

Any Docker prune:

NOT APPROVED

Any Docker volume deletion:

NOT APPROVED

Any Nginx change:

NOT APPROVED

Any Core change:

NOT APPROVED FROM WEB TRACK

────────────────────────────────────────────
11) NEXT VALID TRACKS
────────────────────────────────────────────

Valid next tracks after this current-state anchor:

1. Update Web README / CURRENT_STATUS / CHAT_HANDOFF_CONTEXT with this current-state anchor.
2. Create Web docs classification and organization plan.
3. Create controlled backup cleanup plan if backup container cleanup becomes necessary.
4. Continue pilot governance checklist without approving real external pilot yet.

The preferred immediate next action is:

UPDATE WEB DOCUMENTATION ENTRY POINTS WITH CURRENT STATE ANCHOR

No runtime action is required before that.

────────────────────────────────────────────
12) FORBIDDEN NEXT ACTIONS WITHOUT SEPARATE APPROVAL
────────────────────────────────────────────

The following are not approved:

- Delete backup Web container
- Delete Docker images
- Run Docker prune
- Delete Docker volumes
- Restart Core
- Restart PostgreSQL
- Modify DB
- Modify Billing
- Modify companyId logic
- Modify Workflow logic
- Change Nginx
- Change Docker network
- Start real external pilot
- Move docs files physically without classification plan

────────────────────────────────────────────
13) CURRENT ACCEPTANCE DECISION
────────────────────────────────────────────

Web controlled deployment acceptance:

ACCEPTED FOR CURRENT CONTROLLED WEB DEPLOYMENT SCOPE

Production Web runtime:

STABLE

Architecture:

PRESERVED

Rollback readiness:

AVAILABLE

Backup preserved:

YES

First real external pilot:

NOT APPROVED YET

────────────────────────────────────────────
14) SAFETY CONFIRMATION
────────────────────────────────────────────

This document is documentation only.

No server action was executed by creating this document.

No container action was executed by creating this document.

No Docker run was executed by creating this document.

No Docker rm was executed by creating this document.

No Docker Compose action was executed.

No backup deletion was executed.

No pilot execution was approved.

No Core change was made.

No DB change was made.

No Billing change was made.

No companyId change was made.

No Workflow change was made.

Was anything deleted by creating this Web current state anchor?

NO

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────
