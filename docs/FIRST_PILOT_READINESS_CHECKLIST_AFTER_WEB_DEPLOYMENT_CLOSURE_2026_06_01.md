# HAWANA HSE — FIRST PILOT READINESS CHECKLIST AFTER WEB DEPLOYMENT CLOSURE
# قائمة جاهزية أول Pilot بعد إغلاق نشر الويب

Document Type: Pilot Governance Readiness Checklist
Repository: hawana-hse-web-admin
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Date: 2026-06-01
Status: CHECKLIST CREATED — FIRST REAL PILOT NOT APPROVED YET

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document defines the readiness checklist required before approving any first real pilot activity after the controlled Web deployment closure.

This checklist does not approve pilot execution.

This checklist does not approve production data changes.

This checklist does not approve user onboarding.

This checklist does not approve backup container deletion.

The purpose is to convert the current stable Web runtime into a controlled pilot-readiness decision.

────────────────────────────────────────────
2) CURRENT VERIFIED BASELINE
────────────────────────────────────────────

Current Web controlled deployment status:

CLOSED

Current Web state:

LOCKED AFTER CONTROLLED DEPLOYMENT CLOSURE

Current Web runtime:

STABLE

Current active Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Current Core image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

Current architecture:

Web → API Proxy → Core → PostgreSQL

Backup Web container:

PRESERVED

Backup deletion:

NOT APPROVED

First real pilot:

NOT APPROVED

────────────────────────────────────────────
3) NON-NEGOTIABLE PILOT GATES
────────────────────────────────────────────

The first real pilot must not start unless all gates below are explicitly reviewed.

Gate 1 — Architecture Gate

Required status:

PASSED

Validation requirements:

- Web uses /api only.
- Server-side Web access to Core remains through serverAppFetch.
- UI does not call Core directly.
- UI does not use :3001.
- CORE_API_BASE_URL remains server-side only.
- NEXT_PUBLIC_API_BASE_URL remains /api.
- Backend remains source of truth.

Current status:

PASSED

Gate 2 — Runtime Stability Gate

Required status:

PASSED

Validation requirements:

- hawana-web is running.
- hawana-core is running.
- hawana-postgres is running.
- No restart loop.
- Public /api/health returns 200.
- Login works through Web API Proxy.
- Authenticated dashboard request returns 200.
- Authenticated Safety Reports request returns 200.
- Authenticated Action Plans request returns 200.
- Authenticated Users request returns 200.
- Authenticated Billing request returns 200.

Current status:

PASSED

Gate 3 — Multi-Tenant Isolation Gate

Required status:

REVIEW REQUIRED BEFORE PILOT APPROVAL

Validation requirements:

- Pilot tenant must be explicitly selected or created through approved path.
- companyId must not be passed from UI as authority.
- companyId must remain JWT/backend-owned.
- No cross-tenant access evidence is acceptable.
- Test tenants must not be confused with real pilot tenant.
- Production tenant source-of-truth must be reviewed before any real pilot action.

Current status:

REVIEW REQUIRED

Gate 4 — Pilot Tenant Gate

Required status:

NOT READY

Validation requirements:

- Pilot company legal/display name must be approved.
- Pilot owner email must be approved.
- Pilot user list must be approved.
- Pilot role model must be approved.
- Pilot site/project name must be approved.
- Pilot modules must be approved.
- Pilot duration must be approved.
- Pilot support path must be approved.

Current status:

NOT READY

Gate 5 — RBAC Gate

Required status:

REVIEW REQUIRED BEFORE PILOT APPROVAL

Validation requirements:

- OWNER access verified.
- ADMIN access behavior known.
- MANAGER access behavior known.
- WORKER access behavior known.
- VIEWER access behavior known.
- Read-only users do not see unauthorized actions.
- Quick actions align with role permissions.
- API Proxy enforces authenticated access.
- UI visibility does not overpromise backend authority.

Current status:

PARTIALLY VERIFIED — REVIEW REQUIRED

Gate 6 — Billing Gate

Required status:

READ-ONLY REVIEW REQUIRED

Validation requirements:

- Billing remains backend-controlled.
- Billing UI remains read-only unless explicitly scoped.
- No Billing redesign.
- No Stripe change.
- No billing enforcement change.
- Trial / subscription status must be documented for pilot tenant.

Current status:

REVIEW REQUIRED

Gate 7 — Workflow Gate

Required status:

NO CHANGE REQUIRED

Validation requirements:

- Action Plan workflow remains backend source of truth.
- Safety Report status remains derived/persisted by backend.
- No frontend Workflow derivation.
- No manual frontend status authority.
- Verified/closed behavior must remain stable.

