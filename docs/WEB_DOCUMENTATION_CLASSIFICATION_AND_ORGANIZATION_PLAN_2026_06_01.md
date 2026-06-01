# HAWANA HSE — WEB DOCUMENTATION CLASSIFICATION AND ORGANIZATION PLAN
# خطة تصنيف وتنظيم توثيق الويب — Hawana HSE

Document Type: Documentation Classification and Organization Plan
Repository: hawana-hse-web-admin
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Status: CLASSIFICATION PLAN CREATED — NO FILE MOVEMENT APPROVED
Date: 2026-06-01

────────────────────────────────────────────
1) PURPOSE
────────────────────────────────────────────

This document classifies the current Web documentation state after the controlled Web deployment closure.

The purpose is to create a safe organization plan before any future physical documentation cleanup.

This document does not approve moving files.

This document does not approve deleting files.

This document does not approve renaming files.

This document does not approve changing code.

This document does not approve production action.

────────────────────────────────────────────
2) CURRENT WEB STATE ANCHOR
────────────────────────────────────────────

The current Web source-of-truth anchor is:

docs/deployment/WEB_CURRENT_STATE_AFTER_CONTROLLED_DEPLOYMENT_CLOSURE_2026_06_01.md

Current Git state at the time of this classification plan:

- Branch: phase4.3-web-hardening
- Current deployment closure tag: web-current-state-after-controlled-deployment-closure-2026-06-01
- Web controlled deployment: CLOSED
- Web current state: LOCKED
- Web runtime: STABLE
- Backup Web container: PRESERVED
- Backup deletion: NOT APPROVED
- First real pilot: NOT APPROVED

Architecture remains:

Web → API Proxy → Core → PostgreSQL

────────────────────────────────────────────
3) CURRENT DOCUMENTATION PROBLEM
────────────────────────────────────────────

The Web repository now contains a large number of documentation files.

This is expected because the Web deployment was executed through strict governance checkpoints.

The current issue is not technical instability.

The current issue is documentation density.

The documentation is controlled, committed, tagged, and traceable, but not yet physically organized into a clean folder structure.

Current status:

CONTROLLED BUT NOT PHYSICALLY ORGANIZED

This is acceptable temporarily.

────────────────────────────────────────────
4) DOCUMENTATION CATEGORIES
────────────────────────────────────────────

The current Web documentation can be classified into the following logical categories:

1. Current State Anchors

Examples:

- docs/CURRENT_STATUS.md
- docs/CHAT_HANDOFF_CONTEXT.md
- docs/deployment/WEB_CURRENT_STATE_AFTER_CONTROLLED_DEPLOYMENT_CLOSURE_2026_06_01.md

Purpose:

These files define the latest source of truth for future work.

2. Deployment Governance

Examples:

- docs/deployment/WEB_DEPLOYMENT_RUNBOOK.md
- docs/deployment/WEB_CURRENT_STATE_INSPECTION_AND_DEPLOYMENT_READINESS_PLAN_2026_06_01.md
- docs/deployment/WEB_LOCAL_BUILD_APPROVAL_CHECKPOINT_2026_06_01.md
- docs/deployment/WEB_LOCAL_BUILD_VALIDATION_RESULT_2026_06_01.md
- docs/deployment/WEB_DOCKER_IMAGE_BUILD_APPROVAL_CHECKPOINT_2026_06_01.md
- docs/deployment/WEB_DOCKER_IMAGE_BUILD_PUSH_VALIDATION_RESULT_2026_06_01.md
- docs/deployment/WEB_SERVER_PULL_APPROVAL_CHECKPOINT_2026_06_01.md
- docs/deployment/WEB_SERVER_PULL_VALIDATION_RESULT_2026_06_01.md
- docs/deployment/WEB_CONTROLLED_CONTAINER_REPLACEMENT_APPROVAL_CHECKPOINT_2026_06_01.md
- docs/deployment/WEB_CONTROLLED_CONTAINER_REPLACEMENT_RESULT_2026_06_01.md
- docs/deployment/WEB_POST_REPLACEMENT_FUNCTIONAL_VALIDATION_APPROVAL_CHECKPOINT_2026_06_01.md
- docs/deployment/WEB_POST_REPLACEMENT_FUNCTIONAL_VALIDATION_RESULT_2026_06_01.md
- docs/deployment/WEB_AUTHENTICATED_FUNCTIONAL_VALIDATION_APPROVAL_CHECKPOINT_2026_06_01.md
- docs/deployment/WEB_AUTHENTICATED_FUNCTIONAL_VALIDATION_RESULT_2026_06_01.md
- docs/deployment/WEB_FINAL_DEPLOYMENT_CLOSURE_APPROVAL_CHECKPOINT_2026_06_01.md
- docs/deployment/WEB_CONTROLLED_DEPLOYMENT_FINAL_CLOSURE_2026_06_01.md

