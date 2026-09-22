# HAWANA HSE WEB — Findings Register

Document Type: Web Findings Register  
Repository: hawana-hse-web-admin  
Status: ACTIVE REGISTER  
Last Updated: 2026-09-22

## 1) Purpose

This file tracks Web-specific operational, UI, navigation, API proxy, and role-visibility findings.

This file does not replace Core pilot governance.

Core remains the source of truth for system-wide pilot findings and backend authorization behavior.

Primary Core reference:

hawana-hse-core/docs/FINDINGS_REGISTER.md

Primary Web governance reference:

docs/system/WEB_DOCS_GOVERNANCE_INDEX_2026_05_18.md

## 2) Severity Definitions

CRITICAL:

Web behavior that bypasses API Proxy, calls Core directly, leaks tenant data, corrupts Workflow state, bypasses Billing enforcement, or breaks production runtime.

HIGH:

Web behavior that can block pilot execution or create serious UI / RBAC / role visibility confusion.

MEDIUM:

Operational Web friction, UI mismatch, refresh inconsistency, or user-facing message issue.

LOW:

Presentation, label, layout, readability, spacing, or mobile polish issue.

RESOLVED:

Previously observed Web issue that has been fixed and validated.

PASSED:

Validated Web behavior that works as expected.

## 3) Active Web Findings

| ID | Area | Finding | Severity | Status | Decision / Next Step | Source |
|---|---|---|---|---|---|---|
| WEB-UI-01 | UI / Data Refresh | Action Plan list/detail status display mismatch observed during testing | MEDIUM | OPEN | Verify later; not classified as Workflow failure | Pilot Zero live test |
| WEB-UI-03 | UI / Assignment | Manager Assigned To dropdown behavior requires UX/RBAC review | MEDIUM | OPEN | Review in Manager assignment UX follow-up | Pilot Zero live test |
| WEB-UI-04 | UI / Readability | UUID values appear directly in operational screens | LOW | OPEN | Improve readability later | Mobile operational audit |
| WEB-UI-05 | UI / Labels | Raw enum/status labels appear in some screens | LOW | OPEN | Improve labels later | Mobile operational audit |
| WEB-MOBILE-01 | Mobile UI | Mobile spacing inconsistency | LOW | OPEN | UI polish later | Mobile operational audit |
| WEB-MOBILE-02 | Mobile UI | Sidebar usability friction on mobile | LOW | OPEN | Mobile usability refinement later | Mobile operational audit |

## 4) Resolved Web Findings

| ID | Area | Finding | Severity | Status | Resolution | Source |
|---|---|---|---|---|---|---|
| WEB-RBAC-01 | UI Role Visibility | Worker Dashboard quick actions visibility mismatch | HIGH | RESOLVED | Dashboard quick actions are now role-aware; tag web-rbac-ui-role-visibility-alignment-2026-05-21 | Pilot Zero live test / Web RBAC alignment |
| WEB-RBAC-02 | UI Role Visibility | Worker Action Plans access / visibility required alignment with Core authorization | HIGH | RESOLVED | Web visibility aligned with Core Worker assigned-only Action Plans policy; mobile quick actions also role-aware | Core RBAC fix / Web RBAC alignment |
| WEB-AUTH-01 | Auth / Server Actions | Session expiry during create server actions caused Application Error | HIGH | RESOLVED | Web-only fix deployed; expired submit redirects to Login | web-create-session-expiry-fix-2026-05-19 |
| WEB-DASH-01 | Dashboard / Metrics | Admin Panel Action Plan metrics inconsistency | MEDIUM | RESOLVED | Admin Panel aligned with centralized dashboard metrics flow | Pilot audit |
| WEB-DEPLOY-01 | Deployment | Apple Silicon image platform mismatch risk | MEDIUM | RESOLVED | linux/amd64 buildx strategy validated | Web deployment validation |
| WEB-UI-02 | UI / Messaging | STATUS_UPDATE_FAILED exposed as a technical user-facing message | MEDIUM | RESOLVED | Technical error-key exposure is closed in the verified Web rendering path. STATUS_UPDATE_FAILED is mapped to "Unable to update the Action Plan status. Please try again."; unknown error keys are not rendered raw. Verified at Controlled Engineering Implementation + Remote Preservation + Bounded Isolated Local Runtime Verification level. NOT Production Runtime Verification and NOT Production Deployment. | UI-06 controlled closure — 2026-09-13 |

## 5) Passed Web Validations

| ID | Area | Validation | Status | Evidence |
|---|---|---|---|---|
| WEB-ARCH-01 | Architecture | Web → API Proxy → Core preserved | PASSED | Runtime logs / Web audit |
| WEB-ARCH-02 | Architecture | No direct UI → Core calls accepted as allowed pattern | PASSED | Web governance audit |
| WEB-AUTH-02 | Auth | Login flow operational | PASSED | Pilot live test |
| WEB-AUTH-03 | Auth | Cookie session flow operational | PASSED | Web runtime validation |
| WEB-PROXY-01 | API Proxy | Web API Proxy calls Core through server-side route flow | PASSED | Runtime logs |
| WEB-DEPLOY-02 | Deployment | Production Web image replacement validated | PASSED | Production deployment validation |
| WEB-AUDIT-01 | Pre-push Audit | Web Audit passed before documentation push | PASSED | Git push pre-push output |

## 6) Current Highest Web Priority

The current highest Web priority is:

FIRST REAL PILOT GOVERNANCE READINESS REVIEW (Core-governed system-wide track)

Reason:

- Controlled Web Deployment Closure completed.
- Additional Role Users Validation closed.
- Web Logout Validation closed.
- Core ↔ Web Governance Alignment closed.
- No active Web runtime blocker identified.
- Open Web-specific MEDIUM/LOW findings remain and require separate review or refinement; they are not automatically classified as Pilot blockers. System-wide Pilot readiness and approval remain governed by Core.

## 7) Current Decision

Web RBAC UI visibility alignment has been implemented after Core RBAC policy confirmation.

Do not redesign Workflow.

Do not touch Billing.

Do not touch companyId logic.

Do not bypass Web → API Proxy → Core.

Do not add frontend-derived business logic.

Next controlled phase:

Pilot validation and remaining Web UI refinements.

## Current Findings Alignment — 2026-09-22

This additive section records later verified Web remediation without repurposing or silently reclassifying historical Web finding IDs.

### Finding 1 — Auth response token exposure

- Status: CLOSED.
- Commit: `5ec7bd52afdea90dac73546b065a7eade509b2e8`.
- Tag: `finding1-auth-response-remediation-verified-2026-09-20`.
- Verified effect: auth tokens are no longer returned in client-visible login/refresh response bodies.

### Finding 2 — Create-user technical error exposure

- Status: CLOSED.
- Commit: `52859a21398cbbe6cae1fdbb0dd5bd0bf355a1a0`.
- Tag: `finding2-create-user-error-sanitization-verified-2026-09-21`.
- Verified effect: create-user technical errors are sanitized while safe business errors remain preserved.

### Existing Web findings boundary

- `WEB-UI-01`, `WEB-UI-03`, `WEB-UI-04`, `WEB-UI-05`, `WEB-MOBILE-01`, and `WEB-MOBILE-02` remain OPEN unless separately reviewed.
- No severity or status reclassification of those six findings is performed by this documentation reconciliation.
- Their existence does not automatically establish a Pilot blocker.
- System-wide Pilot readiness and authorization remain governed by Core.
- Current Core-governed track: `FIRST REAL PILOT GOVERNANCE READINESS REVIEW`.
- External Pilot remains NOT APPROVED.

Was anything deleted?

NO
