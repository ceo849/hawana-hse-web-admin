# HAWANA HSE — FIRST PILOT SUPPORT AND ESCALATION PLAN
# خطة الدعم والتصعيد لأول Pilot

Document Type: Pilot Governance / Support and Escalation Plan
Project: Hawana HSE
Layer: Web Admin + Core Governance Reference
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Status: SUPPORT PLAN CREATED — FIRST REAL PILOT NOT APPROVED YET
Date: 2026-06-01

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document defines the support and escalation model required before considering any First Pilot Start Approval Checkpoint.

This document does not approve pilot execution.

This document does not approve tenant creation.

This document does not approve user creation.

This document does not approve server action.

This document does not approve backup deletion.

The purpose is to ensure that, if a first real pilot is later approved, all issues are captured, classified, escalated, and controlled professionally without architectural drift.

────────────────────────────────────────────
2) GOVERNING PRINCIPLES
────────────────────────────────────────────

The following principles remain mandatory:

- Stability First
- Additive only
- No breaking changes
- No uncontrolled refactor
- Backend remains source of truth
- Web must use API Proxy only
- Web → API Proxy → Core → PostgreSQL must remain preserved
- Multi-tenant isolation must remain enforced through companyId from authenticated context
- Billing must not be changed during pilot support without separate approval
- Workflow must not be changed during pilot support without separate approval
- Core must not be modified during pilot support without separate approval
- DB must not be modified directly during pilot support
- No direct SQL production fix is allowed
- No emergency workaround is allowed without governance classification

────────────────────────────────────────────
3) SUPPORT SCOPE
────────────────────────────────────────────

This support plan covers the following pilot-facing areas:

- Login and logout
- Dashboard access
- Safety Reports
- Action Plans
- Users read behavior
- Billing read-only visibility
- API Proxy behavior
- Runtime availability
- Web container stability
- Core health through Web/API Proxy
- Tenant isolation observation
- Role-based access observation
- User-reported usability observations
- HSE workflow observations
- Pilot issue classification
- Escalation decision path
- Stop-pilot decision path

Out of scope:

- Core feature development
- Billing behavior change
- companyId logic change
- Workflow logic change
- Platform Owner runtime behavior
- DB data correction
- Docker cleanup
- Backup deletion
- Production infrastructure redesign
- Documentation physical movement

────────────────────────────────────────────
4) SUPPORT ROLES
────────────────────────────────────────────

Support Owner:

- Responsible for receiving all pilot observations.
- Responsible for classifying observations.
- Responsible for deciding whether an issue is informational, deferred, blocking, or stop-pilot.
- Responsible for maintaining the pilot observation register.

Technical Reviewer:

- Reviews whether the issue is Web, API Proxy, Core, DB, infrastructure, RBAC, tenant isolation, or workflow related.
- Confirms whether the issue requires code change, configuration change, documentation update, or no action.
- Confirms whether the issue violates architecture.

Governance Approver:

- Approves any escalation from observation to execution plan.
- Approves any rollback plan execution.
- Approves any pilot pause or stop decision.
- Approves any future tenant/user creation step.

Pilot User Contact:

- Reports observed issues.
- Does not receive technical access.
- Does not execute commands.
- Does not receive backend credentials.
- Does not receive DB access.

────────────────────────────────────────────
5) SUPPORT CHANNELS
────────────────────────────────────────────

Allowed support channels:

- Controlled written report
- Screenshot from pilot user
- Exact timestamp
- User role
- Page or feature name
- Expected behavior
- Actual behavior
- Business/HSE impact description

Not allowed:

- Direct DB access
- Direct Core access
- Direct server access
- Direct Docker access
- Sharing production credentials
- Sending raw secrets in chat
- Uncontrolled screen sharing with production secrets visible
- Runtime hotfix without written classification

────────────────────────────────────────────
6) OBSERVATION INTAKE FORMAT
────────────────────────────────────────────

Every pilot observation must include:

- Observation ID
- Date and time
- Reporter
- User role
- Module
- Page or API path if known
- Expected behavior
- Actual behavior
- Screenshot availability
- Severity
- Impact
- Reproducibility
- Tenant impact
- Data impact
- Workflow impact
- Billing impact
- Security impact
- Immediate action
- Owner
- Status
- Pilot decision impact

Observation statuses:

- OPEN
- TRIAGED
- UNDER REVIEW
- BLOCKING
- DEFERRED
- RESOLVED
- ACCEPTED RISK
- CLOSED

Pilot decision impact values:

- INFORMATION ONLY
- FIX BEFORE PILOT CONTINUES
- BLOCKS PILOT
- STOP PILOT
- DEFER POST PILOT

────────────────────────────────────────────
7) SEVERITY CLASSIFICATION
────────────────────────────────────────────

CRITICAL:

A critical issue means one or more of the following:

- Cross-tenant data exposure
- companyId isolation failure
- Unauthorized access to restricted data
- Billing access/enforcement corruption
- Workflow corruption
- Data loss
- DB inconsistency
- Core unavailable
- Authentication bypass
- Production runtime instability
- Direct Core exposure from public domain
- Any issue requiring immediate pilot stop

Decision:

Pilot must stop or remain blocked until controlled.

HIGH:

A high issue means one or more of the following:

- Authenticated user cannot access required pilot module
- Role permissions behave incorrectly
- API Proxy failure blocks core pilot flow
- Safety Report or Action Plan flow fails
- Dashboard gives materially wrong operational data
- User creation/scope control becomes ambiguous
- Rollback readiness becomes unavailable

