#!/usr/bin/env bash
set -euo pipefail

BASE_URL="https://hawanaglobal.com"
EMAIL="owner@hawana.com"
PASSWORD="Hawana@2026"

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required."
  exit 1
fi

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

json_count() {
  jq '
    if type == "array" then length
    elif type == "object" and has("data") and (.data | type == "array") then (.data | length)
    else 0
    end
  '
}

json_first() {
  jq '
    if type == "array" and length > 0 then .[0]
    elif type == "object" and has("data") and (.data | type == "array") and (.data | length > 0) then .data[0]
    else empty
    end
  '
}

json_items() {
  jq '
    if type == "array" then .
    elif type == "object" and has("data") and (.data | type == "array") then .data
    else []
    end
  '
}

auth_get() {
  local path="$1"
  curl -sS "$BASE_URL$path" \
    -H "Authorization: Bearer $ACCESS_TOKEN"
}

echo "========================================"
echo "Hawana HSE Deep Smoke Check"
echo "Base URL: $BASE_URL"
echo "========================================"

echo
echo "[1] Login"
LOGIN_RESPONSE="$(curl -sS -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")"

ACCESS_TOKEN="$(echo "$LOGIN_RESPONSE" | jq -r '.access_token // empty')"

if [[ -z "$ACCESS_TOKEN" ]]; then
  echo "FAIL: Login failed"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo "OK: Login success"

echo
echo "[2] Health"
HEALTH="$(curl -sS "$BASE_URL/api/v1/health")"
HEALTH_STATUS="$(echo "$HEALTH" | jq -r '.status // empty')"

if [[ "$HEALTH_STATUS" != "ok" ]]; then
  echo "FAIL: Health failed"
  echo "$HEALTH"
  exit 1
fi

echo "OK: Health = ok"

echo
echo "[3] Fetch collections"
USERS_JSON="$(auth_get "/api/v1/users")"
COMPANIES_JSON="$(auth_get "/api/v1/companies")"
SITES_JSON="$(auth_get "/api/v1/sites-projects")"
REPORTS_JSON="$(auth_get "/api/v1/safety-reports?page=1&limit=20")"
ACTIONS_JSON="$(auth_get "/api/v1/action-plans?page=1&limit=20")"

USERS_COUNT="$(echo "$USERS_JSON" | json_count)"
COMPANIES_COUNT="$(echo "$COMPANIES_JSON" | json_count)"
SITES_COUNT="$(echo "$SITES_JSON" | json_count)"
REPORTS_COUNT="$(echo "$REPORTS_JSON" | json_count)"
ACTIONS_COUNT="$(echo "$ACTIONS_JSON" | json_count)"

echo "Users count          : $USERS_COUNT"
echo "Companies count      : $COMPANIES_COUNT"
echo "Sites / Projects     : $SITES_COUNT"
echo "Safety Reports count : $REPORTS_COUNT"
echo "Action Plans count   : $ACTIONS_COUNT"

echo
echo "[4] Basic company consistency"

REF_COMPANY_ID="$(echo "$COMPANIES_JSON" | json_first | jq -r '.id // empty')"

if [[ -z "$REF_COMPANY_ID" ]]; then
  echo "FAIL: No company found"
  exit 1
fi

echo "Reference companyId: $REF_COMPANY_ID"

USER_MISMATCH="$(echo "$USERS_JSON" | json_items | jq --arg cid "$REF_COMPANY_ID" '[ .[] | select(.companyId? != null and .companyId != $cid) ] | length')"
SITE_MISMATCH="$(echo "$SITES_JSON" | json_items | jq --arg cid "$REF_COMPANY_ID" '[ .[] | select(.companyId? != null and .companyId != $cid) ] | length')"
REPORT_MISMATCH="$(echo "$REPORTS_JSON" | json_items | jq --arg cid "$REF_COMPANY_ID" '[ .[] | select(.companyId? != null and .companyId != $cid) ] | length')"
ACTION_MISMATCH="$(echo "$ACTIONS_JSON" | json_items | jq --arg cid "$REF_COMPANY_ID" '[ .[] | select(.companyId? != null and .companyId != $cid) ] | length')"

echo "Users company mismatches        : $USER_MISMATCH"
echo "Sites company mismatches        : $SITE_MISMATCH"
echo "Safety Reports company mismatch : $REPORT_MISMATCH"
echo "Action Plans company mismatch   : $ACTION_MISMATCH"

echo
echo "[5] Detail endpoint checks"

FIRST_USER_ID="$(echo "$USERS_JSON" | json_first | jq -r '.id // empty')"
FIRST_SITE_ID="$(echo "$SITES_JSON" | json_first | jq -r '.id // empty')"
FIRST_REPORT_ID="$(echo "$REPORTS_JSON" | json_first | jq -r '.id // empty')"
FIRST_ACTION_ID="$(echo "$ACTIONS_JSON" | json_first | jq -r '.id // empty')"

