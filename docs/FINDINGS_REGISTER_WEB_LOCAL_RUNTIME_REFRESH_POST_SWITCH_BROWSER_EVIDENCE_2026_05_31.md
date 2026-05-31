# HAWANA HSE — WEB LOCAL RUNTIME REFRESH POST-SWITCH BROWSER EVIDENCE
# دليل فحص المتصفح بعد التحويل المحلي المنضبط للـ Web Runtime

Document Type: Runtime Evidence
Project: Hawana HSE Web Admin
Repository: hawana-hse-web-admin
Date: 2026-05-31
Status: POST-SWITCH BROWSER VALIDATION PASSED

─────────────────────────────────────
## 1) Purpose
─────────────────────────────────────

This document records the browser validation evidence after the controlled local Web runtime switch.

The validation confirms that the refreshed Web runtime is now serving on:

http://localhost:3005

The validation was performed using a VIEWER account.

This document is evidence only.

It does not approve production deployment.

─────────────────────────────────────
## 2) Runtime Context
─────────────────────────────────────

Runtime after switch:

hawana-web

Port:

3005

Validated role:

VIEWER

Validated user:

viewer3@hawana.com

Validated browser route:

http://localhost:3005/dashboard

Runtime switch type:

WEB LOCAL RUNTIME SWITCH ONLY

Architecture boundary:

Web → API Proxy → Core

─────────────────────────────────────
## 3) Dashboard Browser Evidence
─────────────────────────────────────

Dashboard loaded successfully on:

http://localhost:3005/dashboard

Observed result:

PASSED

Dashboard metrics displayed:

- Companies: 1
- Users: 5
- Reports: 3
- Action Plans: 4
- Open: 1
- In Progress: 2
- Closed: 0

Quick Actions section displayed no unauthorized action buttons.

VIEWER did not see:

- + Action Plan
- + Site / Project
- + User
- + Safety Report quick action from dashboard

Dashboard Quick Actions RBAC visibility:

PASSED

─────────────────────────────────────
## 4) Sidebar Browser Evidence
─────────────────────────────────────

Sidebar was opened using the VIEWER account.

Visible navigation items:

- Dashboard
- Sites / Projects
- Safety Reports
- Action Plans

Unauthorized navigation items were not visible.

VIEWER did not see:

- Users
- Companies
- Billing
- Admin Panel

Sidebar RBAC visibility:

PASSED

─────────────────────────────────────
## 5) Mobile FAB Browser Evidence
─────────────────────────────────────

The global floating plus button was checked after the switch.

Observed result:

The mobile FAB / floating plus button is not visible for VIEWER.

Reason:

VIEWER has no allowed quick actions.

Expected behavior:

When quickActions.length is zero, the MobileBottomNav component returns null.

Mobile FAB empty actions visibility fix:

PASSED

─────────────────────────────────────
## 6) Sites / Projects Browser Evidence
─────────────────────────────────────

Route checked:

http://localhost:3005/dashboard/sites-projects

Observed result:

Sites / Projects page loaded successfully.

The page displayed read-only empty state:

No sites/projects found.

No unauthorized create button was visible.

Sites / Projects VIEWER read-only behavior:

PASSED

─────────────────────────────────────
## 7) Safety Reports Browser Evidence
─────────────────────────────────────

Route checked:

http://localhost:3005/dashboard/safety-reports

Observed result:

Safety Reports page loaded successfully.

Reports were visible to VIEWER.

No unauthorized create or edit control was visible.

Safety Reports list read-only behavior:

PASSED

Safety Report detail route checked.

Observed result:

Safety Report detail loaded successfully.

No unauthorized Edit button was visible.

No unauthorized Create Action Plan button was visible.

Safety Report detail VIEWER read-only behavior:

PASSED

─────────────────────────────────────
## 8) Action Plans Browser Evidence
─────────────────────────────────────

Route checked:

http://localhost:3005/dashboard/action-plans

Observed result:

Action Plans page loaded successfully.

Action Plans were visible to VIEWER.

No unauthorized create control was visible.

Action Plans list read-only behavior:

PASSED

Action Plan detail route checked.

Observed result:

Action Plan Overview loaded successfully.

No unauthorized edit control was visible.

No unauthorized status mutation control was visible.

Action Plan detail VIEWER read-only behavior:

PASSED

─────────────────────────────────────
## 9) Architecture Boundary
─────────────────────────────────────

Required architecture:

Web → API Proxy → Core

Architecture status:

PRESERVED

Direct UI to Core calls:

NOT OBSERVED

Direct browser to Core calls:

NOT OBSERVED

Backend source of truth:

UNCHANGED

serverAppFetch boundary:

UNCHANGED

API Proxy boundary:

UNCHANGED

Core runtime:

UNCHANGED

Database runtime:

UNCHANGED

─────────────────────────────────────
## 10) Explicitly Not Approved
─────────────────────────────────────

Core rebuild:

NOT APPROVED

Core restart:

NOT APPROVED

Database changes:

NOT APPROVED

Billing changes:

NOT APPROVED

companyId changes:

NOT APPROVED

Workflow changes:

NOT APPROVED

API contract changes:

NOT APPROVED

Production deployment:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

Docker compose down:

NOT APPROVED

Docker compose up:

NOT APPROVED

Volume deletion:

NOT APPROVED

Database reset:

NOT APPROVED

Seed execution:

NOT APPROVED

─────────────────────────────────────
## 11) Final Classification
─────────────────────────────────────

Post-switch browser validation:

PASSED

VIEWER dashboard RBAC visibility:

PASSED

VIEWER sidebar RBAC visibility:

PASSED

VIEWER Sites / Projects read-only behavior:

PASSED

VIEWER Safety Reports read-only behavior:

PASSED

VIEWER Action Plans read-only behavior:

PASSED

Mobile FAB empty actions fix:

PASSED

Dashboard Quick Actions RBAC fix:

PASSED

Controlled local Web runtime switch:

PASSED

Production deployment:

NOT APPROVED

First real external pilot:

NOT APPROVED YET

Was anything deleted?

NO
