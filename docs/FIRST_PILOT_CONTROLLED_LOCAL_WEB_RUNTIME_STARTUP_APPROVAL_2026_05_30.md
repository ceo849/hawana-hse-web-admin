# HAWANA HSE — FIRST PILOT CONTROLLED LOCAL WEB RUNTIME STARTUP APPROVAL

Document Type: Controlled Local Web Runtime Startup Approval
Repository: hawana-hse-web-admin
Date: 2026-05-30
Status: APPROVAL CREATED — LOCAL WEB RUNTIME STARTUP APPROVED FOR NEXT STEP ONLY
Mode: Stability First / Governance Only / No Code Change / No Data ge

---

## 1) Purpose

This document records the explicit approval boundary for controlled local Web runtime startup.

The previous controlled local session cookie creation was blocked because the local Web runtime was not available.

Observed blocker:

LOCAL WEB RUNTIME NOT AVAILABLE

Observed port state:

PORT 3005 NOT LISTENING

Observed Docker state:

DOCKER DAEMON NOT ACCESSIBLE

The purpose of this approval is to allow controlled startup or availability restoration of the local Web runtime only.

---

## 2) Source Evidence

Primary source blocker evidence:

- docs/FIRST_PILOT_LOCAL_WEB_RUNTIME_UNAVAILABLE_BLOCKER_EVIDENCE_2026_05_30.md

Primary approved path after startup:

Web → API Proxy → Core

Primary required route after startup:

POST /api/auth/login

---

## 3) Approved Scope

Approved execution:

CONTROLLED LOCAL WEB RUNTIME STARTUP ONLY

Approved environment:

LOCAL ONLY

Approved target:

localhost:3005

Approved purpose:

Restore local Web API Proxy availability for controlled local sen cookie creation.

Approved checks after startup:

- port 3005 listener check
- local Web HTTP response check
- Web API Proxy route availability check

---

## 4) Explicitly Not Approved

The following are not approved:

- code change
- database mutation
- user creation
- role creation
- companyId modification
- Billing change
- Workflow change
- production deployment
- production validation
- first real pilot validation
- Docker volume deletion
- Docker prune
- destructive cleanup
- direct Core call
- direct DB query
- changing ports
- changing environment values
- modifying docker-compose files
- modifying application files

---

## 5) Runtime Boundary

Allowed runtime actions:

- open Docker Desktop if closed
- check Docker daemon availability
- start existing local Web runtime using existing project configuration only
- verify localhost:3005 availability

Not allowed runtime actions:

- rebuild images unless separately approved
- restart production
- delete containers
- delete volumes
- prune Docker resources
- change docker-compose configuration
- change .env files
- bypass Web API Proxy

---

## 6) Safety Result

Code change:

NO

Database mutation:

NO

User creation:

NO

Role creation:

NO

companyId modification:

NO

Billing change:

NO

Workflow change:

NO

Docker destructive action:

NO

Docker volume deletion:

NO

Docker prune:

NO

Direct Core call:

NO

Direct DB query:

NO

---

## 7) Final Approval Decision

Controlled local Web runtime startup approval:

CREATED

Approved action:

CONTROLLED LOCAL WEB RUNTIME STARTUP ONLY

Approved environment:

LOCAL ONLY

Approved target:

localhost:3005

Architecture path after startup:

Web → API Proxy → Core

Production validation:

NOT APPROVED

First real pilot validation:

NOT APPROVED

Destructive Docker action:

NOT APPROVED

Next valid action:

EXECUTE CONTROLLED LOCAL WEB RUNTIME STARTUP LOCAL ONLY

Was anything deleted?

NO
