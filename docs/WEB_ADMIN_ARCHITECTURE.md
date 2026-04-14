# HAWANA HSE — WEB ADMIN ARCHITECTURE

Document Type: Architecture Standard  
Scope: Web Admin (Next.js)  
Status: ENFORCED — PRODUCTION CRITICAL  

--------------------------------------------------

## 1) PURPOSE

This document defines the enforced architecture for the Web Admin layer.

Goals:

- Prevent authentication instability  
- Eliminate 401 loops  
- Enforce a single authentication source  
- Guarantee deterministic API access  
- Align UI with backend governance rules  

This document is part of the **Phase 4.2 Stabilization Layer**.

--------------------------------------------------

## 2) CORE PRINCIPLE

Web Admin MUST act as:

Browser  
→ Web Admin API (/api/*)  
→ Core API  

NEVER:

Browser → Core API directly  

This ensures:

- Security  
- Session stability  
- Token control  

--------------------------------------------------

## 3) API ACCESS RULE (CRITICAL)

ALL requests MUST go through:

/api/*

NEVER:

❌ fetch(api("/users"))  
❌ fetch("http://localhost:3001/v1/...")  

ALWAYS:

✔ serverAppFetch("/api/users")  
✔ serverAppFetch("/api/safety-reports")  

Violation = architecture breach  

--------------------------------------------------

## 4) AUTHENTICATION FLOW

Single Source of Truth:

access_token (cookie)

Flow:

Browser  
→ sends cookie  
→ Web Admin API extracts token  
→ injects Authorization header  
→ calls Core API  

No alternative authentication paths allowed.

--------------------------------------------------

## 5) SSR RULE (CRITICAL)

Inside Server Components:

❌ DO NOT call Core API directly  
❌ DO NOT use absolute URLs  
❌ DO NOT bypass /api layer  

✔ ONLY use:

serverAppFetch("/api/...")

This guarantees:

- Token consistency  
- SSR stability  
- No session leakage  

--------------------------------------------------

## 6) PROXY LAYER

Each module MUST expose:

app/api/<module>/route.ts  

Responsibilities:

- Read cookies  
- Extract access_token  
- Inject Authorization header  
- Forward request to Core API  
- Return normalized response  

This is the ONLY gateway to backend.

--------------------------------------------------

## 7) COOKIE RULE

Authentication depends on:

access_token cookie  

Requirements:

- Path = /  
- Same domain  
- Not modified manually  
- Controlled only by auth flow  

--------------------------------------------------

## 8) ERROR HANDLING

401 behavior:

- Missing token → redirect /login  
- Invalid token → redirect /login  

NEVER:

❌ silent fail  
❌ partial rendering  

--------------------------------------------------

## 9) FORBIDDEN PATTERNS

❌ Direct Core API calls  
❌ Mixing client/server fetch  
❌ Multiple auth sources  
❌ Manual token injection  
❌ Absolute URLs in SSR  

Violation leads to:

- Session break  
- Security risk  
- Non-deterministic behavior  

--------------------------------------------------

## 10) ACCEPTED PATTERN

Page:

serverAppFetch("/api/...")

↓

API Route:

fetch(Core API with Authorization)

↓

Core:

JWT validation + RBAC enforcement  

--------------------------------------------------

## 11) FAILURE SYMPTOMS

If rules are violated:

- Login loop  
- 401 responses  
- Session loss  
- Random logout  
- Inconsistent UI state  

--------------------------------------------------

## 12) ENFORCEMENT LEVEL

These rules are:

✔ Mandatory  
✔ Enforced  
✔ Non-negotiable  

Part of:

Phase 4.2 Stabilization Governance  

Any violation is considered:

Architecture breach  

--------------------------------------------------

## 13) RELATION TO SYSTEM

This layer ensures:

- UI stability (Phase 4.2) ✔  
- Secure backend access ✔  
- Compatibility with Production System Layer (Phase 5) ✔  

It is a critical boundary between:

User Interface ↔ Backend System  

--------------------------------------------------