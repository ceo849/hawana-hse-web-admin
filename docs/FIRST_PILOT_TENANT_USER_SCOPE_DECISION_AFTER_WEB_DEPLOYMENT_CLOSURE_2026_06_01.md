# HAWANA HSE — FIRST PILOT TENANT / USER SCOPE DECISION AFTER WEB DEPLOYMENT CLOSURE
# قرار نطاق Tenant / Users للـ First Pilot بعد إغلاق Web Deployment

Document Type: Pilot Governance / Scope Decision
Project: Hawana HSE
Repository: hawana-hse-web-admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Date: 2026-06-01
Status: SCOPE DECISION CREATED — FIRST REAL PILOT NOT APPROVED YET

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document defines the controlled first pilot tenant and user scope decision after Web controlled deployment closure.

This document does not approve pilot execution.

This document does not create users.

This document does not create tenants.

This document does not approve DB changes.

This document does not approve Core changes.

This document only defines the governance scope required before any future pilot start approval checkpoint.

────────────────────────────────────────────
2) CURRENT SOURCE OF TRUTH
────────────────────────────────────────────

Current Web state anchor:

docs/deployment/WEB_CURRENT_STATE_AFTER_CONTROLLED_DEPLOYMENT_CLOSURE_2026_06_01.md

Current Web runtime:

STABLE

Current Web deployment:

CLOSED

Current Web active image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Current Core active image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:core-local-delta-validation-amd64-2026-05-31

Current architecture:

Web → API Proxy → Core → PostgreSQL

First real external pilot:

NOT APPROVED YET

Backup Web container:

PRESERVED

Backup deletion:

NOT APPROVED

────────────────────────────────────────────
3) PILOT SCOPE DECISION
────────────────────────────────────────────

The first pilot must remain controlled, minimal, and reversible.

Approved pilot scope for future planning only:

- One pilot company
- One company OWNER
- Small internal validation user set before any external exposure
- Maximum initial users: 3 to 5
- One site/project
- Modules: Safety Reports, Action Plans, Dashboard read-only validation
- Billing: read-only verification only
- Platform owner behavior: not included
- External users: not approved yet
- Real customer onboarding: not approved yet

This scope is not an execution approval.

────────────────────────────────────────────
4) TENANT DECISION
────────────────────────────────────────────

Preferred tenant strategy:

CREATE A NEW CLEAN PILOT TENANT THROUGH APPROVED CORE/API FLOW ONLY

The pilot tenant must not be created by:

- Direct SQL
- DB manual insert
- Seed script
- Prisma Studio manual mutation
- CompanyId override
- Copying existing tenant data
- Reclassifying TEST_BLOCK tenants
- Reusing uncontrolled historical tenant artifacts

Allowed future tenant creation path:

- Separate approval checkpoint
- Core/API-controlled tenant creation path
- Documented evidence
- No direct DB mutation
- No Billing redesign
- No companyId logic change

Current decision:

Pilot tenant creation is NOT APPROVED by this document.

────────────────────────────────────────────
5) USER SCOPE DECISION
────────────────────────────────────────────

Initial pilot user model for future planning:

1. Pilot OWNER
2. Optional ADMIN
3. Optional MANAGER
4. Optional WORKER
5. Optional VIEWER

Maximum initial users:

3 to 5 users

Allowed role coverage:

- OWNER for company ownership validation
- ADMIN for administrative validation
- MANAGER for operational HSE validation
- WORKER for limited operational action validation
- VIEWER for read-only verification

Forbidden:

- Uncontrolled external users
- Bulk user import
- Public signup
- Shared credentials
- Cross-company user reuse
- Passing companyId from UI
- Manual DB user creation
- Runtime user creation without approval checkpoint

Current decision:

Pilot user creation is NOT APPROVED by this document.

────────────────────────────────────────────
6) MODULE SCOPE DECISION
────────────────────────────────────────────

Approved pilot planning modules:

- Login
- Dashboard
- Safety Reports
- Action Plans
- Users read/check only for authorized roles
- Billing read-only status verification

Modules not approved for expansion in first pilot:

- Billing actions
- Subscription changes
- Platform owner runtime behavior
- Tenant provisioning automation expansion
- Workflow redesign
- companyId behavior changes
- Core schema changes
- DB migrations

Workflow source of truth remains backend.

Billing source of truth remains backend.

companyId source of truth remains JWT/backend.

────────────────────────────────────────────
7) DATA GOVERNANCE DECISION
────────────────────────────────────────────

Pilot data must be isolated.

Required rules:

- companyId must come from JWT/backend only
- No companyId from UI as authority
- No cross-tenant validation using real tenant data
- No real customer data until pilot start is formally approved
- No deletion of existing production tenants
- No modification of historical test tenants
- No DB cleanup without separate plan
- No Billing data mutation
- No Workflow data mutation outside approved business flow

Pilot data creation is not approved by this document.

────────────────────────────────────────────
8) ACCEPTANCE CONDITIONS BEFORE PILOT START
────────────────────────────────────────────

Before a First Pilot Start Approval Checkpoint can be created, the following must exist:

- First Pilot Governance Review Plan
- First Pilot Readiness Checklist
- First Pilot Risk Register
- First Pilot Rollback Plan
- First Pilot Tenant/User Scope Decision
- First Pilot Observation Register Template
- First Pilot Support and Escalation Plan
- First Pilot Start Approval Checkpoint

Pilot start must remain blocked until all required documents are complete and reviewed.

────────────────────────────────────────────
9) EXPLICIT NON-APPROVALS
────────────────────────────────────────────

This document does not approve:

- Starting real pilot
- Creating pilot tenant
- Creating pilot users
- Adding external users
- Running server commands
- Running Docker commands
- Deleting backup Web container
- Deleting Docker images
- Running Docker prune
- Modifying Core
- Modifying DB
- Modifying Billing
- Modifying companyId logic
- Modifying Workflow
- Changing Nginx
- Changing Docker network
- Moving documentation files physically
- Creating Platform Owner runtime behavior

────────────────────────────────────────────
10) CURRENT DECISION SUMMARY
────────────────────────────────────────────

Pilot tenant strategy:

NEW CLEAN PILOT TENANT — PLANNING ONLY

Pilot user count:

3 TO 5 USERS MAXIMUM — PLANNING ONLY

Pilot modules:

SAFETY REPORTS + ACTION PLANS + DASHBOARD READ-ONLY + BILLING READ-ONLY STATUS

Pilot execution:

NOT APPROVED

Tenant creation:

NOT APPROVED

User creation:

NOT APPROVED

External pilot:

NOT APPROVED

────────────────────────────────────────────
11) NEXT VALID ACTION
────────────────────────────────────────────

The next valid action after this decision document is one of:

Option A:

Commit and tag this tenant/user scope decision.

Option B:

Create First Pilot Observation Register Template.

Option C:

Create First Pilot Support and Escalation Plan.

Option D:

Create controlled backup container cleanup classification plan.

Recommended next action:

Commit and tag this document first.

Then create First Pilot Observation Register Template.

────────────────────────────────────────────
12) SAFETY CONFIRMATION
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

No DB change was made.

No Billing change was made.

No companyId change was made.

No Workflow change was made.

No file was moved.

No file was renamed.

No file was deleted.

Was anything deleted by creating this First Pilot Tenant/User Scope Decision?

NO

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────
