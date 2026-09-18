# HAWANA HSE — WEB CURRENT STATE AFTER SR-21 CONTROLLED PRODUCTION EVOLUTION CLOSURE
# حالة الويب الحالية بعد إغلاق SR-21 للتطوير الإنتاجي المنضبط

Document Type: Web Current State Anchor
Repository: hawana-hse-web-admin
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Date: 2026-09-18
Status: CURRENT WEB STATE LOCKED AFTER SR-21 CONTROLLED PRODUCTION EVOLUTION CLOSURE

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document is the current-state anchor for the Hawana HSE Web Admin layer after closure of SR-21 Controlled Production Evolution.

It must be read before any future Web deployment, Web cleanup, Web security remediation, Web pilot-readiness work, or Web engineering continuation.

This document does not replace the SR-21 Final Closure or historical evidence.

Canonical SR-21 closure:

docs/deployment/WEB_SR21_CONTROLLED_PRODUCTION_EVOLUTION_FINAL_CLOSURE_2026_09_18.md

This document records the accepted current state from which subsequent controlled Web work must begin.

────────────────────────────────────────────
2) CURRENT GIT STATE
────────────────────────────────────────────

Repository:

hawana-hse-web-admin

Branch:

phase4.3-web-hardening

Current accepted commit:

c86250c10335445ecb1317da6356f7eb96fca570

Current accepted commit message:

docs: close SR-21 controlled production evolution

Remote alignment:

origin/phase4.3-web-hardening verified aligned with the current accepted commit.

Local / remote parity:

0 / 0

Working tree after SR-21 Formal Closure push verification:

CLEAN

SR-21 bounded SSR protocol fix source commit:

aec995ffc77c477c9c052383d4be2300c4d4c4f6

────────────────────────────────────────────
3) CURRENT WEB PRODUCTION STATE
────────────────────────────────────────────

SR-21 overall state:

CLOSED WITH VERIFIED PRODUCTION EVIDENCE

Production Web state:

VERIFIED / STABLE AT FINAL STATE ANCHOR

Active Web container:

hawana-web

Active Web container ID:

a8dbdc6d7dc08e9a715a2ace0bfe5787c80fb5c7adeaad298e2d222b274abc2e

Active Web image:

sha256:07612da31c206c944310bef45c188a3668f1149c5b95cdc1a8052d5e566b57f0

Source commit represented by the fixed production candidate:

aec995ffc77c477c9c052383d4be2300c4d4c4f6

Container running:

true

Restart count:

0

Docker network:

hawanaglobal_default

Restart policy:

unless-stopped

Port mapping:

127.0.0.1:3005 → 3000

Final observed internal root:

HTTP 307

Final observed internal health:

HTTP 200

Final observed external HTTPS root:

HTTP 307

Final observed external HTTPS health:

HTTP 200

Real-browser Safari confirmation after the bounded SSR protocol fix:

PASSED

The prior HTTP → HTTPS SSR self-fetch regression sequence was no longer observed after the corrected candidate was deployed.

No claim in this anchor extends beyond the tested and observed SR-21 scope.

────────────────────────────────────────────
4) CURRENT CORE STATE
────────────────────────────────────────────

Core container:

hawana-core

Core container ID:

d142144923eeb5d6e8f04268ef9414e10e4911ca9be2ecd024c43fa1333f4189

Core image:

sha256:6e914c3ca1c84458b1949b3679932dc6946c442dcdd95c2a548a0980a66ce230

Running:

true

Restart count:

0

Core remained unchanged by the bounded SR-21D Web fix.

No Core deployment was performed by the SR-21D bounded Web fix.

────────────────────────────────────────────
5) CURRENT POSTGRESQL STATE
────────────────────────────────────────────

PostgreSQL container:

hawana-postgres

PostgreSQL container ID:

f9cd23a002bd2aef371c479e421d688851efe27e8c1c208736320d7a97ad902e

PostgreSQL image:

sha256:20edbde7749f822887a1a022ad526fde0a47d6b2be9a8364433605cf65099416

Running:

true

Restart count:

0

No database query or database mutation was performed by the final SR-21 state-anchor inspection.

No database migration was required by the bounded Web fix.

────────────────────────────────────────────
6) CURRENT ROLLBACK STATE
────────────────────────────────────────────

Two Web rollback layers remain preserved.

Historical June 2026 rollback:

Container:
hawana-web-pre-sr21-rollback

Container ID:
453eb89233775dd6bbc9397cb64d13aeebac4773cc3c48b0d6d7fa3944367631

Image:
sha256:c9065201dca9abc28dcbe5739a3bd6fc530c32f3533b8b61cd1678d394cb26a5

Running:
false

SR-21 pre-fix rollback:

Container:
hawana-web-pre-sr21d-fix-rollback

Container ID:
3023f0290222d7f13297ec3436aefc79ca6f6c927e6cdb1c8f1eec0dc2a94afd

Image:
sha256:709d88e97f68cc42c6da58a709e663f406f552fab0a8439fccef754aba994f17

Running:
false

Rollback execution:

NOT REQUIRED

Rollback capability:

PRESERVED

Rollback cleanup:

