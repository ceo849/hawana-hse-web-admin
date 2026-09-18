# HAWANA HSE — WEB SR-21 CONTROLLED PRODUCTION EVOLUTION FINAL CLOSURE

Document Type: Web Controlled Production Evolution Final Closure
Repository: hawana-hse-web-admin
Layer: Web Admin
Track: SR-21 — Controlled Web Production Evolution
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes / Evidence Before Closure
Status: CLOSED WITH VERIFIED PRODUCTION EVIDENCE
Formal Closure Date: 2026-09-18
Runtime Execution and Browser Confirmation Date: 2026-09-18

---

## 1) Purpose

This document formally closes SR-21 — Controlled Web Production Evolution.

It records the verified engineering evidence from:

- production baseline determination,
- source delta review,
- build and deployment-contract validation,
- immutable production candidate creation,
- controlled Web production replacement,
- real-browser regression discovery,
- bounded root-cause investigation,
- bounded SSR protocol correction,
- fixed candidate build and deployment,
- Safari production confirmation,
- final production state anchoring.

This document is documentation-only closure.

It does not authorize:

- additional production mutation,
- cleanup,
- rollback deletion,
- Core changes,
- database changes,
- Billing changes,
- Workflow changes,
- companyId changes,
- infrastructure redesign,
- or external pilot execution.

---

## 2) Governing Architecture

Mandatory architecture:

Web → API Proxy → Core → PostgreSQL

Required boundaries preserved during SR-21:

- Browser/UI uses internal `/api` routes.
- API Proxy owns communication toward Core.
- `serverAppFetch()` remains server-side.
- Direct UI → Core access remains prohibited.
- Backend remains source of truth.
- Authentication/session remains based on HttpOnly cookie boundaries.
- companyId authority remains JWT/backend-owned.
- Billing authority remains backend-owned.
- Workflow authority remains backend-owned.

SR-21 did not authorize architectural replacement.

Architecture disposition:

PRESERVED

---

## 3) SR-21 Scope

SR-21 was limited to controlled evolution of the Web production layer.

The governed sequence was:

1. SR-21A — Production Web Baseline & Source Delta Determination
2. SR-21B — Current Web Build & Deployment-Contract Readiness
3. SR-21C — Production Candidate Build & Registry Publication
4. SR-21D — Controlled Production Deployment, Regression Investigation, Bounded Fix, Verification, and Closure

Out of scope:

- Core feature evolution
- PostgreSQL schema evolution
- Prisma migration
- Billing redesign
- Workflow redesign
- companyId authority changes
- Nginx redesign
- Docker network redesign
- external pilot authorization

---

## 4) Pre-SR-21 Production Baseline

The Production Web baseline before SR-21 was the June 2026 controlled Web deployment.

Historical production Web image:

sha256:c9065201dca9abc28dcbe5739a3bd6fc530c32f3533b8b61cd1678d394cb26a5

Historical source anchor:

466cdfa99b0782891954fd226084675e996ad3ac

The historical Web runtime was preserved as a rollback asset during SR-21.

SR-21A determined that the current Web source had materially evolved since that production baseline and required controlled validation before deployment.

---

## 5) SR-21A — Production Baseline & Source Delta Determination

SR-21A established:

- current Web repository:
  `hawana-hse-web-admin`
- branch:
  `phase4.3-web-hardening`
- then-current source anchor:
  `10e5c9a6e832343d4e19092d4357d4482ecb38e9`
- historical Production source anchor:
  `466cdfa99b0782891954fd226084675e996ad3ac`
- source delta:
  38 commits
- changed files:
  42
- identified runtime surface:
  10 files

Architecture review established that the current Web source preserved the proxy-only architecture.

The reviewed source did not require restoration of direct browser/Core access.

SR-21A disposition:

PASS

---

## 6) SR-21B — Build & Deployment-Contract Readiness

The current Web source successfully completed local production build validation.

Result:

PASS

A local Docker validation image was built:

`hawana-hse-web:sr21b-local-validation`

Local image identity:

