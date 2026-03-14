HAWANA HSE — API CONTRACT FREEZE

Project: Hawana HSE Platform
API Version: v1
Status: Frozen for Mobile Integration
Date: Phase 6 Preparation

────────────────────────────────

1. Purpose

This document freezes the current API contract of the Hawana HSE Core API before the start of Phase 6 (Mobile Application Layer).

The goal is to ensure that the mobile application can safely integrate with a stable API without breaking changes during development.

────────────────────────────────

2. Freeze Rule

The following rule applies from this point forward:

The existing API endpoints are considered stable.

Any modification must follow one of these rules:

1. The change must be backward compatible.
2. If backward compatibility cannot be maintained, a new API version must be introduced.

Example:

/v1/safety-reports → existing stable endpoint  
/v2/safety-reports → future incompatiation uses JWT tokens.

The token contains:

userId  
role  
companyId

These fields must remain stable because they are used by both Web Admin and Mobile clients.

────────────────────────────────

4. Users Endpoints

GET /v1/users  
GET /v1/users/{id}  
POST /v1/users  
PATCH /v1/users/{id}

Users are always scoped by companyId to enforce tenant isolation.

────────────────────────────────

5. Companies Endpoints

GET /v1/companies  
GET /v1/companies/{id}  
POST /v1/companies  
PATCHoints

GET /v1/sites-projects  
GET /v1/sites-projects/{id}  
POST /v1/sites-projects  
PATCH /v1/sites-projects/{id}

Sites / Projects are operational locations belonging to a company.

────────────────────────────────

7. Safety Reports Endpoints

GET /v1/safety-reports  
GET /v1/safety-reports/{id}  
POST /v1/safety-reports  
PATCH /v1/safety-reports/{id}

Workflow states:

OPEN  
IN_PROGRESS  
CLOSED

Once CLOSED, the report should not allow further modifications.

────────────────────────────────

8. Action Plans Endpoints

GET /v1/action-plans  
GET /v1/action-plans/{id}  
POST /v1/action-plans  
PATCH /v1/action-plans/{id}

Workflow states:

OPEN  
IN_PROGRESS  
COMPLETED  
VERIFIED

VERIFIED actions must be treated as read-only.

────────────────────────────────

9. Health and Monitoring Endpoints

GET /v1/healpanyId

No request may access data outside its tenant scope.

────────────────────────────────

11. Change Policy After Freeze

After this contract freeze:

No breaking changes may be introduced to the v1 API.

Any incompatible change must be implemented through:

/v2 API version

────────────────────────────────

End of Document
