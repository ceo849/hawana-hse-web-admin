# HAWANA HSE — FIRST PILOT CANDIDATE SEARCH HOLD DECISION
# قرار إيقاف مؤقت لمسار البحث عن شركة البايلوت الأولى

Document Type: Governance Hold Decision
Project: Hawana HSE
Layer: Web Admin + Cross-Reference to Core Governance
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Status: HOLD DECISION CREATED — FIRST REAL PILOT NOT APPROVED YET
Date: 2026-06-01

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document records the controlled decision to pause the First Real Pilot execution path because no real pilot company has been selected yet.

This is not a technical blocker.

This is a governance and business-input blocker.

The current system state is stable.

The Web controlled deployment is closed.

The Web current state is locked.

The Core/Web governance alignment review has been created.

The Core document read review result has been created.

The First Pilot observation, support, rollback, risk, readiness, and tenant/user scope governance documents have been created.

However, the First Real Pilot cannot start without a real candidate company that matches the approved pilot selection criteria.

────────────────────────────────────────────
2) CURRENT VERIFIED STATE
────────────────────────────────────────────

Current Web branch:

phase4.3-web-hardening

Current Web deployment state:

CLOSED — WEB CONTROLLED DEPLOYMENT ACCEPTED

Current Web runtime state:

STABLE

Current Web image:

us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:web-controlled-deployment-2026-06-01

Current architecture:

Web → API Proxy → Core → PostgreSQL

Current Core/Web alignment:

PARTIALLY ALIGNED FOR GOVERNANCE CONTINUITY

Core remains the source of truth.

Web complements Core.

No direct Core/Web conflict has been identified in the current documentation set.

First Real Pilot execution:

NOT APPROVED YET

────────────────────────────────────────────
3) WHY PILOT EXECUTION IS PAUSED
────────────────────────────────────────────

The First Real Pilot requires a real company or factory that satisfies the pilot criteria already documented in Core governance files.

At the time of this decision:

- No real pilot company has been selected.
- No final company legal name has been confirmed.
- No real pilot owner contact has been confirmed.
- No real pilot user list has been confirmed.
- No real pilot site/project has been confirmed.
- No pilot duration has been confirmed.
- No real onboarding boundary has been approved.
- No start approval checkpoint has been created.
- No tenant creation is approved.
- No user creation is approved.

Therefore, any attempt to create a First Pilot Start Approval Checkpoint now would be premature.

────────────────────────────────────────────
4) GOVERNANCE DECISION
────────────────────────────────────────────

Decision:

PAUSE FIRST REAL PILOT EXECUTION UNTIL A REAL PILOT CANDIDATE IS SELECTED AND APPROVED.

This pause does not reopen Web deployment.

This pause does not reopen Core deployment.

This pause does not change the current architecture.

This pause does not approve tenant creation.

This pause does not approve user creation.

This pause does not approve pilot execution.

This pause does not approve backup deletion.

This pause only locks the current state and defines the next valid business-governance activity:

SEARCH FOR A SUITABLE FIRST PILOT CANDIDATE COMPANY.

────────────────────────────────────────────
5) WHAT IS READY
────────────────────────────────────────────

The following are ready as governance foundations:

- Web controlled deployment closure
- Web current state anchor
- Web docs classification plan
- First Pilot Governance Review Plan
- First Pilot Readiness Checklist
- First Pilot Risk Register
- First Pilot Rollback Plan
- First Pilot Tenant/User Scope Decision
- First Pilot Core/Web Governance Alignment Review
- First Pilot Core Document Read Review Result
- First Pilot Observation Register Template
- First Pilot Support and Escalation Plan
- First Pilot Final Go / No-Go Review

These documents prepare the platform for pilot governance.

They do not approve pilot execution.

────────────────────────────────────────────
6) WHAT IS NOT READY
────────────────────────────────────────────

The following are not ready:

- Real pilot company selection
- Real pilot company legal/display name
- Real pilot owner details
- Real pilot user list
- Real pilot site/project name
- Pilot start date
- Pilot scope confirmation with the selected company
- Pilot support contact chain with the selected company
- Pilot acceptance criteria signed against the selected company
- Start approval checkpoint
- Controlled tenant creation execution
- Controlled user creation execution