sha256:18c5b0b9f2bc11ff09c5ab64d8b06b0285e12cda19b70f6c5e8219e82d94e72d

A controlled local validation runtime was established without modifying Production.

The production runtime contract was reviewed.

Important finding:

`WEB_INTERNAL_BASE_URL` was not present in the verified Production Web environment.

At this stage, the source fallback behavior had not yet been demonstrated as a real-browser blocker.

Production was not modified during SR-21B.

SR-21B disposition:

TECHNICAL READINESS PASS

---

## 7) SR-21C — Initial Production Candidate

An immutable Production candidate was built from source:

10e5c9a6e832343d4e19092d4357d4482ecb38e9

Candidate tag:

`web-sr21-production-candidate-10e5c9a6-2026-09-18`

OCI index digest:

sha256:709d88e97f68cc42c6da58a709e663f406f552fab0a8439fccef754aba994f17

The candidate was published to the controlled Artifact Registry.

SR-21C disposition:

PASS

---

## 8) Initial SR-21D Production Replacement

The initial SR-21 candidate was pulled and verified on Production.

The previous June 2026 Production Web container was preserved as:

`hawana-web-pre-sr21-rollback`

Preserved container ID:

453eb89233775dd6bbc9397cb64d13aeebac4773cc3c48b0d6d7fa3944367631

Preserved image:

sha256:c9065201dca9abc28dcbe5739a3bd6fc530c32f3533b8b61cd1678d394cb26a5

The initial SR-21 candidate then became the active `hawana-web`.

Pre-fix SR-21 container ID:

3023f0290222d7f13297ec3436aefc79ca6f6c927e6cdb1c8f1eec0dc2a94afd

Pre-fix SR-21 image:

sha256:709d88e97f68cc42c6da58a709e663f406f552fab0a8439fccef754aba994f17

Internal authenticated Web API validation passed.

External HTTPS curl login and dashboard validation also passed.

However, real Safari browser validation identified a browser-path regression:

- login completed,
- dashboard navigation did not remain authenticated,
- browser returned to login.

Therefore curl/API success was not treated as sufficient evidence of browser-path correctness.

---

## 9) Browser Regression Evidence

Bounded Production investigation established a materially different server-side browser path.

The decisive pre-fix sequence observed through Nginx was:

1. Safari `POST /api/auth/login` → HTTP 200
2. server-side Node `GET /api/dashboard` → HTTP 301
3. redirected server-side `GET /api/dashboard` → HTTP 401
4. Safari `GET /dashboard` → HTTP 307
5. Safari `GET /login` → HTTP 200

Web runtime diagnostics also showed the SSR self-fetch target being constructed as:

`http://hawanaglobal.com/api/dashboard`

This evidence isolated the failure to the SSR self-fetch protocol reconstruction path rather than to login credential acceptance itself.

---

## 10) Root Cause Determination

The relevant `serverAppFetch` origin fallback reconstructed the request origin from the inbound host but hardcoded the scheme as HTTP when `WEB_INTERNAL_BASE_URL` was absent.

Historically, the old Production source also contained an HTTP fallback.

However, the historical runtime path prioritized direct Core access through `CORE_API_BASE_URL`.

After the proxy-only architecture correction, that direct Core path was removed.

As a result, the existing HTTP fallback became active in the current proxy-only SSR path.

In Production:

- external request scheme was HTTPS,
- SSR self-fetch reconstructed HTTP,
- Nginx redirected HTTP → HTTPS,
- authentication context was not preserved across that redirected server-side fetch,
- `/api/dashboard` returned 401,
- the dashboard session guard redirected the browser to login.

Root-cause classification:

CONFIRMED

The defect was therefore not classified as:

- a Core authentication defect,
- a PostgreSQL defect,
- a Billing defect,
- a Workflow defect,
- a companyId isolation defect,
- or a need to restore direct Core access.

---

## 11) Bounded SSR Protocol Fix

Founder authorization was granted for a bounded SSR protocol fix.

Only:

`src/lib/server-app-fetch.ts`

was changed.

The corrected origin reconstruction now honors forwarded request protocol and host:

