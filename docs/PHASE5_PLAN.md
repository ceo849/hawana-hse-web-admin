# HAWANA HSE — PHASE 5 PLAN
## Production Hardening & Observability

Document Type: Engineering Execution Plan  
Scope: Core + Web + Infrastructure  
Mode: Additive Only / No Breaking Changes  
Status: READY FOR EXECUTION  

--------------------------------------------------
## 1) EXECUTIVE SUMMARY
--------------------------------------------------

هدف Phase 5:

تحويل النظام من:
Stable System

إلى:
Production-Grade Observable System

بدون:
- أي تعديل على الـ Architecture
- أي تغيير في الـ Contracts
- أي تأثير على Billing / companyId / Workflow

المبدأ:
Enhance visibility — NOT change behavior

--------------------------------------------------
## 2) NON-NEGOTIABLE RULES
--------------------------------------------------

Architecture (STRICT):
Web → API Proxy → Core → DB

✔ استخدام serverAppFetch فقط  
❌ ممنوع أي direct Core access  
❌ ممنوع bypass /api  

Core Protection:
❌ لا تعديل على main.tsd  
❌ Workflow  

Execution:
✔ Additive only  
✔ No breaking changes  
✔ Backend = source of truth  
✔ Fix root cause only  

--------------------------------------------------
## 3) PHASE 5 OBJECTIVES
--------------------------------------------------

### 1) Observability
- Logs (Structured)
- Request tracing
- Error visibility

### 2) Monitoring
- Health checks
- Metrics (system + business)

### 3) Stability Insight
- Detect failures early
- Detect latency issues

### 4) Production Readiness
- Clear system visibility
- Debug capability بدون الدخول في DB

--------------------------------------------------
## 4) PHASE 5 MODULES
--------------------------------------------------

### 5.1 Logging Hardening (Core)

هدف:
تحسين جودة logs بدون تغيير behavior

يشمل:
- Request ID propagation
- Structured logs (JSON)
- Correlation بين requests

ممنوع:
- تغيير logic
- تغيير response

---

### 5.2 API Observability Layer

هدف:
رؤية كاملة ل Health System

Endpoints:

- /v1/health        → basic
- /v1/health/ready  → DB + dependencies

Validation:
✔ DB connected  
✔ App responsive  

---

### 5.4 Metrics Layer (Prometheus-Ready)

يشمل:
- Request count
- Error rate
- Latency

مهم:
✔ Internal only  
✔ لا يكسر security model  

---

### 5.5 Web Visibility Layer

في Web Admin:

- Platform metrics page
- Status indicators

بدون:
❌ direct Core access  
✔ فقط عبر /api  

---

### 5.6 Error Tracking (Safe)

يشمل:
- Centralized error logs
- No sensitive data leakage

---

--------------------------------------------------
## 5) EXECUTION ORDER (STRICT)
--------------------------------------------------

1) Logging Hardening  
2) Request Tracing  
3) Health Validation  
4) Metrics Layer  
5) Web Metrics UI  
6) Error Tracking  

❌ ممنوع تغيير الترتيب  

--------------------------------------------------
## 6) DEFINITION O 5 تعتبر مغلقة عندما:

✔ كل request لديه Request ID  
✔ يمكن تتبع أي request end-to-end  
✔ Health endpoints تعمل  
✔ Metrics متاحة  
✔ لا يوجد أي violation في architecture  
✔ لا يوجد أي breaking change  

--------------------------------------------------
## 7) RISKS & CONTROLS
--------------------------------------------------

### Risk 1:
كسر المعمارية

Control:
- enforce API Proxy
- مراجعة كل fetch

---

### Risk 2:
تسريب بيانات حساسة

Control:
- sanitize logs
- no tokens in logs

---

### Risk 3:
زيادة التعقيد

Control:
- minimal implementation
- no over-engineering

---

--------------------------------------------------
## 8) OUT OF SCOPE
--------------------------------------------------

❌ No Billing changes  
❌ No AI integration  
❌ No Workflow changes  
❌ No DB schema changes  
❌ No UI redesign  

--------------------------------------------------
## 9) FINAL DECLARATIOtoring

WITHOUT:
Changing system behavior
