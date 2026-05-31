# HAWANA HSE — WEB LOCAL RUNTIME REFRESH APPROVAL
# موافقة تحديث Web Local Runtime لإزالة Runtime Source Drift

Document Type: Controlled Runtime Refresh Approval
Repository: hawana-hse-web-admin
Branch: phase4.3-web-hardening
Date Context: 2026-05-31
Status: APPROVAL CREATED — WEB LOCAL RUNTIME REFRESH ONLY
Mode: Stability First / Zero Risk / No Core Change /# 1) Purpose

This document approves a controlled local Web runtime refresh only.

The purpose is to align the running local Web container with the already committed Web source code after RBAC-04 UI visibility implementation.

This is not a new feature implementation.

This is not a Core change.

This is not a Production deployment.

---

## 2) Trigger

Manual browser observation showed that the UI still displayed old role-based action visibility behavior after the Web source fix had already been committed and pushed.

Read-only Docker inspection confirmed that the running Web container was stale.

The current local source contains the corrected RBAC-04 Web UI visibility implementation.

The running Web container still contains the previous compiled build.

---

## 3) Confirmed Root Cause

Root cause:

STALE WEB CONTAINER BUILD

The unchanged browser UI is caused by the running Web container not being rebuilt/refreshed after the Web source commit.

---

## 4) Approved Scope

Approved execution type:

WEB LOCAL RUNTIME REFRESH ONLY

Approved repository:

hawana-hse-web-admin

Approved environment:

Local runtime only

Approved target:

Web container only

Approved purpose:

Refresh the local Web runtime so browser observation reflects the committed Web source.

---

## 5) Architecture Boundary

Architecture must remain:

Web → API Proxy → Core

No direct UI → Core call is approved.

No API Proxy bypass is approved.

No backend contract change is approved.

No Core code change is approved.

---

## 6) Strict Restrictions

The following are NOT approved:

- Core rebuild
- Core restart
- Core code change
- Database query
- Database migration
- Docker volume deletion
- docker compose down -v
- Billing change
- companyId change
- Workflow change
- API contract change
- Production deployment
- Findings status change
- First real external pilot approval

---

## 7) Approved Runtime Action Type

Allowed:

- Rebuild local Web image/container only
- Restart local Web container only
- Verify Web container source/buntains the fixed RBAC-04 visibility logic
- Browser observation after refresh

Not allowed:

- Restart Core container
- Restart DB container
- Modify docker-compose architecture
- Change ports
- Change environment variables
- Change Nginx
- Change production server

---

## 8) Required Validation After Refresh

After Web local runtime refresh, validation must confirm:

1. Web container is recreated or refreshed.
2. Running container no longer contains stale dashboard quick action role list.
3. Viewer does not see mutation entry points.
4. Worker does not see Action Plan creation entry points.
5. OWNER / ADMIN / MANAGER operational UI remains visible as expected.
6. Web → API Proxy → Core remains intact.
7. No Core runtime change occurred.
8. No DB runtime change occurred.

---

## 9) Approval Decision

Web local runtime refresh approval:

CREATED

Approved execution type:

WEB LOCAL RUNTIME REFRESH ONLY

Approved target:

hawana-hse-web-admin local Web runtime

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