Purpose:

These files prove the controlled Web deployment chain.

3. Findings Register Documents

Examples:

- docs/FINDINGS_REGISTER.md
- docs/FINDINGS_REGISTER_WEB_FINAL_STABILITY_BASELINE_SNAPSHOT_2026_05_31.md
- docs/FINDINGS_REGISTER_WEB_RUNTIME_SOURCE_DRIFT_CLASSIFICATION_2026_05_31.md
- docs/FINDINGS_REGISTER_WEB_LOCAL_RUNTIME_REFRESH_FINAL_CLOSURE_2026_05_31.md

Purpose:

These files record defects, drift, validation findings, and closure evidence.

4. First Pilot Readiness Documents

Examples:

- docs/FIRST_PILOT_WEB_READINESS_CURRENT_CHECKLIST_AFTER_ADDITIONAL_ROLE_USERS_CLOSURE_2026_05_30.md
- docs/FIRST_PILOT_WEB_TO_CORE_READINESS_HANDOFF_AFTER_WEB_TRACKS_CLOSURE_2026_05_30.md
- docs/FIRST_PILOT_ADDITIONAL_ROLE_USERS_READ_ONLY_ACCESS_CLOSURE_REPORT_2026_05_30.md
- docs/FIRST_PILOT_WEB_LOGOUT_TRACK_CLOSURE_DECISION_2026_05_30.md

Purpose:

These files record pilot-related Web readiness work.

5. System Architecture Documents

Examples:

- docs/system/SYSTEM_ARCHITECTURE_FINAL.md
- docs/system/SYSTEM_API_CONTRACT_LOCKED.md
- docs/system/SYSTEM_EXECUTION_PLAN_LOCKED.md
- docs/system/SYSTEM_OVERVIEW_FINAL.md
- docs/system/WEB_DOCS_GOVERNANCE_INDEX_2026_05_18.md

Purpose:

These files define Web system design and governance.

6. Web Technical Reference Documents

Examples:

- docs/web/WEB_ARCHITECTURE_FINAL.md
- docs/web/WEB_ADMIN_TECHNICAL_REFERENCE_FINAL.md
- docs/web/WEB_UI_PATTERN_FINAL.md

Purpose:

These files define Web implementation patterns and UI architecture.

7. Audit Documents

Examples:

- docs/audit/AUDIT_WEB_API_USAGE.md
- docs/audit/AUDIT_WEB_BUSINESS_LOGIC.md
- docs/audit/AUDIT_WEB_FETCH_LAYER.md
- docs/audit/AUDIT_WEB_MULTI_TENANT.md
- docs/audit/AUDIT_WEB_FINAL_REPORT.md

Purpose:

These files prove architecture compliance and Web audit results.

8. Runtime Evidence

Examples:

- docs/runtime-evidence/web-container-inspect-before-refresh-2026-05-31.json
- docs/runtime-evidence/web-image-inspect-before-refresh-2026-05-31.json

Purpose:

These files store runtime evidence snapshots.

9. Legacy or Historical Artifacts

Examples:

- docs/legacy/web-architecture-upgrade-local-changes.patch

Purpose:

These files are historical and should not be treated as current source of truth.

