# HAWANA HSE — WEB LOCAL RUNTIME REFRESH PHASE A CANDIDATE EVIDENCE
# دليل تنفيذ Phase A — Web Candidate Runtime فقط

Document Type: Runtime Evidence  
Project: Hawana HSE Web Admin  
Date: 2026-05-31  
Status: PHASE A CANDIDATE CREATED — SWITCH NOT STARTED  

---

## 1) Purpose

This document records the controlled Web-only local runtime refresh Phase A.

The goal was to build and run a new Web candidate container from the fixed source without stopping or removing theme.

---

## 2) Execution Type

Execution type:

WEB LOCAL RUNTIME REFRESH — PHASE A CANDIDATE ONLY

Approved scope:

- Build Web image only
- Run candidate Web container only
- Use temporary local port 3006
- Keep current Web container running on port 3005
- No Core rebuild
- No Core restart
- No Database action
- No Docker Compose usage

---

## 3) Source Baseline

Current branch:

phase4.3-web-hardening

Current validated source tag:

web-runtime-pre-refresh-evidence-2026-05-31

Source fixes confirmed before build:

- Dashboard quick action visibility corrected
- Safety Reports create action hidden for VIEWER
- Safety Report detail create/edit actions hidden for unauthorized roles
- Action Plan detail status/edit actions aligned with UI visibility policy

---

## 4) Candidate Image

Candidate image tag:

hawana-hse-web-admin:local-rbac04-refresh-2026-05-31

Build mode:

docker build --no-cache

Docker Compose:

NOT USED

Build result:

PASSED

Generated image:

sha256:74d5dbdc842c6a636e79dfccfec7f4bfff2c6ca8de1d5b8e589878d6377981

---

## 5) Candidate Container

Candidate container name:

hawana-web-candidate-rbac04-2026-05-31

Candidate container id:

f89be07c396568e357ba5e5eea273b1d7fbca6229f9dbada34d98dd98413ec78

Candidate runtime port:

3006 → 3000

Candidate network:

hawana-hse-core_default

Candidate environment:

- NODE_ENV=production
- NEXT_PUBLIC_API_BASE_URL=/api
- NEXT_PUBLIC_API_PREFIX=/v1
- CORE_API_BASE_URL=http://hawana-core:3001
- DOCKER_ENV=true

---

## 6) Current Runtime Preservation

Current production-like local Web container:

hawana-web

Current Web port:

3005 → 3000

Current Web status during Phase A:

RUNNING

Current Web container stopped:

NO

Current Web container removed:

NO

Current Web image overwritten:

NO

---

## 7) Candidate Source Verification

Candidate compiled runtime was checked.

Confirmed corrected compiled behavior:

Dashboard quick action:

+ Action Plan (from Report)

Candidate compiled roles:

OWNER, ADMIN, MANAGER

Old stale runtime role list not prt for the candidate dashboard action.

Candidate source file also confirmed:

app/dashboard/page.tsx

Corrected source role list:

OWNER, ADMIN, MANAGER

---

## 8) Smoke Test Result

Candidate login endpoint:

http://localhost:3006/login

Result:

HTTP 200 OK

Candidate dashboard endpoint:

http://localhost:3006/dashboard

Result:

HTTP 307 Temporary Redirect to /login?next=%2Fdashboard

This is expected for unauthenticated access.

Original Web login endpoint:

http://localhost:3005/login

Result:

HTTP 200 OK

This confirms the original Web runtime remained available.

---

## 9) Architecture Confirmation

Architecture remains unchanged:

Web → API Proxy → Core

No direct Core call introduced.

No API route change.

No API contract change.

No Backend business logic change.

---

## 10) Explicit Non-Changes

Core rebuild:

NO

Core restart:

NO

Core code change:

NO

Database query:

NO

Database mutation:

NO

Billing change:

NO

companyId change:

NO

Workflow change:

NO

Docker Compose:

NOT USProduction deployment:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

---

## 11) Current Decision

Phase A candidate runtime:

PASSED

Candidate browser observation:

PENDING

Switch from 3005 to refreshed Web runtime:

NOT STARTED

Next valid action:

Perform browser observation on http://localhost:3006 using VIEWER account.

Was anything deleted?

NO
