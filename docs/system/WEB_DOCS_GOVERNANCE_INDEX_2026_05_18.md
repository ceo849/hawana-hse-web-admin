# HAWANA HSE — WEB DOCS GOVERNANCE INDEX
# فهرس حوكمة توثيق الويب — هوانة HSE

Document Type: Web Documentation Governance Index  
Project: Hawana HSE Web Admin  
Architecture: Web → API Proxy → Core  
Mode: Stability First / Additive Only / No Breaking Changes  
Status: ACTIVE GOVERNANCE ENTRY POINT  
Date: 2026-05-18

---

# 1) PURPOSE | الهدف

EN:

This document is the governance entry point for all Web Admin documentation inside Hawana HSE.

Its purpose is to:

- Organize web documentation references.
- Define current web governance hierarchy.
- Prevent documentation drift.
- Prevent frontend architectural violations.
- Establish current operational references.
- Support pilot operational stabilization.

This document does NOT replace existing documentation.

AR:

هذا الملف هو نقطة الدخول الرسمية لحوكمة توثيق Web Admin داخل Hawana HSE.

الهدف منه:

- تنظيم مراجع الويب.
- تحديد hierarchy الحالية للتوثيق.
- منع تضارب الملفات.
- منع الانحراف المعماري للواجهة.
- تحديد المراجع التشغيلية الحالية.
- دعم استقرار الـ Pilot.

هذا الملف لا يستبدل الملفات الحالية.

---

# 2) CURRENT WEB STATE | الحالة الحالية للويب

Current operational state:

- Web Runtime = Stable
- API Proxy Layer = Stable
- Authentication = Stable
- Cookie Session Flow = Stable
- Multi-Tenant Isolation = Active
- UI Governance = Active
- Immutable Deployment = Active
- Pilot Stabilization = Active

Current stable references:

- phase4.3-web-hardening
- web-governed-stable-baseline-2026-05-17

---


# 2A) CURRENT AUTHORITATIVE WEB REALITY

Current authoritative Web reality:

- Web Runtime = Stable
- API Proxy = Stable
- Authentication = Stable
- Additional Role Users Validation = Closed
- Web Logout Validation = Closed
- Core ↔ Web Governance Alignment = Closed
- Controlled Web Deployment = Closed
- Architecture = Preserved
- Web → API Proxy → Core = Preserved
- Frontend Remains Render-Only
- No Direct UI → Core Access Approved

Current pilot reality:

- First Real Pilot = NOT APPROVED YET
- No Active Web Runtime Blocker Identified
- Open Items = Governance Approval Items
- Pilot Tenant Approval Pending
- Pilot User Approval Pending
- Pilot Start Approval Pending

Authoritative current-state references:

- docs/deployment/WEB_CURRENT_STATE_AFTER_CONTROLLED_DEPLOYMENT_CLOSURE_2026_06_01.md
- docs/FIRST_PILOT_GOVERNANCE_REALITY_CONSOLIDATION_REVIEW_2026_06_10.md

---


# 3) WEB GOVERNANCE RULES | قواعد حوكمة الويب

## RULE 1 — No Direct Core Access

Frontend must NEVER call Core directly.

Mandatory flow:

Web → API Proxy → Core

Allowed access pattern:

