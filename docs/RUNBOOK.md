# Hawana HSE — Production Operations Runbook

Project: Hawana HSE Platform  
System Type: Multi-Tenant SaaS (Production Grade)  
Purpose: Deterministic operation, deployment, recovery, and incident handling  

--------------------------------------------------
## 0. SYSTEM ENTRY PROTOCOL (MANDATORY)
--------------------------------------------------

This is the ONLY allowed entry point to operate the system.

No operator is allowed to:
- run random commands  
- skip steps  
- assume system state  

Execution MUST follow this sequence.

--------------------------------------------------

### STEP 0 — Environment Verification

docker ps

Expected:
- hawana-core running  
- hawana-web running  

IF FAILED:
→ STOP immediately

--------------------------------------------------

### STEP 1 — Health Verification

curl https://hawanaglobal.com/api/v1/health  
curl https://hawanaglobal.com/api/v1/health/ready  

Expected:

{"status":"ok"}  
{"status":"ready","database":"connected"}

IF FAILED:
→ SYSTEM NOT OPERATIONAL  
→ MOVE TO INCIDENT HANDLING  

--------------------------------------------------

### STEP 2 — Authentication Verification

curl -X POST https://hawanaglobal.com/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"owner@hawana.com","password":"*****"}'

Expected:
- access_token returned  

IF FAILED:
→ AUTH SYSTEM FAILURE  

--------------------------------------------------

### STEP 3 — Core Functional Verification

Operator MUST verify:

1. Login works  
2. Dashboard loads  
3. Users page loads  
4. Safety Reports accessible  
5. Action Plans accessible  

IF ANY FAILS:
→ SYSTEM NOT OPERATIONAL  

--------------------------------------------------

### STEP 4 — Event Processing Verification (CRITICAL)

curl https://hawanaglobal.com/api/v1/stripe-events \
-H "Authorization: Bearer <TOKEN>"

IF failed events exist:

curl -X POST https://hawanaglobal.com/api/v1/stripe-events/{eventId}/retry \
-H "Authorization: Bearer <TOKEN>"

--------------------------------------------------

### STEP 5 — Logs Verification

docker logs hawana-core --tail 50

Check:
- errors  
- retry loops  
- failed events  

--------------------------------------------------

### RULE

If any step fails:

→ DO NOT continue  
→ DO NOT deploy  
→ DO NOT modify system  

→ MOVE TO INCIDENT HANDLING  

--------------------------------------------------
## 1. Production Deployment Flow
--------------------------------------------------

build  
→ push  
→ pull  
→ restart containers  
→ verify health  
→ verify workflow  

--------------------------------------------------
## 2. Web Admin Deployment
--------------------------------------------------

docker buildx build \
--platform linux/amd64 \
--build-arg NEXT_PUBLIC_API_BASE_URL=https://hawanaglobal.com \
--build-arg NEXT_PUBLIC_API_PREFIX=/api/v1 \
-t us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<tag> \
--push .

docker pull us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<tag>

docker stop hawana-web
docker rm hawana-web

docker run -d \
--name hawana-web \
--restart always \
-p 3000:3000 \
-e NEXT_PUBLIC_API_BASE_URL=https://hawanaglobal.com \
-e NEXT_PUBLIC_API_PREFIX=/api/v1 \
us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<tag>

--------------------------------------------------
## 3. Core API Deployment
--------------------------------------------------

docker buildx build \
--platform linux/amd64 \
-t us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:latest \
--push .

docker pull us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:latest

docker stop hawana-core
docker rm hawana-core

docker run -d \
--name hawana-core \
--restart always \
--network hawana-network \
-p 3001:3001 \
-e NODE_ENV=production \
-e PORT=3001 \
-e DATABASE_URL="postgresql://..." \
-e JWT_SECRET="..." \
-e REFRESH_TOKEN_SECRET="..." \
-e CORS_ORIGIN="*" \
us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:latest

--------------------------------------------------
## 4. Rollback Procedure
--------------------------------------------------

Rollback Web / Core using previous tags  
→ restart containers  
→ verify health  

--------------------------------------------------
## 5. Incident Handling (CRITICAL)
--------------------------------------------------

### Case 1 — API Down

- Check docker logs hawana-core  
- Restart container  
- Verify health endpoint  

---

### Case 2 — Database Down

- Check DB connectivity  
- Verify DATABASE_URL  
- Restart core  

---

### Case 3 — Authentication Failure

- Verify JWT_SECRET  
- Restart core  
- Test login endpoint  

---

### Case 4 — Stripe Events Failing

curl /v1/stripe-events  

If failed:

→ retry manually  
→ check logs  
→ verify payload structure  

---

### Case 5 — Billing Blocking Users

- Verify subscriptionStatus  
- Verify stripeSubscriptionId  
- Verify billing guard logs  

--------------------------------------------------
## 6. Retry Operations (CRITICAL)
--------------------------------------------------

List events:

curl /v1/stripe-events

Retry event:

curl -X POST /v1/stripe-events/{id}/retry

Rules:

- retryCount < 5  
- payload must be valid  
- subscription must exist  

--------------------------------------------------
## 7. Container Verification
--------------------------------------------------

docker ps  
docker logs hawana-core --tail 50  
docker logs hawana-web --tail 50  

--------------------------------------------------
## 8. Health Verification
--------------------------------------------------

/health → ok  
/health/ready → database connected  

--------------------------------------------------
## 9. Functional Verification
--------------------------------------------------

Login → Dashboard → Users → Reports → Action Plans  

--------------------------------------------------
## 10. Automated Smoke Tests
--------------------------------------------------

./workflow-smoke-check.sh  

Expected:

WORKFLOW SMOKE CHECK PASSED  

--------------------------------------------------
## 11. Nginx Rules
--------------------------------------------------

/api/v1/ → Core  
/api/ → Web routes  
/ → Web UI  

DO NOT MODIFY unless required  

--------------------------------------------------
## 12. Final Rule
--------------------------------------------------

System operation is deterministic.

No improvisation allowed.  
No undocumented action allowed.  
No production change without verification.  

--------------------------------------------------