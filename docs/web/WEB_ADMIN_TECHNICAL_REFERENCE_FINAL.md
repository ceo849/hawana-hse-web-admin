# HAWANA HSE — WEB ADMIN TECHNICAL REFERENCE (FINAL)
# المرجع التقني الكامل للويب

Document Type: TECHNICAL REFERENCE  
Layer: Web Admin (Next.js App Router)  
Architecture: Web → API Proxy → Core  
Mode: Stability First / Additive Only / No Breaking Changes  
Status: FINAL (Authoritative Source of Truth)

────────────────────────────────────────────
## 1) PURPOSE | الهدف
────────────────────────────────────────────

EN:
Defines the authoritative behavior of the Web Admin layer.
Ensures zero business logic leakage and strict alignment with Core backend.

AR:
يحدد السلوك المعتمد لطبقة الويب ويمنع تسرب منطق البزنس خارج الكور، مع ضمان التوافق الكامل مع الـ Core.

────────────────────────────────────────────
## 2) ARCHITECTURE | المعمارية
────────────────────────────────────────────

UI (Next.js / React)
→ /api (Next.js Route Handlers)
→ Core API (NestJS)
→ Database

RULE:
- ❌ Direct calls to Core from UI are forbidden
- ✔ All calls MUST go through `/api/*`

────────────────────────────────────────────
## 3) CORE PRINCIPLES
────────────────────────────────────────────

✔ Backend = Source of Truth  
✔ UI = Render Layer only  
✔ No business logic in UI  
✔ No workflow control in UI  
✔ No aggregation in UI  
✔ API Proxy only  

────────────────────────────────────────────
## 4) AUTHENTICATION FLOW
────────────────────────────────────────────

✔ Access Token stored in HttpOnly Cookie  
✔ UI cannot access token directly  
✔ Server reads token via `cookies()`  

FLOW:
1) User logs in → cookie is set  
2) `/api` reads cookie  
3) `/api` forwards request with Authorization header  

────────────────────────────────────────────
## 5) API PROXY RULES
────────────────────────────────────────────

All requests must go through:

/app/api/*

EXAMPLES:

// ✔ Correct
await fetch('/api/users')

// ❌ Forbidden
await fetch('http://core-api/v1/users')

────────────────────────────────────────────
## 6) DATA HANDLING RULES
────────────────────────────────────────────

✔ UI renders data only  
✔ UI formats data for display only  

❌ Forbidden in UI:
- status calculation  
- workflow transitions  
- business decisions  
- aggregation logic  

────────────────────────────────────────────
## 7) MULTI-TENANT ISOLATION
────────────────────────────────────────────

✔ companyId comes ONLY from JWT (Core)

❌ UI must NEVER:
- send companyId
- read companyId from user input
- manipulate tenant context

FLOW:
JWT → Core → DB

────────────────────────────────────────────
## 8) ERROR HANDLING
────────────────────────────────────────────

✔ Errors originate from Core  
✔ UI displays errors only  

❌ UI must NOT:
- interpret business errors  
- modify backend error meaning  

────────────────────────────────────────────
## 9) PERFORMANCE RULES
────────────────────────────────────────────

✔ No heavy computation in UI  
✔ No aggregation in UI  
✔ Keep UI lightweight  

────────────────────────────────────────────
## 10) SECURITY RULES
────────────────────────────────────────────

✔ HttpOnly Cookies only  
✔ No localStorage for tokens  
✔ No sessionStorage for tokens  
✔ No exposing tokens to client-side JS  

────────────────────────────────────────────
## 11) FORBIDDEN PATTERNS
────────────────────────────────────────────

❌ Direct Core API calls  
❌ Business logic inside components  
❌ Workflow/state machines in UI  
❌ companyId usage in UI  
❌ Token storage in browser  

────────────────────────────────────────────
## 12) ALLOWED PATTERNS
────────────────────────────────────────────

✔ Server-side API proxy (`/api/*`)  
✔ Pure rendering components  
✔ UI-level filtering for display only  
✔ Stateless components  

────────────────────────────────────────────
## 13) FINAL RULE
────────────────────────────────────────────

If UI contains business logic → it is WRONG  

UI must only render what backend decides.

────────────────────────────────────────────
STATUS: FINAL
────────────────────────────────────────────