────────────────────────────────────────────
7) REQUIRED COMPANY SELECTION PRINCIPLES
────────────────────────────────────────────

The selected pilot candidate must be suitable for a controlled first pilot.

The candidate should preferably have:

- Real HSE operational need
- Small controlled user scope
- Clear management contact
- One initial site/project
- Willingness to test Safety Reports and Action Plans
- Low operational risk for first SaaS pilot
- Ability to provide structured feedback
- No demand for uncontrolled custom features before pilot
- Acceptance of controlled pilot scope
- Acceptance that Billing remains controlled and not the focus of the first pilot
- Acceptance that support and escalation follow the documented process

The first pilot should not begin with a complex multi-site enterprise unless explicitly approved later.

────────────────────────────────────────────
8) NEXT VALID BUSINESS ACTIVITY
────────────────────────────────────────────

The next valid business activity is:

SEARCH FOR A SUITABLE FIRST PILOT CANDIDATE COMPANY

This activity is external/business discovery only.

It does not require code change.

It does not require server change.

It does not require DB change.

It does not require tenant creation.

It does not require user creation.

It does not require Docker action.

It does not require backup deletion.

────────────────────────────────────────────
9) NEXT VALID DOCUMENTATION ACTION AFTER CANDIDATE IS FOUND
────────────────────────────────────────────

After a candidate company is found, the next valid document should be:

FIRST_PILOT_CANDIDATE_EVALUATION_RESULT_YYYY_MM_DD.md

That document must classify:

- Candidate company name
- Industry
- Site/project type
- HSE use-case fit
- User count
- Pilot scope fit
- Risk level
- Support readiness
- Data sensitivity
- Go / No-Go recommendation for moving to inputs confirmation

After that, create:

FIRST_PILOT_INPUTS_CONFIRMATION_YYYY_MM_DD.md

Then create:

FIRST_PILOT_FINAL_GO_NO_GO_REVIEW_UPDATE_YYYY_MM_DD.md

Only after those may a separate First Pilot Start Approval Checkpoint be considered.

────────────────────────────────────────────
10) EXPLICITLY FORBIDDEN ACTIONS DURING HOLD
────────────────────────────────────────────

The following actions are not approved during this hold:

- Start real pilot
- Create pilot tenant
- Create pilot users
- Use fake company as real pilot
- Reclassify existing test tenant as real pilot
- Modify production tenant data
- Modify companyId logic
- Modify Billing
- Modify Workflow
- Modify Core
- Modify Web code
- Modify DB
- Change Nginx
- Change Docker network
- Delete backup Web container
- Delete Docker images
- Run Docker prune
- Delete Docker volumes
- Execute unplanned production commands
- Move documentation files physically
- Create Platform Owner runtime behavior

────────────────────────────────────────────
11) HOLD EXIT CRITERIA
────────────────────────────────────────────

This hold can be exited only when all the following are available:

- Candidate company selected
- Candidate evaluated against approved pilot criteria
- Candidate accepted controlled pilot scope
- Pilot owner/contact identified
- Initial user list defined
- Initial site/project defined
- Support and escalation contact path confirmed
- Pilot risks reviewed
- Core/Web governance alignment remains valid
- Final Go / No-Go update completed
- Separate Start Approval Checkpoint created

Without these items, pilot execution remains not approved.

────────────────────────────────────────────
12) CURRENT DECISION
────────────────────────────────────────────

Current First Real Pilot status:

ON HOLD

Reason:

NO REAL PILOT CANDIDATE COMPANY SELECTED YET

System status:

STABLE

Web deployment status:

CLOSED

Core/Web governance status:

NO DIRECT CONFLICT IDENTIFIED IN CURRENT DOCUMENTATION SET

Pilot execution status:

NOT APPROVED

Tenant creation status:

NOT APPROVED

User creation status:

NOT APPROVED

Backup deletion status:

NOT APPROVED

────────────────────────────────────────────
13) REQUIRED NEXT ACTION
────────────────────────────────────────────

The next valid action after this document is:

COMMIT AND TAG THIS FIRST PILOT CANDIDATE SEARCH HOLD DECISION

After commit:

STOP PILOT EXECUTION DOCUMENTATION LOOP

Then resume only when a real candidate company is available.

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

Was anything deleted by creating this First Pilot Candidate Search Hold Decision?

NO

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────
