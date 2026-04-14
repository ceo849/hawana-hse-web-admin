# Phase 5 — Cloud Deployment Report

Project: Hawana HSE  
Environment: Production  
Deployment Date: March 2026  
Status: Operational + Extended Production Layer  

--------------------------------------------------

## 1. Infrastructure

Server:
Google Cloud VM  

Operating System:
Ubuntu 22.04  

Reverse Proxy:
Nginx  

SSL:
Let's Encrypt  

--------------------------------------------------

## 2. Application Architecture

Production Stack:

Web Admin  
Next.js (Docker Container)  

Core API  
NestJS (Docker Container)  

Database  
PostgreSQL (Cloud)  

Architecture Flow:

User Browser  
→ Nginx (HTTPS Reverse Proxy)  
→ Next.js Web Admin  
→ NestJS Core API  
→ PostgreSQL Database  

--------------------------------------------------

## 3. Containers

hawana-web  
Port: 3000  
Role: Web Admin Interface  

hawana-core  
Port: 3001  
Role: Backend API  

--------------------------------------------------

## 4. Domain & Routing

Primary Domain:
https://hawanaglobal.com  

Routing:

/ → Web Admin  
/api/v1 → Core API  

--------------------------------------------------

## 5. Security

HTTPS enforced  
Helmet enabled  
CORS configured  
Rate limiting enabled  
JWT authentication active  

--------------------------------------------------

## 6. Deployment Verification

The following production checks were performed:

Login test ✔  
Dashboard load ✔  
Companies module ✔  
Safety Reports ✔  
Action Plans ✔  
API health endpoint ✔  

--------------------------------------------------

## 7. Extended Production Capabilities

After initial deployment, the system was extended with:

### Billing Enforcement

- Subscription-based access control  
- Runtime enforcement via BillingActiveGuard  
- Trial and active states supported  

---

### Stripe Event Processing

- Event ingestion and storage  
- Structured payload validation  
- Company linkage via metadata  

---

### Retry Engine

- Handles failed Stripe events  
- Exponential backoff strategy  

Formula:

nextRetryAt = now + (2^retryCount × 60 seconds)

- Retry limit enforced  
- Self-recovery capability enabled  

---

### Operational Runbook

- Deterministic deployment flow  
- Rollback procedures  
- Incident handling  
- System entry protocol  

--------------------------------------------------

## 8. Observability (Baseline)

Implemented:

- Structured logging (Pino)  
- Request ID tracking  
- Error classification  

Logs accessible via:

docker logs hawana-core  

--------------------------------------------------

## 9. Result

The Hawana HSE platform is deployed and operating as a **Production System**, not only a deployed application.

System capabilities:

- End-to-end connectivity verified ✔  
- Billing enforcement active ✔  
- Failure recovery operational ✔  
- Operational control defined ✔  

Final Status:

**Production Operational + System Layer Active**