NOT AUTHORIZED

────────────────────────────────────────────
7) ARCHITECTURE STATE
────────────────────────────────────────────

Mandatory architecture:

Web → API Proxy → Core → PostgreSQL

Current architecture status:

PRESERVED

Browser / UI Core access:

API Proxy boundary preserved.

Direct UI → Core access:

NOT INTRODUCED

Backend source of truth:

PRESERVED

companyId authority:

JWT / Backend only

Billing authority:

Backend only

Workflow authority:

Backend only

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

────────────────────────────────────────────
8) SR-21 VALIDATION AND CLOSURE STATE
────────────────────────────────────────────

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

────────────────────────────────────────────
9) CURRENT RESIDUALS AND SEPARATE TRACKS
────────────────────────────────────────────

Production root filesystem at final observation:

Size: 29G
Used: 24G
Available: 5.7G
Utilization: 81%

Classification:

CAPACITY OBSERVATION — NOT AN SR-21 CLOSURE BLOCKER

Docker prune or storage cleanup:

NOT AUTHORIZED

Preserved rollback asset cleanup:

NOT AUTHORIZED

Local SR-21 validation containers/images may remain on the development Mac.

Their cleanup is outside SR-21 closure and requires a separate controlled decision where mutation is involved.

Temporary authentication/session test artifacts may remain from controlled validation.

Their cleanup is not authorized by this anchor.

Their contents must not be exposed in documentation.

Separate security observation:

The Web login proxy response was observed returning an access token in JSON while also setting the HttpOnly authentication cookie.

This was not established as the cause of the Safari regression.

It was not remediated by SR-21 closure.

Any review or remediation must proceed as a separate controlled security track.

Previously recorded fresh-environment / provisioning reproducibility residuals outside the Web SR-21 defect remain separate and are not silently resolved by this anchor.

────────────────────────────────────────────
10) SCIENTIFIC AND EVIDENTIARY BOUNDARY
────────────────────────────────────────────

This current-state anchor records only established SR-21 evidence.

Successful curl behavior alone is not treated as proof of browser correctness.

The Safari regression was considered closed only after the failing sequence was observed, the SSR protocol reconstruction cause was isolated, the bounded correction was implemented and deployed, Safari functionality was confirmed, and the final Production state was anchored.

No statement in this document should be interpreted as proof beyond the tested and observed scope.

────────────────────────────────────────────
11) CURRENT OPEN / CONTROLLED ITEMS
────────────────────────────────────────────

Production storage management:

OPEN — SEPARATE CONTROLLED TRACK

Rollback container cleanup:

OPEN — NOT AUTHORIZED

Local validation asset cleanup:

OPEN — NOT AUTHORIZED

Temporary authentication artifact cleanup:

OPEN — NOT AUTHORIZED

Login response access-token exposure review/remediation:

OPEN — SEPARATE SECURITY TRACK

Fresh-environment provisioning reproducibility:

OPEN — SEPARATE TRACK

First real external pilot:

NOT AUTHORIZED

Pilot execution:

NOT AUTHORIZED

────────────────────────────────────────────
12) FORBIDDEN NEXT ACTIONS WITHOUT SEPARATE APPROVAL
────────────────────────────────────────────

The following are not authorized by this current-state anchor:

- Delete either preserved rollback container
- Delete Docker images
- Run Docker prune
- Delete Docker volumes
- Delete environment backups
- Delete temporary authentication artifacts
- Clean local validation assets
- Deploy Core
- Restart PostgreSQL
- Modify database state
- Modify Billing
- Modify Workflow
- Modify companyId authority or isolation
- Modify Nginx
- Modify Docker network
- Perform new Web feature development
- Execute a real external pilot

Any mutating action requires a separate controlled decision and explicit Founder Authorization.

────────────────────────────────────────────
13) CURRENT ACCEPTANCE DECISION
────────────────────────────────────────────

SR-21 Controlled Production Evolution:

CLOSED WITH VERIFIED PRODUCTION EVIDENCE

Production Web runtime:

VERIFIED / STABLE AT FINAL STATE ANCHOR

Core runtime:

VERIFIED / STABLE AT FINAL STATE ANCHOR

PostgreSQL runtime:

VERIFIED / STABLE AT FINAL STATE ANCHOR

Architecture:

PRESERVED

Rollback capability:

PRESERVED

Current Web state:

LOCKED AT THIS ANCHOR FOR SUBSEQUENT CONTROLLED WORK

First real external pilot:

NOT AUTHORIZED

────────────────────────────────────────────
14) SAFETY CONFIRMATION
────────────────────────────────────────────

This document is documentation only.

Creating this document does not execute any Production action.

No server action is executed by creating this document.

No container action is executed.

No Docker run is executed.

No Docker rm is executed.

No Docker prune is executed.

No rollback asset is deleted.

No Core change is made.

No PostgreSQL change is made.

No database change is made.

No Billing change is made.

No Workflow change is made.

No companyId authority or isolation change is made.

No Nginx change is made.

No Docker network change is made.

No deployment is performed.

No external pilot is authorized.

Was anything deleted by creating this Web current state anchor?

NO

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────