- `x-forwarded-host`
- `x-forwarded-proto`

with a bounded HTTP fallback when forwarded protocol information is unavailable.

No direct Core path was reintroduced.

No Billing logic was changed.

No Workflow logic was changed.

No companyId logic was changed.

No Core code was changed.

No database change was made.

No Nginx configuration was changed.

The bounded fix therefore preserved the mandatory architecture.

---

## 12) Fix Verification

The bounded source fix passed:

- local Next.js production build,
- Docker image build,
- local fixed-runtime stability,
- bounded protocol-decision verification.

The protocol decision verification established:

Production-equivalent forwarded headers:

`https://hawanaglobal.com`

Local fallback:

`http://localhost:3107`

The isolated local Docker environment could not resolve the Production `hawana-core` Docker DNS name.

This was classified as an environment limitation of the isolated local validation context, not evidence that the bounded source correction failed.

---

## 13) Fix Git Provenance

The bounded fix was committed as:

aec995ffc77c477c9c052383d4be2300c4d4c4f6

Commit subject:

`fix(web): preserve forwarded protocol for SSR self-fetch`

Scope:

- one source file
- four insertions
- two deletions

The commit was pushed to:

`origin/phase4.3-web-hardening`

Local and remote source anchors were verified aligned at:

aec995ffc77c477c9c052383d4be2300c4d4c4f6

---

## 14) Fixed Production Candidate Provenance

Fixed candidate tag:

`web-sr21d-ssr-protocol-fix-aec995f-2026-09-18`

Registry:

`us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web`

Canonical OCI index digest:

sha256:07612da31c206c944310bef45c188a3668f1149c5b95cdc1a8052d5e566b57f0

linux/amd64 manifest:

sha256:c7ee5f9432ab749a9cd8ccb3565f98aa5d444b2aca70461d5709c86aa80afa7b

config:

sha256:e58c8329ba7d9202eb5e77dc80f5de55458fa10e33344a232c03b7a1b98f7f55

attestation:

sha256:c110e6cec44e38f3e980230e728a24e0d980d00a5bf92c771e4e3d5929c31952

The fixed candidate was pulled on Production and verified before replacement.

The active pre-fix Web container remained unchanged during the pull step.

---

## 15) Fixed Production Replacement

The fixed candidate was deployed through controlled Web-only replacement.

Active Production Web after replacement:

Container:

`hawana-web`

Container ID:

a8dbdc6d7dc08e9a715a2ace0bfe5787c80fb5c7adeaad298e2d222b274abc2e

Image:

sha256:07612da31c206c944310bef45c188a3668f1149c5b95cdc1a8052d5e566b57f0

Runtime state:

RUNNING

Restart count:

0

Network:

`hawanaglobal_default`

Restart policy:

`unless-stopped`

Port mapping:

`127.0.0.1:3005 → 3000`

The pre-fix SR-21 Web runtime was preserved as:

`hawana-web-pre-sr21d-fix-rollback`

Container ID:

3023f0290222d7f13297ec3436aefc79ca6f6c927e6cdb1c8f1eec0dc2a94afd

Image:

sha256:709d88e97f68cc42c6da58a709e663f406f552fab0a8439fccef754aba994f17

Status:

PRESERVED / NOT RUNNING

The historical June 2026 rollback also remained preserved.

No rollback asset was deleted.

---

## 16) Real-Browser Production Confirmation

After the fixed deployment, Safari browser validation succeeded.

The authenticated dashboard loaded and remained operational.

Production Nginx evidence showed the corrected path:

- server-side Node `/api/dashboard` → HTTP 200
- Safari `/dashboard` → HTTP 200

Additional real-browser navigation produced successful responses across Web areas including:

- Users
- Companies
- Sites / Projects
- Safety Reports
- Action Plans
- Billing
- Admin paths

The previous causal sequence:

HTTP 301 → HTTP 401 → dashboard redirect to login

was not observed in the captured post-fix browser path.

Browser authentication regression disposition:

CLOSED — PASS

---

## 17) Final Production State Anchor — 2026-09-18

Final read-only Production inspection established:

### Web

Container:

`hawana-web`

Container ID:

a8dbdc6d7dc08e9a715a2ace0bfe5787c80fb5c7adeaad298e2d222b274abc2e

Image:

sha256:07612da31c206c944310bef45c188a3668f1149c5b95cdc1a8052d5e566b57f0

Running:

true

Restart count:

0

Network:

`hawanaglobal_default`

Restart policy:

`unless-stopped`

Port:

`127.0.0.1:3005 → 3000`

Internal root:

HTTP 307

Internal health:

HTTP 200

External HTTPS root:

HTTP 307

External HTTPS health:

HTTP 200

The bounded recent Web log check produced no matching output for the selected error-pattern filter.

This bounded log observation is supporting evidence only and is not treated as proof of absence of all possible errors.

### Core

Container:

`hawana-core`

Container ID:

d142144923eeb5d6e8f04268ef9414e10e4911ca9be2ecd024c43fa1333f4189

Image:

sha256:6e914c3ca1c84458b1949b3679932dc6946c442dcdd95c2a548a0980a66ce230

Running:

true

Restart count:

0

Core remained unchanged by the SR-21D bounded Web fix.

### PostgreSQL

Container:

`hawana-postgres`

Container ID:

f9cd23a002bd2aef371c479e421d688851efe27e8c1c208736320d7a97ad902e

Image:

sha256:20edbde7749f822887a1a022ad526fde0a47d6b2be9a8364433605cf65099416

Running:

true

Restart count:

0

No database query or database mutation was performed by the final state-anchor step.

---

## 18) Rollback State At Closure

Two Web rollback layers remain preserved.

### Historical June 2026 rollback

Container:

`hawana-web-pre-sr21-rollback`

Container ID:

453eb89233775dd6bbc9397cb64d13aeebac4773cc3c48b0d6d7fa3944367631

Image:

sha256:c9065201dca9abc28dcbe5739a3bd6fc530c32f3533b8b61cd1678d394cb26a5

Running:

false

### SR-21 pre-fix rollback

Container:

`hawana-web-pre-sr21d-fix-rollback`

Container ID:

3023f0290222d7f13297ec3436aefc79ca6f6c927e6cdb1c8f1eec0dc2a94afd

Image:

sha256:709d88e97f68cc42c6da58a709e663f406f552fab0a8439fccef754aba994f17

Running:

false

Rollback execution:

NOT REQUIRED

Rollback cleanup:

NOT AUTHORIZED

---

## 19) Architecture and Protected-Domain Verification

SR-21 closure evidence supports the following:

Web → API Proxy → Core → PostgreSQL:

PRESERVED

Direct UI → Core access:

NOT INTRODUCED

Core modification by bounded SSR fix:

NO

Database modification by bounded SSR fix:

NO

Billing modification:

NO

Workflow modification:

NO

companyId authority modification:

NO

Nginx modification:

NO

Docker network modification:

NO

External pilot authorization:

NO

---

## 20) Mutation Accounting

Across the bounded SSR fix and fixed Web deployment:

Source modified:

YES — bounded `src/lib/server-app-fetch.ts` correction only.

Source committed:

YES

Source pushed:

YES

Production Web replaced:

YES — Founder-authorized controlled replacement.

Core modified:

NO

Database modified:

NO

Billing modified:

NO

Workflow modified:

NO

companyId logic modified:

NO

Nginx modified:

NO

Docker network modified:

NO

Rollback containers deleted:

NO

Docker prune performed:

NO

External pilot authorized:

NO

For the final SR-21D-11A state-anchor step specifically:

MODE:

READ-ONLY

Production modified:

NO

Database contacted:

NO

File deleted:

NO

Container deleted:

NO

Image deleted:

NO

Deployment performed:

NO

---

## 21) Residuals and Separate Tracks

The following items are not blockers to SR-21 closure but remain separate controlled matters.

### 21.1 Production Storage

Final observed root filesystem:

- Size: 29G
- Used: 24G
- Available: 5.7G
- Utilization: 81%

This is a capacity observation.