Decision:

Pilot cannot continue without controlled review.

MEDIUM:

A medium issue means one or more of the following:

- Usability issue affecting pilot efficiency
- Non-critical display inconsistency
- Missing clarity in UI label
- Non-blocking role confusion
- Recoverable workflow confusion
- Documentation mismatch that does not affect runtime

Decision:

Classify and decide whether fix before pilot continuation or defer.

LOW:

A low issue means one or more of the following:

- Cosmetic issue
- Minor wording issue
- Minor alignment issue
- Non-operational observation
- Improvement suggestion

Decision:

Usually defer unless repeated or confusing to pilot users.

INFORMATION ONLY:

Observation does not require action but should remain recorded.

────────────────────────────────────────────
8) ESCALATION MATRIX
────────────────────────────────────────────

CRITICAL escalation:

- Record observation immediately.
- Mark as BLOCKS PILOT or STOP PILOT.
- Stop pilot activity if already active.
- Do not apply workaround.
- Create controlled investigation plan.
- Create controlled fix plan only if required.
- Do not modify Core, DB, Billing, companyId, or Workflow without separate approval.

HIGH escalation:

- Record observation.
- Pause affected pilot flow.
- Classify root cause area.
- Create controlled review plan.
- Decide whether pilot may continue in limited scope.

MEDIUM escalation:

- Record observation.
- Triage within pilot governance.
- Decide fix-before-pilot or defer.
- No immediate runtime action unless approved.

LOW escalation:

- Record observation.
- Defer unless repeated.
- Include in post-pilot improvement backlog.

INFORMATION ONLY escalation:

- Record and close or keep as reference.

────────────────────────────────────────────
9) STOP-PILOT CONDITIONS
────────────────────────────────────────────

Pilot must not start or must be stopped if any of the following occurs:

- Cross-tenant visibility
- companyId mismatch
- Auth bypass
- Role bypass
- Core instability
- Web/API Proxy route bypass
- Direct backend exposure
- Workflow corruption
- Billing state corruption
- DB inconsistency
- Production container instability
- Unapproved Docker/server action
- Unapproved tenant/user creation
- Any uncontrolled hotfix proposal

────────────────────────────────────────────
10) ROOT CAUSE REVIEW RULE
────────────────────────────────────────────

No issue may be fixed by workaround-first behavior.

Every issue must be classified by root cause:

- Web rendering issue
- API Proxy issue
- Core behavior issue
- RBAC issue
- Tenant isolation issue
- Workflow issue
- Billing issue
- Infrastructure issue
- Documentation issue
- User training issue
- HSE process clarification issue

If root cause is unknown:

Status must remain UNDER REVIEW.

If root cause touches Core, DB, Billing, companyId, or Workflow:

Stop and create separate controlled plan.

────────────────────────────────────────────
11) RESPONSE TIME TARGETS
────────────────────────────────────────────

CRITICAL:

Initial classification: Immediate.
Pilot decision: Immediate.
Execution: Only after controlled approval.

HIGH:

Initial classification: Same day.
Pilot decision: Before next pilot session.
Execution: Only after controlled approval.

MEDIUM:

Initial classification: Within pilot review cycle.
Pilot decision: Before final pilot closure.

LOW:

Initial classification: During routine review.
Pilot decision: Usually defer.

INFORMATION ONLY:

Record and close or retain for trend review.

────────────────────────────────────────────
12) SUPPORT RECORDS REQUIRED
────────────────────────────────────────────

The following records must exist before any pilot start approval:

- First Pilot Observation Register Template
- First Pilot Support and Escalation Plan
- First Pilot Final Go / No-Go Review
- Core Web Governance Alignment Review
- Core Document Read Review Result
- First Pilot Risk Register
- First Pilot Rollback Plan
- First Pilot Tenant/User Scope Decision

This document does not approve pilot start.

────────────────────────────────────────────
13) FORBIDDEN SUPPORT ACTIONS
────────────────────────────────────────────

The following are not approved:

- Start real pilot
- Create pilot tenant
- Create pilot users
- Delete backup Web container
- Delete Docker images
- Run Docker prune
- Modify Core
- Modify Web code
- Modify DB
- Modify Billing
- Modify companyId logic
- Modify Workflow
- Change Nginx
- Change Docker network
- Move documentation files physically
- Execute unplanned production commands
- Apply workaround without root-cause classification

────────────────────────────────────────────
14) REQUIRED NEXT ACTION
────────────────────────────────────────────

The next valid action after this support plan is:

COMMIT AND TAG THIS FIRST PILOT SUPPORT AND ESCALATION PLAN

After commit, the next controlled action should be:

CREATE FIRST PILOT FINAL GO / NO-GO REVIEW

Only after that may a separate First Pilot Start Approval Checkpoint be considered.

────────────────────────────────────────────
15) SAFETY CONFIRMATION
────────────────────────────────────────────

This document is documentation only.

No server action was executed by creating this document.

No container action was executed by creating this document.

No Docker run was executed by creating this document.

No Docker rm was executed by creating this document.

No Docker Compose action was executed.

No backup deletion was executed.

No pilot execution was approved.

No tenant was created.

No user was created.

No Core change was made.

No Web code change was made.

No DB change was made.

No Billing change was made.

No companyId change was made.

No Workflow change was made.

No file was moved.

No file was renamed.

No file was deleted.

Was anything deleted by creating this First Pilot Support and Escalation Plan?

NO

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────
