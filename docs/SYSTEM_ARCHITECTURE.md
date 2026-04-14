# HAWANA HSE — SYSTEM ARCHITECTURE

Document Type: System Architecture  
Scope: Full Platform  
Status: PRODUCTION BASELINE  

--------------------------------------------------

## 1. System Overview

Hawana HSE is a multi-tenant SaaS platform for HSE (Health, Safety, Environment) management.

The system is designed as:

- Layered Architecture  
- Modular Backend  
- Tenant-Isolated System  
- Cloud-Native Deployment  

Primary objective:

Deliver a scalable, secure, and governed enterprise system.

--------------------------------------------------

## 2. High-Level Architecture

System flow:

User (Browser / Mobile)
→ Web Admin (Next.js)
→ Core API (NestJS)
→ PostgreSQL Database

Through:

Nginx Reverse Proxy (HTTPS)

--------------------------------------------------

## 3. System Layers

### 3.1 Presentation Layer

Components:

- Web Admin (Next.js)
- Future Mobile App (Flutter)

Responsibilities:

- Display data
- Trigger actions
- Follow UI governance rules

Constraints:

- No direct backend  No business logic execution

--------------------------------------------------

### 3.2 Application Layer (Core API)

Technology:

NestJS

Responsibilities:

- Business logic execution
- RBAC enforcement
- Workflow control
- Validation
- Billing enforcement

Key Modules:

- Auth
- Users
- Companies
- Sites / Projects
- Safety Reports
- Action Plans
- Billing
- Stripe Events

--------------------------------------------------

### 3.3 Data Layer

Technology:

PostgreSQL

Characteristics:

- Relational database
- Multi-tenant design
- Foreign key constraints
- Indexed queries

Core Entities:

- Company
- User
- Site / Project
- Safety Report
- Action Plan
- Stripe Event

--------------------------------------------------

## 4. Multi-Tenant Architecture

Isolation Strategy:

companyId (mandatory in all entities)

Rules:

- Every query scoped by companyId
- No cross-tenant access
- Extracted only from JWT

--------------------------------------------------

## 5. Authentication & Authorization

Authentication:

JWT-based

Authorization:

Role-Based Access Control (RBAC)

Roles:

- OWNER
- ADMIN
- MANAGER
- WORKER
- VIEWER

Flow:

User → Login → JWT → Access Control enforced at backend

--------------------------------------------------

## 6. Workflow Engine

### Safety Reports

States:

OPEN → IN_PROGRESS → CLOSED

Derived from Action Plans.

---

### Action Plans

States:

OPEN → IN_PROGRESS → COMPLETED → VERIFIED

Rules:

- VERIFIED = read-only
- No self-verification allowed

--------------------------------------------------

## 7. Billing & Access Control

Billing system controls access.

States:

- TRIAL
- ACTIVE
- SUSPENDED
- CANCELLED

Enforced via:

BillingActiveGuard

Rule:

No valid subscription → No system access

--------------------------------------------------

## 8. Event Processing System

Stripe Events:

- Stored in database
- Validated
- Applied to system

Includes:

- customer
- subscription
- companyId (metadata)

--------------------------------

## 9. Retry Engine

Handles failed events.

Strategy:

Exponential Backoff

Formula:

nextRetryAt = now + (2^retryCount × 60 seconds)

Capabilities:

- Retry failed events
- Limit retries
- Prevent infinite loops

--------------------------------------------------

## 10. API Architecture

Versioning:

/v1 → Stable (Frozen)

Rules:

- Backward compatibility required
- Breaking changes require /v2

Access Pattern:

Web Admin → /api/* → Core API

--------------------------------------------------

## 11. Deployment Architecture

Infrastructure:

- Google Cloud VM
- Docker Containers
- Nginx Reverse Proxy
- HTTPS (Let's Encrypt)

Containers:

- hawana-web (Next.js)
- hawana-core (NestJS)

--------------------------------------------------

## 12. Observability (Baseline)

Implemented:

- Structured logging
- Request tracing
- Error classification

Pending:

- Metrics
- Alerts
- External monitoring

--------------------------------------------------

## 13. Operational Layer

Defined via Runbook:

-ment flow
- Rollback procedures
- Incident handling
- Retry operations

System is:

Deterministic  
Recoverable  

--------------------------------------------------

## 14. System Constraints

Do NOT:

- Break schema
- Modify API contract
- Bypass architecture layers
- Change tenant isolation logic

Unless:

A verified production issue exists

--------------------------------------------------

## 15. System Characteristics

The system is:

- Multi-tenant ✔  
- Secure ✔  
- Governed ✔  
- Production-ready ✔  
- Recoverable ✔  

--------------------------------------------------

## 16. Final Statement

Hawana HSE is a fully operational SaaS platform with:

- Stable backend  
- Controlled UI  
- Enforced workflows  
- Billing-driven access  
- Recovery mechanisms  

This architecture supports:

Scalability  
Maintainability  
Enterprise deployment  

--------------------------------------------------
