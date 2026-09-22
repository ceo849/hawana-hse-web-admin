# HAWANA HSE WEB — Documentation Entry Point

Document Type: Web Documentation Entry Point  
Repository: hawana-hse-web-admin  
Status: ACTIVE ENTRY POINT  

## 1) Start Here

Before reviewing or editing any Web Admin documentation, read:

docs/system/WEB_DOCS_GOVERNANCE_INDEX_2026_05_18.md

This file is the Web documentation governance authority.

Core repository remains the source of truth for system-wide governance and pilot governance.

## 2) Current Web State

- Web runtime stable
- API Proxy layer stable
- Authentication flow stable
- Cookie session flow stable
- Web → API Proxy → Core enforced
- No direct UI → Core calls allowed
- Frontend remains render-only
- Session expiry create action fix deployed
- Controlled Web Deployment Closure completed
- Additional Role Users Validation closed
- Web Logout Validation closed
- First Pilot Governance Reality Consolidation completed

Latest relevant checkpoint:

- web-create-session-expiry-fix-2026-05-19
- web-controlled-deployment-final-closure-2026-06-01
- first-pilot-governance-reality-consolidation-2026-06-10
- pilot-zero-live-findings-2026-05-19
- SR-21 current-state anchor: `docs/deployment/WEB_CURRENT_STATE_AFTER_SR21_CONTROLLED_PRODUCTION_EVOLUTION_CLOSURE_2026_09_18.md`
- `finding1-auth-response-remediation-verified-2026-09-20`
- `finding2-create-user-error-sanitization-verified-2026-09-21`

## 3) Docs Map

- docs/system/ — Web governance, architecture, API contract, execution rules
- docs/web/ — Web Admin architecture and UI pattern references
- docs/deployment/ — Web deployment runbook
- docs/infra/ — Web infrastructure and deployment reports
- docs/audit/ — Web audit findings and frontend governance checks
- docs/phases/ — Web phase history and closure reports
- docs/api/ — API contract artifacts
- docs/legacy/ — historical local patch references

## 4) Web Documentation Rules

1. Do not duplicate Core pilot governance inside Web.
2. Do not redefine system-wide governance inside Web.
3. Do not delete documentation without explicit approval.
4. Do not rename or move files without a governance decision.
5. Do not document frontend business logic as accepted behavior.
6. Web documentation must preserve Web → API Proxy → Core.
7. Web findings should stay Web-specific.
8. System-wide findings must be reflected in Core docs first.
9. Large audit files are evidence records, not daily working files.
10. New Web findings should be summarized in a Web findings register.

## 5) Current Highest Priority

The current highest Web priority is:

FIRST REAL PILOT GOVERNANCE READINESS REVIEW (Core-governed system-wide track)

Reason:

- Controlled Web Deployment Closure completed.
- Additional Role Users Validation closed.
- Web Logout Validation closed.
- Core ↔ Web Governance Alignment closed.
- No active Web runtime blocker identified.
- Open Web-specific MEDIUM/LOW findings remain and require separate review or refinement; they are not automatically classified as Pilot blockers. System-wide Pilot readiness and approval remain governed by Core.

## 6) Final Rule

If unsure where to document something:

STOP.

Read:

docs/system/WEB_DOCS_GOVERNANCE_INDEX_2026_05_18.md

If the issue is system-wide or pilot-wide, document it in Core first.

## Current Evidence Refresh — 2026-09-22

Current Web documentation should be interpreted using the following precedence:

1. Validated runtime / Production evidence.
2. Current Core system-wide and pilot governance authority.
3. SR-21 Web current-state anchor for the SR-21 closure state.
4. Later verified Web remediation evidence for Finding 1 and Finding 2.
5. Historical June 2026 Web / Pilot documents as context, not newer runtime truth.

Current system-wide track:

`FIRST REAL PILOT GOVERNANCE READINESS REVIEW`

External Pilot remains NOT APPROVED.

Was anything deleted?

NO
