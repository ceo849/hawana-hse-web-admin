# HAWANA HSE — Web Local Runtime Refresh Phase B Candidate V2 Browser Evidence

Document Type: Runtime Browser Observation Evidence  
Project: Hawana HSE Web Admin  
Date: 2026-05-31  
Scope: Web Admin Local Runtime Candidate V2  
Status: PHASE B CANDIDATE V2 BROWSER OBSERVATION PASSED  

---

## 1) Purpose

This document records the browser-based validation result for the refreshed Web local runtime candidate V2.

The validation was performed after identifying tt the previous Web runtime had stale source drift and after creating a refreshed candidate container on port 3007.

This document is evidence only.

No runtime switch is approved by this document.

---

## 2) Candidate Runtime Under Review

Candidate runtime:

hawana-web-candidate-rbac04-v2-2026-05-31

Candidate port:

http://localhost:3007

Original active Web runtime:

http://localhost:3005

Original Web runtime status:

Still running during observation.

---

## 3) Architecture Boundary

Architecture remains:

Web → API Proxy → Core

No direct UI-to-Core access was observed.

No API contract change was introduced.

No backend behavior was changed.

No Core runtime was rebuilt or restarted.

---

## 4) Tested User Context

Observed role:

VIEWER

Observed user:

viewer3@hawana.com

Expected UI behavior:

VIEWER must have read-only access only.

Expected prohibited UI actions:

- No create shortcut
- No floating plus button when no quick actions are allowed
- No Safety Report creation shortcut
- No ActPlan creation shortcut
- No Site / Project creation shortcut
- No User creation shortcut
- No Billing/Admin/Company privileged UI exposure

---

## 5) Browser Observation Evidence

Observed pages:

1. /dashboard
2. /dashboard sidebar
3. /dashboard/sites-projects
4. /dashboard/safety-reports
5. /dashboard/safety-reports/[id]
6. /dashboard/action-plans
7. /dashboard/action-plans/[id]

All observations were performed against:

http://localhost:3007

---

## 6) Dashboard Observation

Observed:

- Dashboard loaded successfully.
- Platform metrics loaded successfully.
- HSE operations metrics loaded successfully.
- Quick Actions area did not expose unauthorized create actions for VIEWER.
- Floating + button was not visible for VIEWER.

Result:

PASSED

---

## 7) Sidebar Observation

Observed allowed sidebar items for VIEWER:

- Dashboard
- Sites / Projects
- Safety Reports
- Action Plans

Observed not visible:

- Users
- Companies
- Billing
- Admin Panel

Result:

PASSED

---

## 8) Sites / Projects Observation

Observed:

- Sites / Projects page loaded successfully.
- Read-only list behavior was preserved.
- No create action was visible.
- Floating + button was not visible.

Result:

PASSED

---

## 9) Safety Reports Observation

Observed:

- Safety Reports page loaded successfully.
- Existing reports were visible.
- Report details page loaded successfully.
- No create action was visible.
- No edit action was visible.
- No delete action was visible.
- Floating + button was not visible.
- Back navigation remained available.

Result:

PASSED

---

## 10) Action Plans Observation

Observed:

- Action Plans page loaded successfully.
- Existing plans were visible.
- Action Plan details page loaded successfully.
- No create action was visible.
- No edit action was visible.
- No delete action was visible.
- No status update control was visible for VIEWER.
- Floating + button was not visible.
- Back navigation remained available.

Result:

PASSED

---

## 11) Fixed Issue Confirmation

Previous issue:

A floating + button was visible for VIEWER even though VIEWER had no allowed quick actions.

Fix applied:

MobileBottomNav now returns null when quickActions.length === 0.

Observed result:

The floating + button is no longer visible for VIEWER on candidate V2.

Status:

FIX CONFIRMED

---

## 12) Safety Boundary Confirmation

This validation did not perform:

- No Core rebuild
- No Core restart
- No database query
- No database mutation
- No Billing change
- No companyId change
- No Workflow change
- No API contract change
- No Docker Compose execution
- No production deployment
- No runtime switch from 3005 to 3007

---

## 13) Final Classification

Candidate V2 browser observation:

PASSED

VIEWER UI visibility:

PASSED

Mobile FAB empty actions fix:

PASSED

Dashboard Quick Actions RBAC fix:

PASSED

Read-only UI boundary:

PASSED

Candidate V2 readiness for controlled local switch:

READY FOR APPROVAL

Switch from 3005 to refreshed Web runtime:

NOT STARTED

Production deployment:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

Was anything deleted?

NO
