# HAWANA HSE — WEB ADMIN ARCHITECTURE

Document Type: Architecture Standard  
Scope: Web Admin (Next.js)  
Status: ENFORCED  

--------------------------------------------------

## 1) PURPOSE

This document defines the architecture rules for Web Admin.

Goal:
- Prevent session break
- Prevent 401 loops
- Enforce single authentication flow
- Standardize API access

--------------------------------------------------

## 2) CORE PRINCIPLE

Web Admin MUST act as:

Browser Client → Web Admin API → Core API

NOT:

Browser → Core directly

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

--------------------------------------------------

## 4) AUTH FLOW

Single Source of Truth:

Cookie → access_token

Flow:

Browser  
→ sends cookie  
→ Web Admin API reads cookie  
→ injects Authorization  
→ calls Core API  

--------------------------------------------------

## 5) SSR RULE (CRITICAL)

Inside SSR pages:

❌ DO NOT call Core API directly  
❌ DO NOT build absolute URLs  
❌ DO NOT use fetch(api(...))  

✔ ONLY use:

serverAppFetch("/api/...")

--------------------------------------------------

## 6) PROXY RULE

Each module MUST have:

app/api/<module>/route.ts

Responsibilities:

- Read cookies
- Extract token
- Add Authorization header
- Call Core API
- Return response

--------------------------------------------------

## 7) COOKIE RULE

Authentication depends on:

access_token cookie

Requirements:

- Path = /
- Same domain
- Not manually modified

--------------------------------------------------

## 8) ERROR HANDLING

401 behavior:

- If token missing → redirect /login
- If token invalid → redirect /login
- NEVER silent fail

--------------------------------------------------

## 9) FORBIDDEN PATTERNS

❌ Direct Core API calls  
❌ Mixing server/client fetch  
❌ Multiple auth sources  
❌ Manual token injection in pages  
❌ Absolute URL inside SSR  

--------------------------------------------------

## 10) ACCEPTED PATTERN

Page:

serverAppFetch("/api/...")

↓

API route:

fetch(Core API with Authorization)

↓

Core:

validates JWT

--------------------------------------------------

## 11) FAILURE SYMPTOMS

If violated:

- Login loop
- 401 errors
- Session lost
- Random logout

--------------------------------------------------

## 12) RULE

These rules are:

✔ Mandatory  
✔ Non-negotiable  
✔ Required for stability  

Any violation is considered:

Architecture breach