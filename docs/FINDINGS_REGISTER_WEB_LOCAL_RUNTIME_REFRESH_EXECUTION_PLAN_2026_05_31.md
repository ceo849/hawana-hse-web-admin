# HAWANA HSE — WEB LOCAL RUNTIME REFRESH EXECUTION PLAN
# خطة تنفيذ تحديث Runtime المحلي للـ Web فقط

Document Type: Controlled Runtime Execution Plan
Repository: hawana-hse-web-admin
Date: 2026-05-31
Status: PLAN CREATED — EXECUTION NOT STARTED
Mode: Stability First / Web Only / Zero Core Touch / No Compose / No DB Touch

---

## 1) Purpose

This document defines  to refresh the local Web runtime only.

The objective is to make the running hawana-web container reflect the already committed Web source fix for RBAC-04 UI visibility.

Root cause already classified:

STALE WEB CONTAINER BUILD

---

## 2) Confirmed Source State

Current Web commit:

9a4a577 docs: approve web local runtime refresh

Current approval tag:

findings-register-web-local-runtime-refresh-approval-2026-05-31

Previous implementation commit:

a69446e fix: align web ui visibility with rbac policy

Implementation tag:

web-ui-visibility-rbac04-fix-implementation-2026-05-31

---

## 3) Confirmed Runtime Drift

Running container:

hawana-web

Current runtime image digest:

sha256:6416ff4fcfb45ed71966c1f9bbe78fcf70c733790ef33b56d4e335ae9adaaa9b

Current runtime created date:

2026-05-24T01:17:34.115125791Z

Conclusion:

Running Web container is stale and does not reflect the latest Web source.

---

## 4) Runtime Configuration To Preserve

Container name:

hawana-web

Port mapping:

3005:3000

Network:

hawana-hse-core_default

Restart policy:

unless-stopped

Environment variables:

- NODE_ENV=production
- NEXT_PUBLIC_API_BASE_URL=/api
- NEXT_PUBLIC_API_PREFIX=/v1
- CORE_API_BASE_URL=http://hawana-core:3001
- DOCKER_ENV=true

Mounts:

none

Architecture:

Web → API Proxy → Core

---

## 5) Forbidden Actions

The following actions are not approved:

- docker compose up
- docker compose down
- Core rebuild
- Core restart
- DB restart
- DB query
- DB migration
- Billing change
- companyId change
- Workflow change
- API contract change
- Production deployment

---

## 6) Approved Execution Strategy

Use Web-only image build.

Use a versioned image tag first:

hawana-hse-web-admin:rbac04-runtime-refresh-2026-05-31

Do not overwrite Core.

Do not rebuild Core.

Do not use docker compose.

Recreate only hawana-web container using the same known runtime configuration.

---

## 7) Rollback Strategy

Before replacing the Web container, preserve the current Web image digest reference:

sha256:6416ff4fcfb45ed711f9bbe78fcf70c733790ef33b56d4e335ae9adaaa9b

If the refreshed Web container fails, recreate hawana-web using the previous image digest and the same runtime configuration.

Rollback scope:

Web container only.

Core rollback:

Not applicable.

DB rollback:

Not applicable.

---

## 8) Validation After Refresh

Required validation after refresh:

1. hawana-web container running.
2. Port 3005 listening.
3. Container env preserved.
4. Container network remains hawana-hse-core_default.
5. Dashboard compiled runtime no longer contains VIEWER in "+ Action Plan (from Report)".
6. Dashboard source inside container shows corrected roles.
7. Browser observation for VIEWER confirms hidden unauthorized UI actions.
8. Web → API Proxy → Core remains intact.

---

## 9) Execution Approval Boundary

Approved:

WEB LOCAL RUNTIME REFRESH ONLY

Not approved:

Core rebuild

Not approved:

Core restart

Not approved:

Database changes

Not approved:

Billing changes

Not approved:

companyId changes

Not approved:

Workflow changes

Not approved:

Production deployment

First real external pilot:

NOT APPROVED YET

Was anything deleted?

NO
