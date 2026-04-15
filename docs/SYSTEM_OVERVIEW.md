# HAWANA HSE — SYSTEM OVERVIEW

Document Type: High-Level System Overview  
Audience: Engineers / Reviewers / External Evaluation  
Purpose: Provide a complete understanding of system behavior in minutes  

--------------------------------------------------

## 1) WHAT IS THE SYSTEM

Hawana HSE is a:

Multi-Tenant SaaS Platform for Health, Safety, and Environment (HSE) management.

It is designed to:

- Digitize safety operations
- Enforce accountability
- Ensure auditability
- Support enterprise-scale organizations

--------------------------------------------------

## 2) SYSTEM ARCHITECTURE

Frontend (Next.js Web Admin)
→ API Proxy (/api/*)
→ Core API (NestJS)
→ PostgreSQL (Prisma ORM)

Key principle:

Core API is the single source of truth

--------------------------------------------------

## 3) CORE MODULES

- Authentication (JWT + RBAC)
- Companies & Users
- Sites & Projects
- Safety Reports
- Action Plans
- Permit To Work (PTW)
- Incidents
- Audit Log
- Billing (Stripe Integration)

--------------------------------------------------

## 4) MULTI-TENANT MODEL

Each request is scoped by:

companyId (extracted from JWT)

Rules:

- No cross-tenant access
- No companyId from request body
- All queries are tenant-filtered

--------------------------------------------------

## 5) MAIN WORKFLOW (SIMPLIFIED)

Safety Report Created  
→ Action Plan Generated  
→ Action Plan Executed  
→ Action Plan Completed  
→ Action Plan Verified  
→ Safety Report Closed  

Key rule:

Safety Report status is derived from Action Plans

--------------------------------------------------

## 6) ACTION PLAN STATE MACHINE

OPEN  
→ IN_PROGRESS  
→ COMPLETED  
→ VERIFIED  

Rules:

- Backend enforces transitions
- VERIFIED is read-only
- Self-verification is forbidden

--------------------------------------------------

## 7) PERMIT TO WORK (PTW) FLOW

DRAFT  
→ SUBMITTED  
→ APPROVED  
→ ACTIVE  
→ CLOSED  

Optional:

→ CANCELLED (from non-final states)

--------------------------------------------------

## 8) BILLING MODEL

Access is controlled by subscription status:

- TRIAL
- ACTIVE
- SUSPENDED
- CANCELLED

Enforced in backend via BillingActiveGuard

--------------------------------------------------

## 9) AUDIT & TRACEABILITY

All system actions are:

- Logged
- Immutable
- Traceable

AuditLog is append-only

--------------------------------------------------

## 10) DEPLOYMENT MODEL

Local:
- Development only

Production:
- Docker-based deployment
- Nginx reverse proxy
- HTTPS enabled
- No manual server edits

--------------------------------------------------

## 11) OPERATIONS

System is managed through:

- RUNBOOK.md (global operations)
- CORE_RUNBOOK.md (backend operations)

Includes:

- Deployment
- Troubleshooting
- Incident handling

--------------------------------------------------

## 12) OBSERVABILITY (CURRENT STATE)

- Prometheus (metrics collection)
- Logging (structured)
- Request tracing (baseline)

Target:

Full monitoring + alerting system

--------------------------------------------------

## 13) ENGINEERING PRINCIPLES

- Stability First
- Backend is authority
- No hidden logic
- Deterministic behavior
- Additive evolution only

--------------------------------------------------

## 14) CURRENT STATUS

✔ Core API: Production-ready  
✔ Web Admin: Primary interface  
✔ Mobile: Hybrid (Flutter + PWA)  
✔ SaaS Layer: Active  
✔ Observability: In progress  

--------------------------------------------------

## 15) FINAL STATEMENT

Hawana HSE is not just a software system.

It is an:

Accountability Platform

Designed to enforce operational truth,
ensure safety compliance,
and support enterprise-grade execution.

--------------------------------------------------