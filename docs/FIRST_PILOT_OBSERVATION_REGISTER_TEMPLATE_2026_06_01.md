# HAWANA HSE — FIRST PILOT OBSERVATION REGISTER TEMPLATE
# قالب سجل ملاحظات أول Pilot

Document Type: Pilot Governance / Observation Register Template
Project: Hawana HSE
Layer: Web + Core Governance
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Status: TEMPLATE CREATED — FIRST REAL PILOT NOT APPROVED YET
Date: 2026-06-01

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document defines the official observation register template for the first controlled pilot preparation track.

The purpose is to ensure that any observation discovered before or during pilot readiness validation is recorded in a structured, professional, traceable, and governance-safe format.

This document does not approve pilot execution.

This document does not approve tenant creation.

This document does not approve user creation.

This document does not approve runtime changes.

────────────────────────────────────────────
2) GOVERNING RULES
────────────────────────────────────────────

The following rules apply to all observations:

- Backend remains the source of truth.
- Web must continue through API Proxy only.
- Web → API Proxy → Core → PostgreSQL must remain preserved.
- No direct Web-to-Core calls are allowed.
- No direct DB modification is allowed.
- No Billing change is allowed.
- No companyId logic change is allowed.
- No Workflow change is allowed.
- No undocumented runtime action is allowed.
- Any issue must be classified before execution.
- Any pilot blocker must stop pilot approval until closed or explicitly controlled.

────────────────────────────────────────────
3) OBSERVATION CLASSIFICATION MODEL
────────────────────────────────────────────

Each observation must be classified using the following fields:

Observation ID:

Unique sequential ID.

Example:

PILOT-OBS-001

Observation Date:

Date when the observation was recorded.

Layer:

Allowed values:

- Web
- API Proxy
- Core
- Database
- Infrastructure
- Authentication
- RBAC
- Billing
- Workflow
- Documentation
- Operations
- UX
- Security
- Tenant Isolation

Severity:

Allowed values:

- CRITICAL
- HIGH
- MEDIUM
- LOW
- INFO

Pilot Impact:

Allowed values:

- BLOCKS PILOT
- MUST FIX BEFORE PILOT
- CONTROL BEFORE PILOT
- CAN DEFER
- INFORMATION ONLY

Status:

Allowed values:

- OPEN
- UNDER REVIEW
- APPROVED FOR FIX PLAN
- FIXED
- VERIFIED
- DEFERRED WITH CONTROL
- CLOSED

Execution Approval:

Allowed values:

- NOT APPROVED
- PLAN REQUIRED
- APPROVED FOR DOC ONLY
- APPROVED FOR READ ONLY VALIDATION
- APPROVED FOR CONTROLLED EXECUTION

────────────────────────────────────────────
4) OBSERVATION REGISTER TABLE TEMPLATE
────────────────────────────────────────────

| ID | Date | Layer | Area | Observation | Severity | Pilot Impact | Current Status | Required Action | Owner | Evidence Path | Execution Approval |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PILOT-OBS-001 | YYYY-MM-DD | Web | Example | Example observation | LOW | INFORMATION ONLY | OPEN | Review and classify | TBD | TBD | NOT APPROVED |

────────────────────────────────────────────
5) PILOT BLOCKER RULE
────────────────────────────────────────────

Any observation classified as:

- CRITICAL
- HIGH
- BLOCKS PILOT
- MUST FIX BEFORE PILOT

must prevent First Pilot Start Approval until one of the following is true:

- The observation is fixed and verified.
- The observation is explicitly controlled by an approved governance plan.
- The observation is formally deferred with accepted pilot-safe controls.

No unresolved critical blocker may be ignored.

────────────────────────────────────────────
6) FIRST PILOT OBSERVATION ENTRY TYPES
────────────────────────────────────────────

The following observation types must be captured during pilot preparation and pilot execution:

Authentication observations:

- Login success or failure
- Logout behavior
- Session expiration
- Cookie behavior
- Unauthorized access handling

RBAC observations:

- OWNER access
- ADMIN access
- MANAGER access
- WORKER access
- VIEWER access
- Read-only enforcement
- Forbidden action behavior

Tenant isolation observations:

- companyId correctness
- Cross-tenant access prevention
- Tenant-specific dashboard data
- Tenant-specific users
- Tenant-specific reports
- Tenant-specific action plans

Workflow observations:

- Safety Report status behavior
- Action Plan status behavior
- Verified lock behavior
- Derived Safety Report state behavior
- Any mismatch between UI and Core response

API Proxy observations:

- Web calls through /api only
- serverAppFetch behavior
- Core error propagation
- 401 / 403 / 404 / 500 behavior

Operational observations:

- Runtime stability
- Container stability
- Logs
- Health endpoint behavior
- Nginx behavior
- Backup container preservation

UX observations:

- Navigation clarity
- Form validation clarity
- Error message clarity
- Mobile layout
- Table readability
- Empty state clarity

Documentation observations:

- Missing runbook step
- Conflicting docs
- Outdated status
- Missing evidence path
- Missing closure status

────────────────────────────────────────────
7) INITIAL REGISTER STATUS
────────────────────────────────────────────

Initial First Pilot Observation Register status:

CREATED AS TEMPLATE ONLY

Current pilot status:

NOT APPROVED YET

Tenant creation:

NOT APPROVED

User creation:

NOT APPROVED

Runtime pilot execution:

NOT APPROVED

Backup deletion:

NOT APPROVED

────────────────────────────────────────────
8) REQUIRED NEXT ACTION
────────────────────────────────────────────

The next valid action after this template is:

COMMIT AND TAG THIS FIRST PILOT OBSERVATION REGISTER TEMPLATE

After commit, the next controlled action should be:

CREATE FIRST PILOT SUPPORT AND ESCALATION PLAN

Then:

CREATE FIRST PILOT FINAL GO / NO-GO REVIEW

Only after that may a separate First Pilot Start Approval Checkpoint be considered.

────────────────────────────────────────────
9) FORBIDDEN ACTIONS
────────────────────────────────────────────

The following actions are not approved:

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

Was anything deleted by creating this First Pilot Observation Register Template?

NO

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────
