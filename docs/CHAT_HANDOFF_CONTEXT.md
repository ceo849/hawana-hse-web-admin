# HAWANA HSE WEB — Chat Handoff Context

Document Type: Web Chat Handoff Context  
Repository: hawana-hse-web-admin  
Status: ACTIVE HANDOFF  
Last Updated: 2026-06-11  

## 1) Purpose

This file transfers Web Admin context safely from one AI chat to another.

It is not a full Web project report.

It is a controlled starting point for any new ChatGPT / AI assistant conversation working on Hawana HSE Web Admin.

The goal is to prevent context loss, unsafe Web edits, API Proxy violations, duplicate documentation, and frontend architecture drift.

## 2) Repository Identity

Repository:

hawana-hse-web-admin

Project:

Hawana HSE Web Admin

Architecture:

Web → API Proxy → Core

Core repository:

hawana-hse-core

Core remains the source of truth for:

- system-wide governance
- backend behavior
- tenant isolation
- Workflow authority
- Billing enforcement
- pilot governance
- backend RBAC policy

Web repository is responsible for:

- UI rendering
- API Proxy routes
- server-side Web fetch flow
- cookie/session handling
- Web navigation
- Web deployment
- Web-specific findings
- UI role visibility alignment after backend policy is confirmed

## 3) Non-Negotiable Web Rules

Always follow:

- Web → API Proxy → Core
- Use serverAppFetch in server-side Web flows
- Use /api routes only
- No direct UI → Core calls
- No frontend-derived Workflow state
- No frontend-derived Billing state
- No frontend-owned companyId logic
- Frontend is render-only
- Backend remains the source of truth
- Changes must be additive, minimal, testable, and reversible

Do not touch without explicit governed plan:

- Billing
- companyId logic
- Workflow logic
- Authentication model
- API contracts
- Core runtime behavior
- Database schema

## 4) Current Verified Web State

Current Web baseline:

- Web runtime stable
- API Proxy layer stable
- Authentication flow stable
- Cookie session flow stable
- Web → API Proxy → Core enforced
- No direct UI → Core calls allowed
- Frontend remains render-only
- Production Web deployment operational
- Documentation organization baseline established

Current highest Web priority:

First Pilot Governance Start Approval Readiness Review

Reason:

- Controlled Web Deployment Closure completed.
- Web Logout Track closed.
- Additional Role Users Validation closed.
- Core ↔ Web Governance Alignment closed.
- No active Web runtime blocker identified.
- Remaining open items are governance approval checkpoints.

## 5) Web Documentation Entry Points

For Web work, read first:

1. docs/README.md
2. docs/CURRENT_STATUS.md
3. docs/FINDINGS_REGISTER.md
4. docs/CHAT_HANDOFF_CONTEXT.md
5. docs/system/WEB_DOCS_GOVERNANCE_INDEX_2026_05_18.md

For system-wide or pilot-wide truth, switch to Core and read:

1. hawana-hse-core/docs/CHAT_HANDOFF_CONTEXT.md
2. hawana-hse-core/docs/README.md
3. hawana-hse-core/docs/CURRENT_STATUS.md
4. hawana-hse-core/docs/FINDINGS_REGISTER.md
5. hawana-hse-core/docs/system/DOCS_GOVERNANCE_INDEX_2026_05_18.md

## 6) Important Tags / Checkpoints

Web tags:

- web-create-session-expiry-fix-2026-05-19
- web-docs-organization-baseline-2026-05-20
- web-controlled-deployment-final-closure-2026-06-01
- first-pilot-governance-reality-consolidation-2026-06-10

Core tags relevant to Web work:

- pilot-zero-live-findings-2026-05-19
- docs-organization-baseline-2026-05-20
- chat-handoff-baseline-2026-05-20

Use tags as evidence checkpoints.

Do not assume current status from memory only.

## 7) Current Web Findings Summary

Highest active Web findings:

- WEB-UI-01: Action Plan list/detail status display mismatch observed.
- WEB-UI-02: STATUS_UPDATE_FAILED appears as technical user-facing message.
- WEB-UI-03: Manager Assigned To dropdown behavior requires UX review.

Resolved Web findings:

- WEB-AUTH-01: Session expiry during create server actions fixed.
- WEB-DASH-01: Admin Panel Action Plan metrics inconsistency resolved.
- WEB-DEPLOY-01: Apple Silicon image platform mismatch risk resolved.
- WEB-RBAC-01: Worker Dashboard quick actions visibility alignment completed.
- WEB-RBAC-02: Worker Action Plans visibility alignment completed.
- WEB-LOGOUT-01: Web Logout Validation Track closed.
- WEB-ROLES-01: Additional Role Users Validation Track closed.

See:

docs/FINDINGS_REGISTER.md

## 8) Required AI Working Style

Any new AI chat must work like this:

1. Read Web documentation entry points first.
2. Read Core handoff context for system-wide truth when needed.
3. Ask before changing files.
4. Use one step at a time.
5. Prefer read-only inspection before edits.
6. Never mix Core and Web edits in one uncontrolled step.
7. Never use long terminal heredocs for large files.
8. Create empty files first, then paste content via editor.
9. Always review file content before git add.
10. Always check git status before and after changes.
11. Commit only after review.
12. Push only after commit is clean.
13. Respect pre-push Web audit output.

Do not:

- bypass API Proxy
- call Core directly from UI
- invent frontend permission truth
- rewrite navigation without policy
- rewrite layout without governed plan
- delete historical evidence
- duplicate Core pilot governance
- create duplicate reports

## 9) Terminal / Execution Preferences

Preferred safe flow:

1. git status --short
2. inspect files
3. create or edit one file only
4. cat file to verify
5. git status --short
6. git add specific file
7. git commit
8. git push
9. optional tag

Avoid:

- long heredoc blocks
- bulk file operations
- mass rename
- mass delete
- uncontrolled refactor
- simultaneous Core + Web edits

## 10) How To Continue From A New Chat

Recommended first message in a new chat:

Read these files first and summarize the current Web state before any execution:

- docs/README.md
- docs/CURRENT_STATUS.md
- docs/FINDINGS_REGISTER.md
- docs/CHAT_HANDOFF_CONTEXT.md
- docs/system/WEB_DOCS_GOVERNANCE_INDEX_2026_05_18.md
- docs/deployment/WEB_CURRENT_STATE_AFTER_CONTROLLED_DEPLOYMENT_CLOSURE_2026_06_01.md
- docs/FIRST_PILOT_GOVERNANCE_REALITY_CONSOLIDATION_REVIEW_2026_06_10.md

Then wait for approval before suggesting commands.

If the task is system-wide, pilot-wide, RBAC policy, Workflow, Billing, companyId, or backend authority:

STOP.

Switch to Core context first.

## 11) Update Policy

This file may be updated only when:

- a major Web checkpoint is completed
- a new Web baseline tag is created
- the highest Web priority changes
- a major Web finding is resolved
- Web documentation governance changes
- Core handoff context changes in a way that affects Web work

Do not update this file for every small observation.

Small Web observations go to:

docs/FINDINGS_REGISTER.md

Current Web state updates go to:

docs/CURRENT_STATUS.md

Was anything deleted?

NO