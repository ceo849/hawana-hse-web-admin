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

# 5) CURRENT WEB AUDIT OBSERVATIONS
# ملاحظات المراجعة الحالية

Current observations:

- Web documentation structure is organized.
- Governance layering already exists.
- API governance is clearly documented.
- Multi-tenant governance exists.
- UI governance exists.
- Deployment governance exists.

Additional future classification is still required.

---

# 6) CURRENT WEB EXECUTION MODE
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

# 7) CURRENT FRONTEND GOVERNANCE PRIORITIES
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

# 8) FINAL GOVERNANCE STATEMENT
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