if [[ -n "$FIRST_USER_ID" ]]; then
  USER_DETAIL="$(auth_get "/api/v1/users/$FIRST_USER_ID")"
  USER_DETAIL_ID="$(echo "$USER_DETAIL" | jq -r '.id // empty')"
  [[ "$USER_DETAIL_ID" == "$FIRST_USER_ID" ]] && echo "OK: User detail endpoint" || echo "WARN: User detail endpoint"
fi

if [[ -n "$FIRST_SITE_ID" ]]; then
  SITE_DETAIL="$(auth_get "/api/v1/sites-projects/$FIRST_SITE_ID")"
  SITE_DETAIL_ID="$(echo "$SITE_DETAIL" | jq -r '.id // empty')"
  [[ "$SITE_DETAIL_ID" == "$FIRST_SITE_ID" ]] && echo "OK: Site detail endpoint" || echo "WARN: Site detail endpoint"
fi

if [[ -n "$FIRST_REPORT_ID" ]]; then
  REPORT_DETAIL="$(auth_get "/api/v1/safety-reports/$FIRST_REPORT_ID")"
  REPORT_DETAIL_ID="$(echo "$REPORT_DETAIL" | jq -r '.id // empty')"
  [[ "$REPORT_DETAIL_ID" == "$FIRST_REPORT_ID" ]] && echo "OK: Safety Report detail endpoint" || echo "WARN: Safety Report detail endpoint"
fi

if [[ -n "$FIRST_ACTION_ID" ]]; then
  ACTION_DETAIL="$(auth_get "/api/v1/action-plans/$FIRST_ACTION_ID")"
  ACTION_DETAIL_ID="$(echo "$ACTION_DETAIL" | jq -r '.id // empty')"
  [[ "$ACTION_DETAIL_ID" == "$FIRST_ACTION_ID" ]] && echo "OK: Action Plan detail endpoint" || echo "WARN: Action Plan detail endpoint"
fi

echo
echo "[6] Relationship checks (when data exists)"

if [[ "$REPORTS_COUNT" -gt 0 ]]; then
  BROKEN_REPORT_COMPANY="$(echo "$REPORTS_JSON" | json_items | jq --arg cid "$REF_COMPANY_ID" '[ .[] | select(.companyId? != null and .companyId != $cid) ] | length')"
  echo "Safety Report -> Company broken links: $BROKEN_REPORT_COMPANY"

  if [[ "$SITES_COUNT" -gt 0 ]]; then
    SITE_IDS_JSON="$(echo "$SITES_JSON" | json_items | jq '[ .[].id ]')"
    BROKEN_REPORT_SITE="$(echo "$REPORTS_JSON" | json_items | jq --argjson siteIds "$SITE_IDS_JSON" '
      [
        .[]
        | select(.siteProjectId? != null)
        | select((.siteProjectId as $id | ($siteIds | index($id))) == null)
      ] | length
    ')"
    echo "Safety Report -> Site broken links: $BROKEN_REPORT_SITE"
  fi
else
  echo "INFO: No safety reports yet, skipped report relation checks"
fi

if [[ "$ACTIONS_COUNT" -gt 0 ]]; then
  BROKEN_ACTION_COMPANY="$(echo "$ACTIONS_JSON" | json_items | jq --arg cid "$REF_COMPANY_ID" '[ .[] | select(.companyId? != null and .companyId != $cid) ] | length')"
  echo "Action Plan -> Company broken links: $BROKEN_ACTION_COMPANY"

  if [[ "$REPORTS_COUNT" -gt 0 ]]; then
    REPORT_IDS_JSON="$(echo "$REPORTS_JSON" | json_items | jq '[ .[].id ]')"
    BROKEN_ACTION_REPORT="$(echo "$ACTIONS_JSON" | json_items | jq --argjson reportIds "$REPORT_IDS_JSON" '
      [
        .[]
        | select(.safetyReportId? != null)
        | select((.safetyReportId as $id | ($reportIds | index($id))) == null)
      ] | length
    ')"
    echo "Action Plan -> Safety Report broken links: $BROKEN_ACTION_REPORT"
  fi
else
  echo "INFO: No action plans yet, skipped action plan relation checks"
fi

echo
echo "[7] Final status"

if [[ "$USER_MISMATCH" == "0" && "$SITE_MISMATCH" == "0" && "$REPORT_MISMATCH" == "0" && "$ACTION_MISMATCH" == "0" ]]; then
  echo "OK: Core collections and basic tenant consistency look healthy"
else
  echo "WARN: There are tenant consistency mismatches to review"
fi

echo
echo "========================================"
echo "Deep smoke check finished"
echo "========================================"
