# HAWANA HSE — FIRST PILOT RISK REGISTER AFTER WEB DEPLOYMENT CLOSURE
# سجل مخاطر أول Pilot بعد إغلاق نشر الويب

Document Type: Pilot Governance Risk Register
Repository: hawana-hse-web-admin
Layer: Web Admin / First Pilot Governance
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Status: RISK REGISTER CREATED — FIRST REAL PILOT NOT APPROVED YET
Date: 2026-06-01

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document defines the controlled risk register for the first real pilot preparation after Web controlled deployment closure.

The purpose is to identify, classify, and control pilot risks before any real external pilot execution.

This document does not approve pilot execution.

This document does not approve adding real external users.

This document does not approve backup deletion.

This document does not approve production runtime changes.

────────────────────────────────────────────
2) CURRENT GOVERNED BASELINE
────────────────────────────────────────────

Current Web state:

LOCKED AFTER CONTROLLED DEPLOYMENT CLOSURE

Current Web runtime:

STABLE

Current Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Current architecture:

Web → API Proxy → Core → PostgreSQL

Current Core image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

Current pilot status:

NOT APPROVED YET

Current backup Web container:

PRESERVED

Backup deletion:

NOT APPROVED

────────────────────────────────────────────
3) RISK CLASSIFICATION SCALE
────────────────────────────────────────────

Severity levels:

CRITICAL:
Could break tenant isolation, authentication, production runtime, Core stability, DB integrity, Billing governance, or Workflow correctness.

HIGH:
Could block pilot execution, create incorrect user access, expose wrong UI behavior, or create operational confusion during pilot.

MEDIUM:
Could affect pilot usability, support load, documentation clarity, or validation quality without breaking architecture.

LOW:
Documentation, UX, or observation risks that do not block pilot if controlled.

Risk status values:

OPEN
CONTROLLED
DEFERRED
CLOSED
NOT APPROVED

────────────────────────────────────────────
4) FIRST PILOT RISK REGISTER
────────────────────────────────────────────

RISK-001 — Real Pilot Started Before Final Governance Approval

Severity:

CRITICAL

Risk:

A real external pilot may start before all pilot governance documents are complete.

Impact:

- Uncontrolled production usage
- Missing rollback path
- Missing support path
- Missing observation register
- Potential uncontrolled user onboarding

Current control:

First real pilot is explicitly NOT APPROVED YET.

Required mitigation:

Create First Pilot Start Approval Checkpoint only after all required pilot documents are complete.

Status:

OPEN

────────────────────────────────────────────

RISK-002 — Tenant Scope Not Locked Before Pilot

Severity:

CRITICAL

Risk:

Pilot may use an unclear tenant, legacy test tenant, or uncontrolled tenant.

Impact:

- Incorrect operational evidence
- Confusion between test data and pilot data
- Potential tenant governance drift

Current control:

Pilot tenant/user scope decision is not yet approved.

Required mitigation:

Create First Pilot Tenant/User Scope Decision before any external pilot start.

Status:

OPEN

────────────────────────────────────────────

RISK-003 — companyId Authority Drift

Severity:

CRITICAL

Risk:

Any pilot preparation could accidentally introduce companyId from UI, request body, or manual assumption.

Impact:

- Tenant isolation violation
- Cross-tenant exposure risk
- Architecture breach

Current control:

companyId remains backend/JWT-owned.

Required mitigation:

No pilot work may pass companyId from UI as authority.

Status:

CONTROLLED

────────────────────────────────────────────

RISK-004 — Web Architecture Bypass

Severity:

CRITICAL

Risk:

Any pilot fix or validation may bypass /api and call Core directly.

Impact:

- Breaks Web → API Proxy → Core
- Weakens session and HttpOnly cookie model
- Creates architecture drift

Current control:

Web audit passed and API Proxy flow is preserved.

Required mitigation:

All pilot validation must use Web/API Proxy only.

Status:

CONTROLLED

────────────────────────────────────────────

RISK-005 — Billing Behavior Misinterpreted During Pilot

Severity:

HIGH

Risk:

Pilot users may see or trigger Billing behavior that is not intended for first pilot scope.

Impact:

- Commercial confusion
- Support burden
- Incorrect acceptance criteria

Current control:

Billing must remain backend-controlled and unchanged.

Required mitigation:

Pilot scope must explicitly define Billing visibility and allowed behavior.

Status:

OPEN

────────────────────────────────────────────

RISK-006 — Workflow Behavior Changed During Pilot Preparation

Severity:

CRITICAL

Risk:

Pilot preparation could unintentionally alter Safety Report or Action Plan Workflow behavior.

Impact:

- Incorrect HSE lifecycle
- Invalid operational evidence
- Broken source-of-truth model

Current control:

Workflow remains backend-controlled.

Required mitigation:

No Workflow change is allowed under Web or Pilot governance work without separate controlled Core plan.

Status:

CONTROLLED

────────────────────────────────────────────

RISK-007 — Backup Web Container Deleted Too Early

Severity:

HIGH

Risk:

The preserved backup Web container may be deleted before a controlled cleanup decision.

Impact:

- Reduced rollback confidence
- Loss of quick recovery path
- Governance breach

Current control:

Backup deletion is NOT APPROVED.

Required mitigation:

Create controlled backup container cleanup classification plan before any cleanup.

