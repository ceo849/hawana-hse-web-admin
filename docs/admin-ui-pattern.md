# Admin UI Pattern — Hawana HSE

Purpose:
Establish a consistent administrative interface pattern across all entities.

Principle:
Insight first. Control second.

Every administrative entity page follows the same 3-layer structure.

1. List Page

Examples:
 /dashboard/companies
 /dashboard/users
 /dashboard/sites-projects
 /dashboard/safety-reports
 /dashboard/action-plans

Purpose:
- Pagination
- Filtering / search
- Navigation to entity overview

Heavy control actions are not allowed here.


2. Entity Overview

Examples:
 /dashboard/companies/[id]
 /dashboard/users/[id]
 /dashboard/sites-projects/[id]

Structure:

A) Insight Section

Shows operational context of the entity.

Typical information:
- metadata
- createdAt
- updatedAt
- usage metrics
- operational counters

Insight must appear at the top of the page.


B) Control Section

Administrative actions related to the entity.

Examples:
- update entity
- deactivate entity
- delete entity (soft delete when applicable)

Control actions must appear after Insight.


3. Platform Administration

Example:
 /dashboard/admin

Purpose:
Platform-wide observability.

Uses:
 /v1/platform/metrics

This page displays global platform statistics such as:
- total companies
- total users
- total sites
- total safety reports
- total action plans

This section is primarily read-only insight.


Design Rule

Every administrative entity must follow:

List → Overview (Insight) → Control

No page-specific patterns should be introduced without architectural review.

