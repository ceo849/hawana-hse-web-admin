# HAWANA HSE — ADMIN UI PATTERN

Document Type: UI Architecture Standard  
Scope: Web Admin Interface  
Status: ENFORCED — PRODUCTION UI LAYER  

--------------------------------------------------

## 1. Purpose

This document defines the enforced UI pattern for all administrative modules.

Goals:

- Ensure consistency across all entities  
- Separate insight from control  
- Prevent unsafe UI actions  
- Align UI with backend workflow rules  

This pattern is part of:

Phase 4.2 Stabilization Layer  

--------------------------------------------------

## 2. Core Principle

Administrative UI must follow:

Insight First → Control Second  

Meaning:

- Users must understand state before acting  
- UI must NOT allow blind operations  

--------------------------------------------------

## 3. Standard Structure

Every entity follows:

List → Overview → Control  

No deviation is allowed without architectural approval.

--------------------------------------------------

## 4. List Page

Examples:

/dashboard/companies  
/dashboard/users  
/dashboard/sites-projects  
/dashboard/safety-reports  
/dashboard/action-plans  

Purpose:

- Display entities  
- Pagination  
- Filtering / search  
- Navigation to entity overview  

Rules:

- No destructive actions  
- No heavy mutations  
- Read-only focused  

--------------------------------------------------

## 5. Entity Overview Page

Examples:

/dashboard/companies/[id]  
/dashboard/users/[id]  
/dashboard/sites-projects/[id]  

Structure:

### A) Insight Section (MANDATORY)

Displayed FIRST.

Includes:

- Metadata  
- createdAt / updatedAt  
- status  
- relationships  
- operational context  

Rules:

- Must reflect backend truth  
- Must be complete before actions  

---

### B) Control Section

Displayed AFTER Insight.

Includes:

- Update entity  
- Assign / link  
- Soft delete (if applicable)  

Rules:

- Must respect backend workflow  
- Must NOT override system rules  

--------------------------------------------------

## 6. Workflow-Safe UI

UI MUST respect backend state machine.

Examples:

- VERIFIED Action Plans → read-only  
- CLOSED Safety Reports → immutable  
- Unauthorized roles → blocked  

Violation = system inconsistency  

--------------------------------------------------

## 7. Platform Administration

Example:

/dashboard/admin  

Purpose:

Global observability  

Data source:

/v1/platform/metrics  

Displays:

- total companies  
- total users  
- total sites  
- total safety reports  
- total action plans  

Rules:

- Read-only  
- No mutation actions  

--------------------------------------------------

## 8. Integration with Architecture

This UI pattern depends on:

- Web Admin Architecture (API proxy layer)  
- API Contract (v1 frozen)  
- Backend RBAC enforcement  

UI is NOT a source of truth.

Backend is the source of truth.

--------------------------------------------------

## 9. Forbidden Patterns

❌ Direct mutation without context  
❌ Control before insight  
❌ UI overriding backend logic  
❌ Inconsistent layouts per page  

--------------------------------------------------

## 10. Enforcement Level

This pattern is:

✔ Mandatory  
✔ Enforced  
✔ Non-negotiable  

Any violation is:

UI Architecture Breach  

--------------------------------------------------

## 11. Final Rule

Every new entity MUST follow:

List → Insight → Control  

Without exception.