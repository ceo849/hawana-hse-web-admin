# HAWANA HSE — FIRST PILOT CORE WEB GOVERNANCE ALIGNMENT REVIEW
# مراجعة توافق حوكمة الكور والويب قبل أول Pilot

Document Type: Cross-Layer Governance Alignment Review
Project: Hawana HSE
Scope: Core + Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Status: ALIGNMENT REVIEW CREATED — FIRST REAL PILOT NOT APPROVED YET
Date: 2026-06-01

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document exists to align Core governance documents and Web governance documents before any First Pilot Start Approval Checkpoint.

This document does not approve pilot execution.

This document does not approve tenant creation.

This document does not approve user creation.

This document does not approve any server action.

This document does not approve any code change.

The purpose is to confirm that the Web pilot governance track complements the Core pilot governance track and does not conflict with it.

────────────────────────────────────────────
2) ARCHITECTURE CONTRACT
────────────────────────────────────────────

The active architecture contract remains:

Web → API Proxy → Core → PostgreSQL

Mandatory rules:

- Web must call internal API Proxy only.
- Web must not call Core directly from UI.
- API Proxy must use serverAppFetch(token).
- Core remains the backend source of truth.
- companyId must come from authenticated Core/JWT context.
- No companyId must be accepted from Web client body as tenant authority.
- Workflow behavior must remain owned by Core.
- Billing behavior must remain owned by Core/Billing governance.
- Web is a presentation and API Proxy layer, not business authority.

Alignment decision:

PRESERVED

────────────────────────────────────────────
3) CORE GOVERNANCE AUTHORITY
────────────────────────────────────────────

Core remains authoritative for:

- Authentication
- Authorization
- RBAC enforcement
- Multi-tenant isolation
- companyId source of truth
- Workflow transitions
- Safety Report derived status
- Action Plan lifecycle
- Audit Log behavior
- Billing access state
- Tenant provisioning rules
- API contract behavior
- Database integrity

Web must not override any Core rule.

Web must not create alternative tenant logic.

Web must not create alternative Workflow logic.

Web must not create alternative Billing logic.

Alignment decision:

CORE REMAINS SOURCE OF TRUTH

────────────────────────────────────────────
4) WEB GOVERNANCE AUTHORITY
────────────────────────────────────────────

Web governance documents cover:

- Web deployment readiness
- Web deployment runbook compliance
- Web local build validation
- Web Docker image build and push validation
- Web server pull validation
- Web controlled container replacement evidence
- Web post-replacement functional validation
- Web authenticated functional validation
- Web current runtime state after deployment closure
- First pilot Web-facing readiness
- First pilot Web-facing risk control
- First pilot Web-facing rollback model
- First pilot tenant/user scope decision

Web governance documents do not replace Core governance documents.

Web governance documents only define Web-side readiness and pilot interface governance.

Alignment decision:

WEB COMPLEMENTS CORE

────────────────────────────────────────────
5) CURRENT WEB STATE CONFIRMED
────────────────────────────────────────────

Current Web branch:

phase4.3-web-hardening

Current Web controlled deployment closure:

docs/deployment/WEB_CONTROLLED_DEPLOYMENT_FINAL_CLOSURE_2026_06_01.md

Current Web state anchor:

docs/deployment/WEB_CURRENT_STATE_AFTER_CONTROLLED_DEPLOYMENT_CLOSURE_2026_06_01.md

Current Web runtime status:

STABLE

Current Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Current Web deployment acceptance:

ACCEPTED FOR CURRENT CONTROLLED WEB DEPLOYMENT SCOPE

Backup Web container:

PRESERVED

Backup deletion:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

────────────────────────────────────────────
6) CURRENT WEB PILOT GOVERNANCE DOCUMENTS
────────────────────────────────────────────

The following Web pilot governance documents are part of the current Web pilot preparation track:

- docs/FIRST_PILOT_GOVERNANCE_REVIEW_PLAN_AFTER_WEB_DEPLOYMENT_CLOSURE_2026_06_01.md
- docs/FIRST_PILOT_READINESS_CHECKLIST_AFTER_WEB_DEPLOYMENT_CLOSURE_2026_06_01.md
- docs/FIRST_PILOT_RISK_REGISTER_AFTER_WEB_DEPLOYMENT_CLOSURE_2026_06_01.md
- docs/FIRST_PILOT_ROLLBACK_PLAN_AFTER_WEB_DEPLOYMENT_CLOSURE_2026_06_01.md
- docs/FIRST_PILOT_TENANT_USER_SCOPE_DECISION_AFTER_WEB_DEPLOYMENT_CLOSURE_2026_06_01.md

These documents establish that:

- First real pilot remains not approved.
- Tenant creation remains not approved.
- User creation remains not approved.
- Rollback planning exists but rollback was not executed.
- Risks are documented before pilot approval.
- Tenant/user scope is defined as a decision document only.
- New clean pilot tenant is the preferred direction.
- Tenant creation must be through approved Core/API flow only.

Alignment decision:

WEB PILOT DOCS ARE GOVERNANCE PREPARATION ONLY

────────────────────────────────────────────
7) CORE PILOT GOVERNANCE DOCUMENTS TO ALIGN
────────────────────────────────────────────

The Core repository contains earlier governance and pilot-related documents that must be treated as source material for final pilot approval.

Relevant Core document categories include:

- Production tenant truth classification
- Controlled first pilot tenant onboarding plan
- Audit Log pilot-critical coverage plan
- RBAC audit and target policy matrix
- Production read-only validation evidence
- Production source-of-truth classification result
- Core RBAC deployment evidence
- First pilot readiness / governance evidence if present
- Any Core closure report related to pilot-critical controls

