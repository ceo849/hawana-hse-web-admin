# HAWANA HSE — FIRST PILOT GOVERNANCE REVIEW PLAN AFTER WEB DEPLOYMENT CLOSURE
# خطة مراجعة حوكمة أول Pilot بعد إغلاق نشر الويب

Document Type: Pilot Governance Review Plan
Repository: hawana-hse-web-admin
Layer: Web Admin + Pilot Governance
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Status: PLAN CREATED — PILOT NOT APPROVED YET
Date: 2026-06-01

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document defines the controlled governance review required before any first real pilot execution.

The Web controlled deployment is closed.

The Web current state is locked.

The Web documentation classification plan is created and committed.

However, first real pilot execution is still not approved.

This plan does not approve pilot execution.

This plan only defines what must be reviewed before a pilot approval decision.

────────────────────────────────────────────
2) CURRENT CONFIRMED STATE
────────────────────────────────────────────

Latest Web current state anchor:

docs/deployment/WEB_CURRENT_STATE_AFTER_CONTROLLED_DEPLOYMENT_CLOSURE_2026_06_01.md

Latest Web controlled deployment final closure:

docs/deployment/WEB_CONTROLLED_DEPLOYMENT_FINAL_CLOSURE_2026_06_01.md

Latest Web docs classification plan:

docs/WEB_DOCUMENTATION_CLASSIFICATION_AND_ORGANIZATION_PLAN_2026_06_01.md

Current Web deployment state:

CLOSED

Current Web runtime state:

STABLE

Current architecture:

Web → API Proxy → Core → PostgreSQL

Current Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Current Core image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

Backup Web container:

hawana-web-backup-before-controlled-deployment-2026-06-01

Backup status:

PRESERVED

Backup deletion:

NOT APPROVED

First real pilot:

NOT APPROVED

────────────────────────────────────────────
3) PILOT GOVERNANCE REVIEW SCOPE
────────────────────────────────────────────

This review must verify:

- Web controlled deployment closure
- Web current-state anchor
- Core current-state anchor
- API Proxy path preservation
- Authenticated Web validation
- Role access behavior
- Dashboard read-only integrity
- Safety Reports readiness
- Action Plans readiness
- Users route behavior
- Billing read-only behavior
- Audit/logging readiness
- Backup and rollback status
- Known blockers
- Known deferred items
- First pilot tenant decision
- First pilot user scope
- Support and rollback path

────────────────────────────────────────────
4) NON-NEGOTIABLE RULES
────────────────────────────────────────────

The pilot review must not:

- Start real pilot usage
- Delete backup Web container
- Delete Docker images
- Run Docker prune
- Move docs files
- Modify Web code
- Modify Core code
- Modify DB
- Modify Billing
- Modify companyId logic
- Modify Workflow logic
- Change Nginx
- Change Docker network
- Restart Core
- Restart PostgreSQL

Any required action from the forbidden list must be handled through a separate controlled plan.

────────────────────────────────────────────
5) REQUIRED PILOT READINESS QUESTIONS
────────────────────────────────────────────

Before approving first real pilot, answer:

1. Is Core current state locked?

2. Is Web current state locked?

3. Is Web deployment closure accepted?

4. Is Web → API Proxy → Core preserved?

5. Is authenticated validation passed?

6. Is multi-tenant isolation still enforced by backend/JWT?

7. Is companyId never accepted from UI as authority?

8. Is Workflow still backend-owned?

9. Is Billing untouched and read-only for pilot?

10. Is backup Web container preserved?

11. Is rollback available?

12. Are known blockers documented?

13. Are deferred items documented?

14. Is the first pilot tenant selected or still pending?

15. Is first pilot scope minimal?

16. Is external pilot execution explicitly approved?

If any answer is unclear:

STOP.

Create evidence or a controlled review document.

────────────────────────────────────────────
6) RECOMMENDED FIRST PILOT SCOPE
────────────────────────────────────────────

The recommended first pilot scope remains controlled and minimal:

- One pilot company only
- One OWNER account
- Limited additional users
- One site/project
- Safety Reports
- Action Plans
- Dashboard read-only
- Users read-only/admin-controlled as applicable
- Billing read-only / trial state only

Not recommended for first pilot:

- Broad external rollout
- Multiple real companies
- Billing monetization enforcement test
- Workflow redesign
- Large user onboarding
- Production data migration
- Physical docs reorganization during pilot start

────────────────────────────────────────────
7) REQUIRED EVIDENCE BEFORE PILOT APPROVAL
────────────────────────────────────────────

Required evidence documents:

- Core current state after controlled deployment closure
- Web current state after controlled deployment closure
- Web authenticated functional validation result
- Web controlled deployment final closure
- Web docs classification plan
- First pilot readiness checklist
- First pilot risk register
- First pilot rollback plan
- First pilot acceptance criteria

If any required evidence is missing:

Pilot remains NOT APPROVED.

────────────────────────────────────────────
8) PILOT APPROVAL STATUS
────────────────────────────────────────────

Current pilot status:

NOT APPROVED

Reason:

This document is only a governance review plan.

It does not authorize external user onboarding.

It does not authorize real pilot execution.

It does not authorize backup deletion.

It does not authorize runtime changes.

────────────────────────────────────────────
9) NEXT VALID ACTION
────────────────────────────────────────────

The next valid action is:

COMMIT AND TAG THIS PILOT GOVERNANCE REVIEW PLAN

After that, the next controlled options are:

Option A:

Create First Pilot Readiness Checklist.

Option B:

Create First Pilot Risk Register.

Option C:

Create First Pilot Rollback Plan.

Option D:

Create controlled backup container cleanup classification plan.

Recommended next action after commit:

Create First Pilot Readiness Checklist.

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

Was anything deleted by creating this pilot governance review plan?

NO

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────
