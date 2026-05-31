# HAWANA HSE — WEB DIRECT CORE URL SIGNAL CLASSIFICATION
# تصنيف إشارة Direct Core URL داخل Web Admin

Document Type: Architecture Signal Classification
Project: Hawana HSE Web Admin
Repository: hawana-hse-web-admin
Date: 2026-05-31
Status: LEGACY UNUSED SIGNAL CLASSIFIED — RUNTIME VIOLATION NOT PROVEN

─────────────────────────────────────
## 1) Purpose
─────────────────────────────────────

This document classifies the direct Core URL signal found during final Web local runtime switch closure verification.

The purpose is to determine whether the signal represents an active architecture violation or an unused legacy risk.

Required architecture:

Web → API Proxy → Core

Mandatory Web rule:

UI and server-rendered Web pages must use serverAppFetch with /api paths only.

─────────────────────────────────────
## 2) Signal Detected
─────────────────────────────────────

Detected file:

lib/core-api.ts

Detected direct Core fallback:

http://127.0.0.1:3001

Detected function:

api(path: string)

Risk type:

Potential direct Core URL helper.

Initial concern:

The helper could bypass the Web → API Proxy → Core boundary if imported by UI or page code.

─────────────────────────────────────
## 3) Read-Only Inspection Result
─────────────────────────────────────

Inspection mode:

READ ONLY

Runtime mutation:

NOT PERFORMED

File mutation:

NOT PERFORMED

Build:

NOT PERFORMED

Container action:

NOT PERFORMED

Core touch:

NOT PERFORMED

DB touch:

NOT PERFORMED

Search scope:

app
components
src
lib

Search result:

No active import or usage of lib/core-api.ts was found.

No active import pattern referencing '@/lib/core-api' was found.

No active import pattern referencing core-api was found.

─────────────────────────────────────
## 4) Active Web Data Access Pattern
─────────────────────────────────────

Observed active page-level pattern:

serverAppFetch

Observed Web page calls:

/api/dashboard
/api/users
/api/companies
/api/action-plans
/api/safety-reports
/api/sites-projects
/api/billing
/api/audit-logs

Classification:

Pages and server-rendered Web routes are using /api proxy paths through serverAppFetch.

This preserves:

Web → API Proxy → Core

─────────────────────────────────────
## 5) API Proxy Fetch Classification
─────────────────────────────────────

Direct fetch calls were found inside:

app/api/*/route.ts

Classification:

ACCEPTABLE

Reason:

These files are API Proxy routes.

API Proxy routes are allowed to call Core through CORE_API_BASE_URL.

This is the intended architecture:

Web page → /api route → Core

The existence of fetch() inside app/api route handlers is not a UI-to-Core violation.

─────────────────────────────────────
## 6) Guarded Files
─────────────────────────────────────

src/lib/api-client.ts contains an architecture guard blocking:

- Absolute URLs
- http://
- https://
- :3001

src/lib/server-app-fetch.ts contains an architecture guard blocking:

- Absolute URLs
- http://
- https://
- :3001
- non-/api paths

Classification:

Architecture guard exists and is active in the current Web access path.

─────────────────────────────────────
## 7) Legacy File Classification
─────────────────────────────────────

File:

lib/core-api.ts

Classification:

LEGACY UNUSED ARCHITECTURE-RISK FILE

Runtime violation:

NOT PROVEN

Active UI usage:

NOT FOUND

Active server page usage:

NOT FOUND

Active API route dependency:

NOT FOUND

Immediate deletion:

NOT APPROVED

Reason deletion is not approved:

Deletion is not required for the current runtime closure and could introduce unnecessary risk if an external or future reference exists.

Recommended treatment:

Keep file unchanged for now and classify as controlled legacy risk.

Future allowed action:

Open a separate additive cleanup plan if the team later decides to deprecate or remove unused legacy helpers.

─────────────────────────────────────
## 8) Runtime Switch Closure Impact
─────────────────────────────────────

Does this signal block Web local runtime switch closure?

NO

Reason:

The active runtime and active source usage remain aligned with Web → API Proxy → Core.

Does this signal prove direct UI to Core?

NO

Does this signal require rollback?

NO

Does this signal require Core change?

NO

Does this signal require DB change?

NO

Does this signal require Billing change?

NO

Does this signal require companyId change?

NO

Does this signal require Workflow change?

NO

─────────────────────────────────────
## 9) Final Classification
─────────────────────────────────────

Direct Core URL signal:

CONFIRMED

Active runtime violation:

NOT PROVEN

Active import or usage:

NOT FOUND

File classification:

LEGACY UNUSED ARCHITECTURE-RISK FILE

Architecture status:

Web → API Proxy → Core PRESERVED

Runtime switch closure:

NOT BLOCKED

Code change required now:

NO

Deletion approved:

NO

Production deployment:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

Was anything deleted?

NO