Core files must be reviewed before pilot approval.

No Web document may override a newer Core closure or Core blocker.

Alignment decision:

CORE DOC REVIEW REQUIRED BEFORE PILOT START APPROVAL

────────────────────────────────────────────
8) KNOWN CROSS-LAYER ALIGNMENT POINTS
────────────────────────────────────────────

The following alignment points are mandatory before any pilot start approval:

1. Architecture

Required state:

Web → API Proxy → Core → PostgreSQL

Current Web state:

Preserved

Required Core state:

Must remain preserved

Decision:

ALIGNED SUBJECT TO CORE READ REVIEW

2. Tenant isolation

Required state:

companyId from Core/JWT context only.

Current Web state:

No tenant creation approved.
No companyId change approved.

Required Core state:

companyId isolation must remain enforced.

Decision:

ALIGNED SUBJECT TO CORE READ REVIEW

3. Workflow

Required state:

Core owns Workflow and Safety Report derived status.

Current Web state:

No Workflow change approved.

Required Core state:

Workflow must remain unchanged and enforced.

Decision:

ALIGNED SUBJECT TO CORE READ REVIEW

4. Billing

Required state:

Billing behavior remains Core-governed.

Current Web state:

No Billing change approved.

Required Core state:

Billing must remain unchanged.

Decision:

ALIGNED SUBJECT TO CORE READ REVIEW

5. RBAC

Required state:

Core RBAC is authoritative.
Web may hide or show UI only; Core must enforce.

Current Web state:

Authenticated validation passed.
No RBAC change approved.

Required Core state:

RBAC policy must be reviewed against pilot user scope.

Decision:

REQUIRES CORE-WEB POLICY REVIEW

6. Audit Log

Required state:

Pilot-critical actions should be auditable as required by Core governance.

Current Web state:

No audit behavior change approved.

Required Core state:

Audit Log pilot-critical coverage must be classified before pilot start.

Decision:

REQUIRES CORE AUDIT LOG READ REVIEW

7. Tenant onboarding

Required state:

New clean pilot tenant through approved Core/API flow only.

Current Web state:

Tenant creation not approved.
User creation not approved.

Required Core state:

Tenant onboarding flow must be explicitly approved before execution.

Decision:

NOT APPROVED YET

8. Rollback

Required state:

Rollback must be controlled and documented.

Current Web state:

Rollback plan created.
Rollback not executed.
Backup Web container preserved.

Required Core state:

Core rollback and production safety posture must remain stable.

Decision:

WEB SIDE READY, CORE SIDE MUST BE CONFIRMED

────────────────────────────────────────────
9) CONFLICT CHECK
────────────────────────────────────────────

Potential conflict:

Starting pilot from Web documents alone.

Decision:

NOT ALLOWED

Potential conflict:

Creating tenant/users from Web scope decision.

Decision:

NOT ALLOWED

Potential conflict:

Using existing production test tenant for real pilot without Core classification.

Decision:

NOT ALLOWED

Potential conflict:

Deleting backup Web container before pilot governance closure.

Decision:

NOT ALLOWED

Potential conflict:

Changing Core, DB, Billing, companyId, or Workflow during pilot preparation.

Decision:

NOT ALLOWED

Potential conflict:

Treating Web readiness as full platform readiness.

Decision:

NOT ALLOWED

────────────────────────────────────────────
10) ALIGNMENT DECISION
────────────────────────────────────────────

Core and Web documents are complementary.

Web documents confirm that Web runtime and Web-side pilot governance are stable and controlled.

Core documents remain mandatory for:

- Tenant truth
- Tenant creation authority
- companyId isolation
- RBAC enforcement
- Workflow correctness
- Billing enforcement
- Audit Log pilot-critical coverage
- Backend source-of-truth validation

Final alignment status:

PARTIALLY ALIGNED — CORE READ REVIEW STILL REQUIRED BEFORE PILOT START APPROVAL

First real pilot:

NOT APPROVED YET

First Pilot Start Approval Checkpoint:

NOT ALLOWED YET

────────────────────────────────────────────
11) REQUIRED BEFORE FIRST PILOT START APPROVAL
────────────────────────────────────────────

Before any First Pilot Start Approval Checkpoint, the following must be complete:

1. Core pilot governance documents reviewed.
2. Core tenant truth classification reviewed.
3. Core Audit Log pilot-critical status reviewed.
4. Core RBAC pilot scope reviewed.
5. Core tenant onboarding flow confirmed.
6. Web pilot readiness docs reviewed.
7. Web risk register reviewed.
8. Web rollback plan reviewed.
9. Tenant/user scope confirmed against Core policy.
10. Any conflict between Core and Web docs must be documented and resolved.

No pilot start approval may be created before these items are complete.

────────────────────────────────────────────
12) NEXT VALID ACTION
────────────────────────────────────────────

The next valid action after this document is:

COMMIT AND TAG THIS CORE WEB GOVERNANCE ALIGNMENT REVIEW

After commit, the next controlled action should be:

CREATE FIRST PILOT CORE DOCUMENT READ REVIEW RESULT

That next document must read Core governance docs and classify:

- Current Core pilot readiness
- Current Core tenant truth
- Current Core Audit Log pilot-critical status
- Current Core RBAC pilot readiness
- Any Core/Web conflict
- Whether pilot approval remains blocked

────────────────────────────────────────────
13) FORBIDDEN ACTIONS
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
14) SAFETY CONFIRMATION
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

Was anything deleted by creating this Core Web Governance Alignment Review?

NO

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────