────────────────────────────────────────────
5) PROPOSED FUTURE ORGANIZATION MODEL
────────────────────────────────────────────

Future physical organization may use the following structure:

docs/
  README.md
  CURRENT_STATUS.md
  CHAT_HANDOFF_CONTEXT.md
  FINDINGS_REGISTER.md

  deployment/
    runbooks/
    controlled-deployments/
    current-state/
    approvals/
    results/
    closures/

  findings/
    open/
    closed/
    runtime-drift/
    ui-visibility/
    pilot-readiness/

  pilot/
    readiness/
    auth/
    role-users/
    logout/
    handoff/

  governance/
    architecture/
    audit/
    system/
    web-patterns/

  runtime-evidence/

  legacy/

This is a proposed model only.

No file movement is approved by this document.

────────────────────────────────────────────
6) ORGANIZATION RULES
────────────────────────────────────────────

Any future physical documentation cleanup must follow these rules:

1. Create a separate execution plan.
2. List every source file and target path.
3. Move files only with git mv.
4. Do not delete files.
5. Do not rename meaning unless documented.
6. Do not modify file contents during movement unless separately approved.
7. Preserve Git history where possible.
8. Verify references after movement.
9. Update README and governance index after movement.
10. Commit movement separately from content changes.

Forbidden:

- Manual uncontrolled file movement
- File deletion
- Combining docs movement with code changes
- Combining docs movement with deployment
- Moving current state anchor without updating references
- Moving runbook without updating docs entry points
- Moving pilot evidence before pilot governance review

────────────────────────────────────────────
7) CURRENT PRIORITY DECISION
────────────────────────────────────────────

Physical documentation organization is useful, but not urgent.

The current Web deployment is closed and stable.

The more important immediate decisions are:

1. Whether to start Pilot Governance Review.
2. Whether to create a controlled cleanup plan for preserved Web backup container.
3. Whether to physically organize Web documentation later.

Recommended order:

1. Keep Web deployment closed.
2. Create this classification plan.
3. Do not move docs yet.
4. Decide next track separately.

────────────────────────────────────────────
8) DO NOT MOVE FILES YET
────────────────────────────────────────────

DO NOT MOVE FILES YET.

The current docs are dense but stable.

Any physical reorganization must be done later through a separate controlled plan.

No current deployment, runtime, or pilot work requires immediate docs movement.

────────────────────────────────────────────
9) CURRENT CLASSIFICATION SUMMARY
────────────────────────────────────────────

Web docs are currently classified as:

CONTROLLED BUT NOT PHYSICALLY ORGANIZED

This is acceptable temporarily because:

- Web deployment runbook has governance addendum
- controlled deployment chain exists
- final closure exists
- current state anchor exists
- Web runtime is stable
- remote branch is aligned
- working tree was clean before this doc
- backup deletion is not approved
- pilot execution is not approved

Physical folder cleanup is useful, but not urgent.

────────────────────────────────────────────
10) NEXT VALID ACTION
────────────────────────────────────────────

The next valid action after this classification plan is one of:

Option A:

Commit and tag this classification plan.

Option B:

Create Pilot Governance Review Plan.

Option C:

Create controlled backup container cleanup classification plan.

Option D:

Create Web docs physical organization execution plan later.

Recommended immediate action:

Commit and tag this classification plan first.

Then decide between:

- Pilot Governance Review
- Backup container cleanup classification
- Web docs physical organization plan

────────────────────────────────────────────
11) SAFETY CONFIRMATION
────────────────────────────────────────────

This document is documentation only.

No server action was executed by creating this document.

No container action was executed by creating this document.

No Docker run was executed by creating this document.

No Docker rm was executed by creating this document.

No Docker Compose action was executed.

No backup deletion was executed.

No pilot execution was approved.

No Core change was made.

No DB change was made.

No Billing change was made.

No companyId change was made.

No Workflow change was made.

No file was moved.

No file was renamed.

No file was deleted.

Was anything deleted by creating this Web docs classification plan?

NO

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────