Current status:

PASSED FOR NO-CHANGE CONDITION

Gate 8 — Audit / Evidence Gate

Required status:

REVIEW REQUIRED BEFORE PILOT APPROVAL

Validation requirements:

- Pilot-critical actions must have evidence strategy.
- Findings register must remain active.
- Observations must be classified by severity.
- Pilot issues must be split into fix-before-pilot and defer-after-pilot.
- AuditLog coverage gaps must be understood.

Current status:

REVIEW REQUIRED

Gate 9 — Rollback Gate

Required status:

AVAILABLE

Validation requirements:

- Previous Web container preserved.
- Old Web image known.
- Current Web image known.
- Rollback path available.
- No backup deletion before controlled cleanup approval.
- Core rollback not part of Web pilot readiness.
- DB rollback not part of Web pilot readiness.

Current status:

PASSED

Gate 10 — Documentation Gate

Required status:

PASSED

Validation requirements:

- Web deployment final closure exists.
- Web current state anchor exists.
- Web docs classification plan exists.
- Pilot governance review plan exists.
- This readiness checklist exists.
- Future pilot execution must have separate approval.

Current status:

PASSED AFTER THIS DOCUMENT IS COMMITTED

────────────────────────────────────────────
4) CURRENT PILOT READINESS DECISION
────────────────────────────────────────────

First real pilot readiness:

NOT APPROVED YET

Reason:

The Web runtime is stable and deployment is closed, but the following are still required before approving first real pilot execution:

- Pilot tenant decision
- Pilot user list approval
- Pilot module scope approval
- Pilot RBAC review
- Pilot observation register
- Pilot rollback plan
- Pilot support path
- Pilot acceptance criteria
- Pilot start approval checkpoint

────────────────────────────────────────────
5) REQUIRED PILOT INPUTS
────────────────────────────────────────────

Before pilot approval, the following inputs must be defined:

1. Pilot company legal name
2. Pilot company display name
3. Pilot owner full name
4. Pilot owner email
5. Pilot allowed users
6. Pilot user roles
7. Initial site/project name
8. Pilot modules
9. Pilot duration
10. Pilot success criteria
11. Pilot support contact
12. Pilot rollback condition
13. Pilot issue reporting model
14. Billing/trial decision
15. Data retention decision after pilot

Current input status:

NOT COMPLETE

────────────────────────────────────────────
6) RECOMMENDED MINIMUM FIRST PILOT SCOPE
────────────────────────────────────────────

Recommended first real pilot scope:

- One company only
- One owner only
- Three to five users maximum
- One site/project only
- Safety Reports
- Action Plans
- Dashboard read-only
- Billing read-only
- No Stripe action
- No Core change
- No DB schema change
- No Workflow change
- No Platform Owner feature
- No document physical movement during pilot execution

────────────────────────────────────────────
7) PILOT BLOCKERS
────────────────────────────────────────────

Current blockers before first real pilot approval:

Blocker 1:

Pilot tenant is not approved.

Blocker 2:

Pilot user list is not approved.

Blocker 3:

Pilot readiness checklist is not yet committed and tagged.

Blocker 4:

Pilot rollback plan is not created yet.

Blocker 5:

Pilot risk register is not created yet.

Blocker 6:

Pilot start approval checkpoint is not created yet.

Blocker 7:

Backup Web container cleanup is not approved.

Note:

Backup cleanup is not required before pilot, but it must not be done casually.

────────────────────────────────────────────
8) ALLOWED NEXT ACTIONS
────────────────────────────────────────────

Allowed next actions after committing this checklist:

Option A:

Create First Pilot Risk Register.

Option B:

Create First Pilot Rollback Plan.

Option C:

Create First Pilot Tenant/User Scope Decision.

Option D:

Create controlled backup container cleanup classification plan.

Option E:

Create First Pilot Start Approval Checkpoint only after all required pilot documents are complete.

Recommended next action:

Create First Pilot Risk Register.

────────────────────────────────────────────
9) FORBIDDEN ACTIONS
────────────────────────────────────────────

The following actions are not approved:

- Start real pilot
- Add real external users
- Delete backup Web container
- Delete Docker images
- Run Docker prune
- Modify Core
- Modify DB
- Modify Billing
- Modify companyId logic
- Modify Workflow
- Change Nginx
- Change Docker network
- Move documentation files physically
- Create Platform Owner runtime behavior
- Execute unplanned production commands

────────────────────────────────────────────
10) SAFETY CONFIRMATION
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

No file was moved.

No file was renamed.

No file was deleted.

Was anything deleted by creating this First Pilot Readiness Checklist?

NO

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────
