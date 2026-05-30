# HAWANA HSE — FIRST PILOT LOCAL WEB RUNTIME UNAVAILABLE BLOCKER EVIDENCE

Document Type: Local Web Runtime Unavailable Blocker Evidence
Repository: hawana-hse-web-admin
Date: 2026-05-30
Status: BLOCKER RECORDED — LOCAL WEB RUNTIME NOT AVAILABLE
Mode: Stability First / Evidence Only / No Code Change / No Data Chang--

## 1) Purpose

This document records the blocker encountered during controlled local session cookie creation.

The approved execution attempted to use the Web API Proxy path only.

Approved path:

Web → API Proxy → Core

Approved login route:

POST /api/auth/login

Approved local Web URL:

http://localhost:3005

The execution failed before authentication because the local Web runtime was not available.

---

## 2) Source Approval

Primary source approval:

- docs/FIRST_PILOT_CONTROLLED_LOCAL_SESSION_COOKIE_CREATION_EXECUTION_APPROVAL_2026_05_30.md

Approved next action from source approval:

EXECUTE CONTROLLED LOCAL SESSION COOKIE CREATION LOCAL ONLY

---

## 3) Observed Runtime State

Browser result:

localhost refused to connect

Browser error:

ERR_CONNECTION_REFUSED

Terminal result:

PORT_3005_NOT_LISTENING

HTTP result:

web_http_status=000

Curl result:

Failed to connect to localhost port 3005

Docker result:

Cannot connect to the Docker daemon

Docker daemon state:

NOT AVAILABLE

---

## xecution Result

Controlled local session cookie creation:

EXECUTED

Execution result:

BLOCKED

Blocker:

LOCAL WEB RUNTIME NOT AVAILABLE

Secondary blocker:

DOCKER DAEMON NOT RUNNING OR NOT ACCESSIBLE

API Proxy login route reached:

NO

Core reached:

NO

Database reached:

NO

Cookie jar valid:

NO

Access token cookie present:

NO

Refresh token cookie present:

NO

---

## 5) Architecture Assessment

Architecture path:

Web → API Proxy → Core

Architecture deviation:

NO

Direct Core call:

NO

Direct DB query:

NO

The failure occurred before the application architecture path could be exercised because Web API Proxy was unavailable locally.

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

Docker restart:

NO

Docker compose execution:

NO

Direct Core call:

NO

Direct DB query:

NO

Password output:

NO

Token output:

NO

Full cookie output:

NO

---

## 7) Finalcker Evidence Decision

## 7) Final Blocker Evidence Decision

Local Web runtime availability:

NOT AVAILABLE

Port 3005:

NOT LISTENING

Docker daemon:

NOT ACCESSIBLE

Controlled local session cookie creation:

BLOCKED

Approved route:

POST /api/auth/login

Architecture path:

Web → API Proxy → Core

Additional role users existence discovery:

NOT STARTED

Evidence status:

BLOCKED

Next valid action:

CREATE CONTROLLED LOCAL WEB RUNTIME STARTUP APPROVAL

Was anything deleted?

NO
