# HAWANA HSE WEB — DOCKER COMPOSE RUNTIME CLASSIFICATION
# تصنيف ملف Docker Compose داخل Web

Document Type: Web Infrastructure Governance Note
Project: Hawana HSE Web Admin
Date: 2026-05-16
Mode: Read-Only Classification / No Runtime Change
Status: ACTIVE GOVERNANCE NOTE

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document classifies the existing docker-compose.yml file inside the Web repository.

This is documentation-only.

No runtime behavior is changed.

No Docker file is modified.

No production service is affected.

────────────────────────────────────────────
2) AUDIT FINDING
────────────────────────────────────────────

The Web repository contains:

docker-compose.yml

However, repository audit found:

- No README instruction to run it
- No script depending on it
- No documented production dependency
- No documented developer workflow requiring it
- No official statement that it is the runtime entrypoint
- No proof that it is deprecated either

Therefore, the file is classified as:

UNCLASSIFIED / INACTIVE RUNTIME FILE

────────────────────────────────────────────
3) CURRENT OFFICIAL RUNTIME SOURCE
────────────────────────────────────────────

Current local Docker runtime is orchestrated from:

~/hawana-hse-core/docker-compose.yml

Current production runtime is orchestrated from:

/home/hawanaglobal/docker-compose.yml

The Web repository docker-compose.yml is not currently verified as an active runtime source.

────────────────────────────────────────────
4) RISK
────────────────────────────────────────────

The file may be risky if executed directly without review.

Reasons:

- It contains full stack services, not Web-only.
- It defines Core and Postgres from inside the Web repo.
- Its Core build context is not verified as correct for current architecture.
- Its Postgres settings do not match the current official database baseline.
- It is not referenced by current governance docs as the official runtime path.

Risk level:

LOW while unused.
HIGH if executed directly without review.

────────────────────────────────────────────
5) GOVERNANCE RULE
────────────────────────────────────────────

Do not run this file directly until it is formally classified.

Forbidden until reviewed:

docker compose up
docker compose up -d
docker compose down
docker compose down -v

inside the Web repository.

────────────────────────────────────────────
6) FUTURE OPTIONS
────────────────────────────────────────────

Future controlled options:

1. Convert this file to Web-only compose.
2. Replace it with documentation pointing to the official stack compose.
3. Keep it but mark it explicitly as non-runtime reference.
4. Remove it only after governance approval and backup.

No option is approved for execution yet.

────────────────────────────────────────────
7) FINAL DECISION
────────────────────────────────────────────

Current decision:

Document only.
Do not execute.
Do not modify runtime.
Do not delete.
Do not refactor.

Was anything deleted?

NO