- serverAppFetch()
- /api/* routes only

Direct backend URLs are forbidden.

---

## RULE 2 — No Frontend Business Logic

Frontend is render-only.

Frontend must NOT:

- derive workflow states
- derive billing states
- calculate tenant authority
- enforce workflow engines

Backend remains the source of truth.

---

## RULE 3 — Multi-Tenant Isolation

Frontend must never trust tenant identifiers from UI payloads.

companyId authority remains backend-owned only.

---

## RULE 4 — Additive Governance Only

No uncontrolled frontend rewrites.

No architecture replacement.

No direct runtime mutation.

No breaking API contracts.

---

## RULE 5 — Runtime Truth Priority

Validated runtime behavior overrides outdated documentation.

If documentation conflicts with actual validated runtime:

- runtime wins
- docs are later corrected

---

## RULE 6 — Core Pilot Governance Authority

Core repository remains the authoritative source of truth for:

- pilot governance
- pilot execution
- operational maturity tracking
- operational validation
- controlled pilot evolution

Web repository must NOT create an independent pilot governance model.

Web documentation is limited to:

- web operational alignment
- deployment governance
- UI stabilization governance
- proxy/runtime validation
- mobile operational findings
- web-specific operational references

Forbidden:

- duplicating full pilot governance plans inside Web
- redefining pilot phases inside Web
- creating conflicting operational governance layers
- overriding Core pilot operational truth

Authoritative Core pilot references:

- hawana-hse-core/docs/pilot/PILOT_OPERATIONS_GOVERNANCE_MASTER_PLAN.md
- hawana-hse-core/docs/pilot/PILOT_INTERNAL_EXECUTION_PLAN_2026_05_18.md
- hawana-hse-core/docs/pilot/PILOT_MOBILE_OPERATIONAL_AUDIT_FINDINGS_2026_05_18.md

Web operational mirror references:

- docs/deployment/WEB_DEPLOYMENT_RUNBOOK.md
- docs/system/WEB_DOCS_GOVERNANCE_INDEX_2026_05_18.md

Purpose of this rule:

- prevent governance duplication
- prevent pilot-document drift
- preserve single operational truth
- maintain Core authority
- maintain Web/Core operational alignment

---

# 4) CURRENT WEB GOVERNANCE REFERENCES
# المراجع الحالية الأساسية للويب

NOTE:

This is an INITIAL governance mapping only.

It is not yet a final full audit classification.

---

## SYSTEM REFERENCES

- docs/system/SYSTEM_API_CONTRACT_LOCKED.md
- docs/system/SYSTEM_ARCHITECTURE_FINAL.md
- docs/system/SYSTEM_EXECUTION_PLAN_LOCKED.md
- docs/system/SYSTEM_OVERVIEW_FINAL.md

---

## WEB REFERENCES

- docs/web/WEB_ADMIN_TECHNICAL_REFERENCE_FINAL.md
- docs/web/WEB_ARCHITECTURE_FINAL.md
- docs/web/WEB_UI_PATTERN_FINAL.md

---

## INFRA REFERENCES

- docs/infra/INFRA_DEPLOYMENT_REPORT_FINAL.md
- docs/infra/INFRA_RUNBOOK_FINAL.md
- docs/infra/WEB_COMPOSE_RUNTIME_CLASSIFICATION_2026_05_16.md

---

## AUDIT REFERENCES

- docs/audit/AUDIT_WEB_API_USAGE.md
- docs/audit/AUDIT_WEB_BUSINESS_LOGIC.md
- docs/audit/AUDIT_WEB_FETCH_LAYER.md
- docs/audit/AUDIT_WEB_MULTI_TENANT.md
- docs/audit/AUDIT_WEB_NAVIGATION_DRIFT.md

---

## PHASE REFERENCES

- docs/phases/PHASE4_3_FINAL_CLOSURE.md
- docs/phases/PHASE4_3_UI_UNIFIED_CLOSURE.md
- docs/phases/PHASE5_FINAL_CLOSURE.md

---

# 5) WEB DOCS INITIAL CLASSIFICATION
# التصنيف الأولي لملفات الويب

NOTE:

This section represents an INITIAL governance classification only.

It does NOT represent a complete final documentation audit.

---

## AUTHORITATIVE GOVERNANCE REFERENCES

These files currently represent the highest operational authority for Web Admin governance.

- docs/web/WEB_ADMIN_TECHNICAL_REFERENCE_FINAL.md
- docs/web/WEB_ARCHITECTURE_FINAL.md
- docs/system/SYSTEM_API_CONTRACT_LOCKED.md
- docs/system/SYSTEM_ARCHITECTURE_FINAL.md

Role:

- authoritative runtime references
- architecture enforcement
- API governance
- UI governance
- operational alignment

---

## ACTIVE OPERATIONAL GOVERNANCE REFERENCES

These files are currently operationally relevant during pilot stabilization.

- docs/system/WEB_DOCS_GOVERNANCE_INDEX_2026_05_18.md
- docs/infra/WEB_COMPOSE_RUNTIME_CLASSIFICATION_2026_05_16.md
- docs/audit/AUDIT_STABILITY_CHECKPOINT_2026-05-01.md

Role:

- operational governance
- runtime classification
- deployment awareness
- stabilization tracking

---

## HISTORICAL / TRANSITIONAL REFERENCES

These files remain important historical execution references.

They should NOT automatically override newer validated governance documents.

- docs/phases/PHASE4_3_START.md
- docs/phases/PHASE4_4_START.md
- docs/system/SYSTEM_EXECUTION_PLAN_LOCKED.md

Role:

- execution history
- architectural transition context
- governance evolution tracking

---

## AUDIT REFERENCES

Audit files document architectural validation status across the Web layer.

Current validated runtime state indicates governance compliance.

Important note:

Some older audits may describe previously detected violations that were later resolved.

Examples:

- docs/audit/AUDIT_WEB_BUSINESS_LOGIC_CRITICAL.md

This file represents historical detection state and must be interpreted together with:

- docs/audit/AUDIT_WEB_FINAL_REPORT.md
- docs/audit/AUDIT_WEB_BUSINESS_LOGIC.md

Current validated operational state:

- governance compliant
- no active frontend business logic leakage confirmed

---

## LEGACY REFERENCES

Legacy files are retained for historical traceability only.

They are NOT operational runtime references.

- docs/legacy/web-architecture-upgrade-local-changes.patch

Role:

- historical migration artifact
- reference-only
- non-authoritative

---

# 6) WEB OPEN DOCS INITIAL CLASSIFICATION
# التصنيف الأولي للملفات المفتوحة في الويب

NOTE:

This section classifies currently open or transitional execution references inside the Web repository.

This classification is governance-oriented only.

No historical documents are removed or invalidated.

---

## HISTORICAL CRITICAL AUDITS

### docs/audit/AUDIT_WEB_BUSINESS_LOGIC_CRITICAL.md

Status:

HISTORICAL CRITICAL AUDIT REFERENCE

Reason:

This document represents a historical detection phase before later governance stabilization.

Current runtime governance validation is instead represented by:

- docs/audit/AUDIT_WEB_FINAL_REPORT.md
- docs/audit/AUDIT_WEB_BUSINESS_LOGIC.md

Current validated runtime state confirms:

- no active frontend business logic leakage
- governance-compliant render-only frontend behavior

---

## HISTORICAL PHASE START REFERENCES

### docs/phases/PHASE4_3_START.md

Status:

HISTORICAL PHASE START REFERENCE

Reason:

Phase later officially closed through:

- docs/phases/PHASE4_3_FINAL_CLOSURE.md
- docs/phases/PHASE4_3_UI_UNIFIED_CLOSURE.md

---

### docs/phases/PHASE4_4_START.md

Status:

DEFERRED / HISTORICAL START REFERENCE

Reason:

Current execution mode is Pilot Stabilization rather than new UX expansion execution.

---

## HISTORICAL EXECUTION CHECKLISTS

### docs/phases/PHASE5_CLOSURE_CHECKLIST.md

Status:

HISTORICAL EXECUTION CHECKLIST

Reason:

Phase 5 was later formally closed through:

- docs/phases/PHASE5_FINAL_CLOSURE.md

---

## ACTIVE ROADMAP REFERENCES

### docs/system/SYSTEM_EXECUTION_PLAN_LOCKED.md

Status:

ACTIVE ROADMAP REFERENCE

Reason:

Document still represents controlled evolution governance direction.

However:

It is NOT treated as immediate execution authority during Pilot Stabilization mode.

---

# 7) CURRENT WEB AUDIT OBSERVATIONS
# ملاحظات المراجعة الحالية

Current observations:

- Web documentation structure is organized.
- Governance layering already exists.
- API governance is clearly documented.
- Multi-tenant governance exists.
- UI governance exists.
- Deployment governance exists.
- Historical audit progression is traceable.
- Runtime governance direction is clear.

Additional future classification is still required.

---

# 8) CURRENT WEB EXECUTION MODE
# وضع تنفيذ الويب الحالي

Current execution mode:

Pilot Stabilization

Focus areas:

- Runtime validation
- Operational stability
- UI consistency
- Proxy governance enforcement
- Session stability
- Tenant isolation validation
- Pilot operational audit

Not currently allowed:

- Large UI rewrites
- Architectural redesign
- Direct Core access
- Frontend workflow engines
- Frontend business-state derivation

---

# 9) CURRENT FRONTEND GOVERNANCE PRIORITIES
# أولويات حوكمة الواجهة الحالية

Current priorities:

1. Runtime stability
2. API proxy discipline
3. Multi-tenant isolation
4. Session reliability
5. Operational consistency
6. Controlled UI evolution
7. Pilot readiness

---

# 10) FINAL GOVERNANCE STATEMENT
# البيان النهائي

Hawana HSE Web Admin is governed as part of a larger enterprise SaaS platform.

Frontend evolution must preserve:

- Stability
- Proxy discipline
- Backend authority
- Tenant isolation
- Operational consistency
- Architectural integrity

The frontend is treated as:

Governed Operational Interface Layer

Not as an isolated UI application.

---

END OF DOCUMENT