Status:

OPEN

────────────────────────────────────────────

RISK-008 — Pilot Users Added Without Access Matrix

Severity:

HIGH

Risk:

Users may be added without locked role, module, and permission expectations.

Impact:

- Wrong access during pilot
- RBAC confusion
- Support escalation

Current control:

Additional role users have previous read-only evidence, but first real pilot users are not approved.

Required mitigation:

Create First Pilot Tenant/User Scope Decision and Role Access Matrix.

Status:

OPEN

────────────────────────────────────────────

RISK-009 — Observation Register Missing During Pilot

Severity:

HIGH

Risk:

Pilot observations may be captured informally or lost.

Impact:

- Weak pilot evidence
- Poor defect classification
- Uncontrolled fixes

Current control:

Pilot observations must be recorded professionally.

Required mitigation:

Create First Pilot Observation Register Template before pilot start.

Status:

OPEN

────────────────────────────────────────────

RISK-010 — No Pilot Rollback Plan

Severity:

CRITICAL

Risk:

Pilot may start without a rollback and stop/hold strategy.

Impact:

- No controlled response to production issue
- Risk to stability
- Poor incident handling

Current control:

No pilot execution is approved yet.

Required mitigation:

Create First Pilot Rollback Plan before any start approval.

Status:

OPEN

────────────────────────────────────────────

RISK-011 — Documentation Organization Attempted Too Early

Severity:

MEDIUM

Risk:

Docs may be physically moved before controlled organization execution plan.

Impact:

- Broken references
- Lost traceability
- Handoff confusion

Current control:

Docs classification plan says no file movement approved.

Required mitigation:

Do not move files without Web docs physical organization execution plan.

Status:

CONTROLLED

────────────────────────────────────────────

RISK-012 — Production Commands Executed During Pilot Planning

Severity:

HIGH

Risk:

Server, Docker, or runtime commands may be executed while only documentation planning is approved.

Impact:

- Runtime drift
- Accidental service impact
- Governance breach

Current control:

Current pilot planning is documentation only.

Required mitigation:

Every server action requires explicit checkpoint and evidence.

Status:

CONTROLLED

────────────────────────────────────────────

RISK-013 — Platform Owner Scope Introduced Prematurely

Severity:

HIGH

Risk:

Platform Owner runtime behavior may be introduced during first pilot planning.

Impact:

- Authority ambiguity
- RBAC confusion
- Billing/admin boundary drift

Current control:

Platform Owner runtime behavior is not approved.

Required mitigation:

Keep first pilot within existing approved roles and tenant model.

Status:

CONTROLLED

────────────────────────────────────────────

RISK-014 — Pilot Acceptance Criteria Not Defined

Severity:

HIGH

Risk:

Pilot may start without clear success/failure criteria.

Impact:

- No objective closure
- Scope creep
- Uncontrolled changes

Current control:

Readiness checklist exists, but acceptance criteria must be finalized.

Required mitigation:

Create First Pilot Acceptance Criteria before start approval.

Status:

OPEN

────────────────────────────────────────────

RISK-015 — Support Path Not Defined

Severity:

MEDIUM

Risk:

Pilot users may not know how to report issues.

Impact:

- Lost evidence
- Delayed response
- Operational confusion

Current control:

No external pilot approved yet.

Required mitigation:

Define support channel, reporting rules, and severity classification.

Status:

OPEN

────────────────────────────────────────────
5) PILOT BLOCKERS
────────────────────────────────────────────

The following risks block first real pilot start:

- RISK-001
- RISK-002
- RISK-008
- RISK-009
- RISK-010
- RISK-014

Pilot start remains blocked until these are controlled or closed.

────────────────────────────────────────────
6) CONTROLLED RISKS
────────────────────────────────────────────

The following risks are currently controlled by architecture and governance rules:

- RISK-003
- RISK-004
- RISK-006
- RISK-011
- RISK-012
- RISK-013

These controls must remain active.

────────────────────────────────────────────
7) NOT APPROVED ACTIONS
────────────────────────────────────────────

The following are not approved:

- Start first real pilot
- Add real external users
- Delete backup Web container
- Delete Docker images
- Run Docker prune
- Move documentation files
- Modify Core
- Modify DB
- Modify Billing
- Modify companyId logic
- Modify Workflow
- Change Nginx
- Change Docker network
- Execute unplanned production commands
- Create Platform Owner runtime behavior

────────────────────────────────────────────
8) REQUIRED NEXT DOCUMENTS BEFORE PILOT START
────────────────────────────────────────────

Before first real pilot start, the following documents are required:

1. First Pilot Rollback Plan
2. First Pilot Tenant/User Scope Decision
3. First Pilot Observation Register Template
4. First Pilot Acceptance Criteria
5. First Pilot Support Path
6. First Pilot Start Approval Checkpoint

────────────────────────────────────────────
9) NEXT VALID ACTION
────────────────────────────────────────────

The next valid action after this risk register is one of:

Option A:

Commit and tag this risk register.

Option B:

Create First Pilot Rollback Plan.

Option C:

Create First Pilot Tenant/User Scope Decision.

Option D:

Create First Pilot Observation Register Template.

Recommended next action:

Commit and tag this risk register first.

Then create First Pilot Rollback Plan.

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

Was anything deleted by creating this First Pilot Risk Register?

NO

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────
