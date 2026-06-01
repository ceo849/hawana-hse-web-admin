# HAWANA HSE — FIRST PILOT ROLLBACK PLAN AFTER WEB DEPLOYMENT CLOSURE
# خطة الرجوع الآمن قبل أول Pilot حقيقي بعد إغلاق نشر الويب

Document Type: Pilot Governance / Rollback Plan
Repository: hawana-hse-web-admin
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Status: ROLLBACK PLAN CREATED — FIRST REAL PILOT NOT APPROVED YET
Date: 2026-06-01

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document defines the rollback model required before any First Real Pilot approval.

The objective is to ensure that any pilot issue can be controlled without damaging:

- Web runtime
- Core runtime
- PostgreSQL
- Billing
- companyId isolation
- Workflow behavior
- Docker network
- Nginx routing
- Production data

This document does not approve pilot execution.

This document does not approve backup deletion.

This document does not approve any runtime action.

────────────────────────────────────────────
2) CURRENT LOCKED STATE
────────────────────────────────────────────

Current Web deployment state:

CLOSED AND ACCEPTED

Current Web state anchor:

docs/deployment/WEB_CURRENT_STATE_AFTER_CONTROLLED_DEPLOYMENT_CLOSURE_2026_06_01.md

Current active Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Current Web image id:

sha256:c9065201dca9abc28dcbe5739a3bd6fc530c32f3533b8b61cd1678d394cb26a5

Current Core image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

Backup Web container:

hawana-web-backup-before-controlled-deployment-2026-06-01

Backup Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-audit-governance-runtime-deployable-2026-05-24

First real pilot:

NOT APPROVED YET

────────────────────────────────────────────
3) ROLLBACK PRINCIPLES
────────────────────────────────────────────

Rollback must be:

- Controlled
- Evidence-based
- Minimal
- Reversible
- Web-only unless a separate plan explicitly approves otherwise
- Non-destructive
- Tenant-safe
- Architecture-safe

Rollback must preserve:

Web → API Proxy → Core → PostgreSQL

Rollback must not become debugging by random restart.

Rollback must not become infrastructure redesign.

Rollback must not touch Billing, companyId, or Workflow.

────────────────────────────────────────────
4) ROLLBACK TRIGGERS
────────────────────────────────────────────

Rollback may be considered only if one or more of the following occurs during approved pilot validation or approved pilot execution:

Critical trigger:

- Web login fails for approved pilot users
- Dashboard fails after login
- Safety Reports route fails for approved pilot users
- Action Plans route fails for approved pilot users
- API Proxy breaks
- Session persistence breaks
- Logout behavior breaks
- Web container enters restart loop
- Public Web becomes unavailable
- Web returns repeated 5xx errors
- User sees direct Core URL exposure
- Any evidence suggests UI bypasses /api
- Any evidence suggests frontend direct Core access
- Any evidence suggests companyId leakage or cross-tenant exposure

High trigger:

- Role visibility behavior becomes unsafe
- Viewer or Worker sees unauthorized UI action
- Admin or Owner cannot access required pilot pages
- Billing page behavior becomes unsafe or misleading
- Web logs show repeated runtime errors
- Web deployment image behaves differently from validated state

Medium trigger:

- Non-critical UI page fails but core pilot workflow remains usable
- Minor layout issue blocks pilot usability
- Non-critical route returns degraded response
- Metrics display mismatch without data integrity impact

Low trigger:

- Visual defect
- Text defect
- Minor responsive issue
- Non-blocking documentation mismatch

────────────────────────────────────────────
5) ROLLBACK DECISION RULE
────────────────────────────────────────────

Rollback is not automatic.

Rollback requires:

1. Evidence collection.
2. Severity classification.
3. Confirmation that issue is Web runtime related.
4. Confirmation that Core, DB, Billing, companyId, and Workflow are not the root cause unless separately investigated.
5. Approval checkpoint before any rollback action.
6. Rollback result documentation after execution.
7. Post-rollback validation.

If the issue is not Web runtime related:

STOP.

Create the correct separate plan.

────────────────────────────────────────────
6) APPROVED ROLLBACK SCOPE
────────────────────────────────────────────

Approved rollback scope for this plan:

Web container only.

Potential rollback target:

hawana-web-backup-before-controlled-deployment-2026-06-01

or previous Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-audit-governance-runtime-deployable-2026-05-24

Rollback must preserve:

- Same container name: hawana-web
- Same port mapping: 3005:3000
- Same Docker network
- Same approved production env
- Same Nginx routing
- Same API Proxy flow
- Same Core internal URL
- Same HttpOnly Cookie flow

Rollback must not change:

- hawana-core
- hawana-postgres
- PostgreSQL volumes
- Nginx
- Firewall
- Docker network
- Billing
- companyId
- Workflow
- Database records

────────────────────────────────────────────
7) FORBIDDEN ROLLBACK ACTIONS
────────────────────────────────────────────

The following are forbidden without separate approval:

- Restart Core
- Restart PostgreSQL
- Delete PostgreSQL data
- Delete Docker volumes
- Run docker system prune
- Run docker volume prune
- Delete backup Web container
- Delete active Web image
- Delete rollback image
- Change Nginx
- Change Firewall
- Change Docker network
- Modify environment variables without approval
- Hot patch files inside container
- Edit production files directly on server
- Rebuild image on server
- Change Billing logic
- Change companyId logic
- Change Workflow logic
- Execute Prisma migration
- Run seed scripts
- Start pilot while rollback is unresolved

