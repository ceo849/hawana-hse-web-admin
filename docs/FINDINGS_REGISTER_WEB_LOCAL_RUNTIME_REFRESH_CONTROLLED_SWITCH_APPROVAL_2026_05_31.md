# HAWANA HSE — WEB LOCAL RUNTIME REFRESH CONTROLLED SWITCH APPROVAL
# موافقة التحويل المحلي المنضبط إلى Web Runtime المحدث

Document Type: Controlled Runtime Approval
Project: Hawana HSE Web Admin
Repository: hawana-hse-web-admin
Date: 2026-05-31
Status: APPROVAL CREATED — SWITCH NOT STARTED

─────────────────────────────────────
## 1) Purpose
─────────────────────────────────────

This document approves only the controlled local switch from the stale Web container on port 3005 to the validated refreshed Web runtime candidate.

The purpose is to complete the local runtime refresh safely after browser validation confirmed that Candidate V2 correctly reflects:

- Dashboard Quick Actions RBAC visibility.
- VIEWER read-only UI behavior.
- Mobile FAB hidden when no quick actions are allowed.
- Web → API Proxy → Core architecture remains intact.

This approval does not approve production deployment.

─────────────────────────────────────
## 2) Evidence Baseline
─────────────────────────────────────

Evidence already completed:

1. Web runtime source drift classification.
2. Web local runtime refresh approval.
3. Web local runtime refresh execution plan.
4. Web runtime pre-refresh evidence.
5. Phase A candidate evidence.
6. Mobile FAB empty actions visibility fix.
7. Phase B Candidate V2 browser evidence.

Candidate V2 browser observation:

PASSED

VIEWER UI visibility:

PASSED

Mobile FAB empty actions fix:

PASSED

Dashboard Quick Actions RBAC fix:

PASSED

Read-only UI boundary:

PASSED

Candidate V2 readiness for controlled local switch:

READY FOR APPROVAL

─────────────────────────────────────
## 3) Approved Scope
─────────────────────────────────────

Approved execution type:

WEB LOCAL RUNTIME SWITCH ONLY

Approved local source runtime:

hawana-hse-web-admin

Approved source branch:

phase4.3-web-hardening

Approved current source HEAD:

ccd7976

Approved validated candidate:

hawana-web-candidate-rbac04-v2-2026-05-31

Approved candidate port:

3007

Approved target runtime port after switch:

3005

Approved runtime action:

Replace stale local Web runtime with validated refreshed Web runtime.

The switch must preserve the same runtime contract:

- Container name: hawana-web
- Host port: 3005
- Container port: 3000
- Network: hawana-hse-core_default
- CORE_API_BASE_URL: http://hawana-core:3001
- NEXT_PUBLIC_API_BASE_URL: /api
- NEXT_PUBLIC_API_PREFIX: /v1
- NODE_ENV: production
- DOCKER_ENV: true
- Restart policy: unless-stopped

─────────────────────────────────────
## 4) Explicitly Not Approved
─────────────────────────────────────

Core rebuild:

NOT APPROVED

Core restart:

NOT APPROVED

Database changes:

NOT APPROVED

Billing changes:

NOT APPROVED

companyId changes:

NOT APPROVED

Workflow changes:

NOT APPROVED

API contract changes:

NOT APPROVED

Production deployment:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

Docker compose down:

NOT APPROVED

Docker compose up:

NOT APPROVED

Volume deletion:

NOT APPROVED

Database reset:

NOT APPROVED

Seed execution:

NOT APPROVED

─────────────────────────────────────
## 5) Controlled Switch Method
─────────────────────────────────────

The controlled switch must use the validated Candidate V2 image/runtime only.

The switch must not use docker compose.

The switch must not rebuild Core.

The switch must not restart Core.

The switch must not touch PostgreSQL.

The switch must preserve Web → API Proxy → Core.

Allowed runtime action sequence:

1. Verify current Web container state.
2. Verify Candidate V2 is still running and healthy.
3. Stop stale local Web container only.
4. Rename or replace runtime target safely.
5. Run validated refreshed Web runtime as hawana-web on port 3005.
6. Confirm Core remains running and unchanged.
7. Confirm DB remains running and unchanged.
8. Confirm /login responds on port 3005.
9. Confirm /dashboard redirects unauthenticated requests to login.
10. Perform browser observation with VIEWER account.

Rollback boundary:

If refreshed Web runtime fails, restore the previous stale Web runtime only.

Rollback must not touch Core.

Rollback must not touch DB.

Rollback must not use docker compose down.

─────────────────────────────────────
## 6) Architecture Boundary
─────────────────────────────────────

Required architecture:

Web → API Proxy → Core

Architecture status:

PRESERVED

Direct UI to Core calls:

NOT APPROVED

Direct browser to Core calls:

NOT APPROVED

Backend source of truth:

UNCHANGED

serverAppFetch boundary:

UNCHANGED

API Proxy boundary:

UNCHANGED

Core runtime:

UNCHANGED

Database runtime:

UNCHANGED

─────────────────────────────────────
## 7) Runtime Safety Conditions
─────────────────────────────────────

Before switch:

- Current Web container must be identified.
- Candidate V2 container must be identified.
- Current Core container must remain running.
- Current DB container must remain running.
- No uncommitted code changes should exist except this approval document until committed.
- Candidate V2 must already have passed browser observation.

During switch:

- Do not execute docker compose.
- Do not rebuild Core.
- Do not restart Core.
- Do not query or mutate DB.
- Do not modify environment variables.
- Do not modify docker-compose.yml.
- Do not modify Dockerfile.
- Do not change API routes.
- Do not change Billing.
- Do not change companyId.
- Do not change Workflow.

After switch:

- Confirm Web port 3005 is served by refreshed runtime.
- Confirm stale dashboard Quick Actions behavior is gone.
- Confirm VIEWER cannot see unauthorized quick actions.
- Confirm VIEWER does not see mobile FAB when no quick actions are allowed.
- Confirm browser login/logout remains stable.
- Confirm Core and DB were not restarted.

─────────────────────────────────────
## 8) Required Evidence After Switch
─────────────────────────────────────

The switch result must be documented in a separate evidence file.

Required evidence:

1. Pre-switch docker ps.
2. Candidate V2 identity.
3. Current stale Web identity before switch.
4. Switch command output.
5. Post-switch docker ps.
6. Web container inspect after switch.
7. curl -I http://localhost:3005/login.
8. curl -I http://localhost:3005/dashboard.
9. Browser observation result with VIEWER account.
10. Confirmation that Core was not rebuilt.
11. Confirmation that Core was not restarted.
12. Confirmation that DB was not touched.
13. Confirmation that production deployment was not performed.

Evidence file must be docs-only and committed after review.

─────────────────────────────────────
## 9) Approval Decision
─────────────────────────────────────

Controlled local Web runtime switch:

APPROVED

Approved execution type:

WEB LOCAL RUNTIME SWITCH ONLY

Approved target:

hawana-hse-web-admin local Web runtime

Approved validated candidate:

hawana-web-candidate-rbac04-v2-2026-05-31

Approved source port:

3007

Approved final port:

3005

Core rebuild:

NOT APPROVED

Core restart:

NOT APPROVED

Database changes:

NOT APPROVED

Billing changes:

NOT APPROVED

companyId changes:

NOT APPROVED

Workflow changes:

NOT APPROVED

API contract changes:

NOT APPROVED

Production deployment:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

Was anything deleted?

NO