No Docker prune or cleanup is authorized by this closure.

### 21.2 Preserved Rollback Assets

Both Web rollback containers remain preserved.

Their cleanup requires separate authorization.

### 21.3 Local Validation Assets

Local SR-21 validation containers/images may remain on the development Mac.

Their cleanup is outside this closure.

### 21.4 Temporary Authentication Artifacts

Temporary authentication/session test artifacts may remain from controlled validation.

Their cleanup is a separate mutation and is not authorized by this document.

Their contents must not be exposed in documentation.

### 21.5 Login Response Token Exposure Finding

A separate security observation exists concerning the Web login proxy response returning an access token in JSON while also setting the HttpOnly authentication cookie.

This observation was not established as the cause of the SR-21D Safari regression.

It is not remediated by this closure.

It must be handled, if pursued, as a separate security review/remediation track.

### 21.6 Fresh-Environment Reproducibility

Previously recorded environment/provisioning residuals outside the Web SR-21D defect remain separate from this closure.

This document does not silently resolve unrelated Core or infrastructure residuals.

---

## 22) Scientific and Evidentiary Boundaries

This closure distinguishes between:

- verified runtime evidence,
- verified source evidence,
- deployment provenance,
- bounded observations,
- and unresolved/separate residuals.

A successful curl request was not treated as sufficient evidence of browser correctness after Safari demonstrated contradictory runtime behavior.

The browser regression was closed only after:

- the failing browser/server sequence was observed,
- the SSR protocol reconstruction cause was isolated,
- the bounded source correction was implemented,
- the corrected candidate was deployed,
- Safari functionality was confirmed,
- server-side `/api/dashboard` returned HTTP 200,
- browser `/dashboard` returned HTTP 200,
- and the final Production state was independently anchored.

No claim in this closure should be interpreted as proof beyond the tested and observed scope.

---

## 23) Closure Decision

SR-21A:

CLOSED — PASS

SR-21B:

CLOSED — TECHNICAL READINESS PASS

SR-21C:

CLOSED — PASS

SR-21D browser regression:

CLOSED — PASS

SR-21 overall controlled Web production evolution:

CLOSED WITH VERIFIED PRODUCTION EVIDENCE

Production Web:

VERIFIED / STABLE AT FINAL STATE ANCHOR

Core:

VERIFIED / STABLE AT FINAL STATE ANCHOR

PostgreSQL:

VERIFIED / STABLE AT FINAL STATE ANCHOR

Architecture:

PRESERVED

Rollback capability:

PRESERVED

External real pilot:

NOT AUTHORIZED

---

## 24) What This Closure Does Not Authorize

This closure does not authorize:

- deletion of either rollback container,
- deletion of Docker images,
- Docker prune,
- deletion of environment backups,
- deletion of temporary authentication artifacts,
- cleanup of local validation assets,
- Core deployment,
- PostgreSQL restart,
- database modification,
- Billing modification,
- Workflow modification,
- companyId modification,
- Nginx modification,
- Docker network modification,
- new Web feature development,
- external pilot execution.

Any such action requires a separate controlled decision and, where mutating, explicit Founder Authorization.

---

## 25) Next Controlled Documentation Step

After Founder review and acceptance of this closure document, the next documentation step is a separate:

Web Current State Anchor after SR-21 Controlled Production Evolution Closure.

Expected future document:

`docs/deployment/WEB_CURRENT_STATE_AFTER_SR21_CONTROLLED_PRODUCTION_EVOLUTION_CLOSURE_2026_09_18.md`

That document must not be created merely by this closure document.

Its creation requires a separate controlled documentation step.

No runtime action is required to review this closure.

---

## 26) Safety Confirmation

Creation of this document changes documentation only.

This document creation does not itself:

- modify Production,
- start or stop a container,
- delete a container,
- delete an image,
- run Docker prune,
- modify Nginx,
- modify Core,
- contact or modify the database,
- modify Billing,
- modify Workflow,
- modify companyId logic,
- deploy software,
- or authorize an external pilot.

Was anything deleted by creating this closure document?

NO

---

END OF DOCUMENT