────────────────────────────────────────────
8) ROLLBACK APPROVAL CHECKPOINT REQUIREMENTS
────────────────────────────────────────────

Before rollback execution, create a rollback approval checkpoint.

Required checkpoint file pattern:

docs/FIRST_PILOT_WEB_ROLLBACK_APPROVAL_CHECKPOINT_<YYYY_MM_DD>.md

The checkpoint must include:

- Incident summary
- Trigger classification
- Current active Web image
- Current Web container state
- Current Core image
- Current PostgreSQL state
- Backup Web container state
- Rollback target
- Rollback command plan
- What is approved
- What is not approved
- What must not be touched
- Evidence required after rollback
- Next valid action

No rollback command is approved until that checkpoint exists.

────────────────────────────────────────────
9) MINIMUM READ-ONLY EVIDENCE BEFORE ROLLBACK
────────────────────────────────────────────

Before rollback approval, collect read-only evidence:

Runtime:

- docker ps
- active Web image
- active Web image id
- Core image
- PostgreSQL status
- backup Web container status

Health:

- public /api/health
- Web logs safe tail
- dashboard unauthenticated redirect behavior
- login page status

Authenticated evidence if possible:

- login through Web API Proxy
- dashboard API
- safety reports API
- action plans API
- users API for approved role
- billing API read-only behavior

All evidence must avoid printing secrets.

Temporary cookie files must be removed after validation.

────────────────────────────────────────────
10) ROLLBACK EXECUTION MODEL
────────────────────────────────────────────

Rollback execution must be controlled.

Preferred pattern:

1. Confirm current hawana-web runtime state.
2. Confirm backup Web container exists.
3. Confirm rollback image exists locally or can be pulled safely.
4. Stop current hawana-web.
5. Rename current hawana-web to failed candidate backup name.
6. Start rollback Web container using approved runtime configuration.
7. Validate public health.
8. Validate login.
9. Validate authenticated routes.
10. Preserve failed candidate until closure unless cleanup is separately approved.
11. Document result.

Rollback must not use blind destructive deletion.

The command:

docker rm -f hawana-web

is not preferred unless:

- current image is recorded
- env backup exists
- rollback image is confirmed
- approval checkpoint explicitly allows it
- deletion impact is documented

────────────────────────────────────────────
11) POST-ROLLBACK VALIDATION
────────────────────────────────────────────

After rollback, validation must include:

- hawana-web is running
- active Web image is the approved rollback image
- hawana-core unchanged
- hawana-postgres unchanged
- /api/health returns 200
- login works
- dashboard works
- safety reports works
- action plans works
- users route behavior matches role
- billing route remains controlled
- session persistence works
- logout works
- no direct Core exposure
- Web → API Proxy → Core preserved

If validation fails:

STOP.

Do not improvise.

Create incident analysis plan.

────────────────────────────────────────────
12) PILOT IMPACT DECISION AFTER ROLLBACK
────────────────────────────────────────────

If rollback is executed before pilot start:

Pilot remains NOT APPROVED.

A new readiness review is required.

If rollback is executed during pilot:

Pilot must be paused.

Observation Register must record:

- Time of issue
- User affected
- Module affected
- Severity
- Immediate impact
- Whether data integrity was affected
- Whether rollback was required
- Current runtime state after rollback
- Next controlled action

Pilot restart requires separate approval.

────────────────────────────────────────────
13) BACKUP CONTAINER POLICY
────────────────────────────────────────────

The backup Web container must remain preserved until:

- Final pilot readiness is approved, or
- A controlled cleanup classification plan is created, committed, tagged, and explicitly approved for execution.

Current backup container:

hawana-web-backup-before-controlled-deployment-2026-06-01

Backup deletion is not approved by this document.

────────────────────────────────────────────
14) ROLLBACK READINESS DECISION
────────────────────────────────────────────

Rollback readiness status:

DEFINED

Rollback execution status:

NOT EXECUTED

Backup available:

YES

Pilot start approval:

NOT APPROVED

Runtime cleanup approval:

NOT APPROVED

Production acceptance:

CURRENT WEB DEPLOYMENT ACCEPTED

Pilot readiness:

INCOMPLETE

────────────────────────────────────────────
15) NEXT VALID ACTION
────────────────────────────────────────────

The next valid action after this rollback plan is one of:

Option A:

Commit and tag this rollback plan.

Option B:

Create First Pilot Tenant/User Scope Decision.

Option C:

Create First Pilot Observation Register Template.

Option D:

Create controlled backup container cleanup classification plan.

Recommended next action:

Commit and tag this rollback plan first.

Then create First Pilot Tenant/User Scope Decision.

────────────────────────────────────────────
16) SAFETY CONFIRMATION
────────────────────────────────────────────

This document is documentation only.

No server action was executed by creating this document.

No container action was executed by creating this document.

No Docker run was executed by creating this document.

No Docker rm was executed by creating this document.

No Docker Compose action was executed.

No backup deletion was executed.

No rollback was executed.

No pilot execution was approved.

No Core change was made.

No DB change was made.

No Billing change was made.

No companyId change was made.

No Workflow change was made.

No file was moved.

No file was renamed.

No file was deleted.

Was anything deleted by creating this First Pilot Rollback Plan?

NO

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────
