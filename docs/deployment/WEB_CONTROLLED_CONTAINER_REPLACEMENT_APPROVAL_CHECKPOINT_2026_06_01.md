# HAWANA HSE — WEB CONTROLLED CONTAINER REPLACEMENT APPROVAL CHECKPOINT

Document Type: Production Web Container Replacement Approval
Repository: hawana-hse-web-admin
Path: docs/deployment/WEB_CONTROLLED_CONTAINER_REPLACEMENT_APPROVAL_CHECKPOINT_2026_06_01.md
Date: 2026-06-01
Layer: Web Admin Production Runtime
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Controlled Replacement / Rollback Ready / No Core Change
Status: APPROVAL CREATED — CONTROLLED WEB CONTAINER REPLACEMENT ONLY APPROVED FOR NEXT STEP

---

## 1) Purpose

This checkpoint approves the next production server action only:

CONTROLLED WEB CONTAINER REPLACEMENT

This checkpoint does not execute the replacement.

This checkpoint does not approve any Core action.

This checkpoint does not approve any PostgreSQL action.

This checkpoint does not approve any Billing, companyId, or Workflow change.

This checkpoint exists to ensure the Web container replacement is controlled, reversible, and zero-risk aligned.

---

## 2) Previous Evidence

Previous completed step:

docs/deployment/WEB_SERVER_PULL_VALIDATION_RESULT_2026_06_01.md

Previous result:

WEB SERVER IMAGE PULL VALIDATION PASSED

Pulled Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Pulled image platform:

linux/amd64

Pulled image id:

sha256:c9065201dca9abc28dcbe5739a3bd6fc530c32f3533b8b61cd1678d394cb26a5

Current active Web image before replacement:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-audit-governance-runtime-deployable-2026-05-24

Current active Core image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

---

## 3) Approved Scope

Approved next action:

CONTROLLED WEB CONTAINER REPLACEMENT ONLY

Allowed actions in the next server step:

1. Record runtime baseline.
2. Record active Web image.
3. Record active Core image.
4. Record active PostgreSQL status.
5. Record Web runtime config.
6. Save current Web env to restricted server file without printing secrets.
7. Stop hawana-web.
8. Rename old hawana-web to backup container name.
9. Start new hawana-web with the approved image.
10. Use same network.
11. Use same port mapping.
12. Use approved production env values.
13. Verify new Web container is running.
14. Verify Core remains unchanged.
15. Verify PostgreSQL remains unchanged.
16. Verify no Docker Compose action was used.
17. Verify no volume action was used.

Approved new Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Backup container name:

hawana-web-backup-before-controlled-deployment-2026-06-01

---

## 4) Explicitly Not Approved

The following actions are not approved:

- Recreate hawana-core
- Stop hawana-core
- Restart hawana-core
- Recreate hawana-postgres
- Stop hawana-postgres
- Restart hawana-postgres
- Docker Compose action
- Docker network change
- Docker volume deletion
- Docker prune
- Nginx change
- Firewall change
- Database change
- Prisma migration
- Billing change
- companyId change
- Workflow change
- Runtime hot patching inside container
- Editing files on production server
- Creating official docs on production server
- Printing secrets
- Deleting old Web container before backup preservation

---

## 5) Required Replacement Strategy

The replacement must follow this controlled pattern:

1. Preserve the current Web container by rename, not immediate deletion.
2. Use the new image only after current runtime config is recorded.
3. Use the same network:
   hawanaglobal_default
4. Use the same port mapping:
   3005:3000
5. Preserve API Proxy architecture:
   NEXT_PUBLIC_API_BASE_URL=/api
6. Preserve Core internal server-side route:
   CORE_API_BASE_URL=http://hawana-core:3001
7. Keep Core unmodified.
8. Keep PostgreSQL unmodified.
9. Keep rollback immediately available.

Direct removal by:

sudo docker rm -f hawana-web

is not approved as the primary path in this step.

The approved method is stop and rename first.

---

## 6) Required Rollback Path

Rollback must be possible immediately.

Rollback source:

hawana-web-backup-before-controlled-deployment-2026-06-01

Rollback must restore the old Web container if the new Web container fails validation.

Rollback must not touch:

- Core
- PostgreSQL
- Billing
- companyId
- Workflow
- Docker volumes
- Docker network
- Nginx

If rollback is required, it must be documented in the replacement result file.

---

## 7) Required Server Commands For Next Step

The next server step may execute only the approved replacement command set.

The command set must include:

- Runtime baseline before replacement
- Web env backup without printing secrets
- Stop old Web container
- Rename old Web container
- Run new Web container
- Verify running containers
- Verify active Web image
- Verify Core image unchanged
- Verify PostgreSQL still running
- Verify logs tail

No placeholder command may be executed.

No malformed pasted command may be executed.

If command paste is corrupted:

STOP.

Run read-only safety check before continuing.

---

## 8) Expected Result File

After the controlled replacement step, the result must be documented locally in:

docs/deployment/WEB_CONTROLLED_CONTAINER_REPLACEMENT_RESULT_2026_06_01.md

The result file must include:

- Replacement result
- Old Web image
- New Web image
- Backup container name
- Runtime status
- Logs summary
- Core untouched confirmation
- PostgreSQL untouched confirmation
- DB untouched confirmation
- Billing untouched confirmation
- companyId untouched confirmation
- Workflow untouched confirmation
- Rollback status
- Next valid action

---

## 9) Approval Decision

Approval decision:

APPROVED FOR CONTROLLED WEB CONTAINER REPLACEMENT ONLY

Not approved:

- Final deployment acceptance
- Authenticated functional validation
- Pilot execution
- Runtime cleanup
- Backup deletion
- Core deployment
- DB action
- Nginx action

---

## 10) Next Valid Action

The next valid action is:

EXECUTE CONTROLLED WEB CONTAINER REPLACEMENT ON SERVER

Expected result file:

docs/deployment/WEB_CONTROLLED_CONTAINER_REPLACEMENT_RESULT_2026_06_01.md

No final deployment closure is approved yet.

No backup deletion is approved yet.

No pilot execution is approved yet.

---

## 11) Safety Confirmation

This document is documentation only.

No server action was executed by creating this document.

No container action was executed by creating this document.

No Docker run was executed by creating this document.

No Docker rm was executed by creating this document.

No Docker Compose action was executed.

No Core change was made.

No DB change was made.

No Billing change was made.

No companyId change was made.

No Workflow change was made.

No production deployment execution was performed.

Was anything deleted by creating this approval checkpoint?

NO

---

END OF DOCUMENT
