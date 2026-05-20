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
- Mobile operational stabilization in progress
- RBAC / UI role visibility audit required next

Latest relevant checkpoint:

- web-create-session-expiry-fix-2026-05-19
- pilot-zero-live-findings-2026-05-19

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

RBAC / UI Role Visibility Audit

Reason:

- Worker Dashboard quick actions visibility mismatch was observed.
- Worker Action Plans access behavior requires alignment with backend RBAC policy.
- UI visibility must not conflict with Core authorization.
- Frontend must remain render-only and must not invent permission logic.

## 6) Final Rule

If unsure where to document something:

STOP.

Read:

docs/system/WEB_DOCS_GOVERNANCE_INDEX_2026_05_18.md

If the issue is system-wide or pilot-wide, document it in Core first.

Was anything deleted?

NO