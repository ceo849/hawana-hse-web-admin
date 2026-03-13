#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://hawanaglobal.com}"
EMAIL="${EMAIL:-owner@hawana.com}"
PASSWORD="${PASSWORD:-Hawana@2026}"

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required."
  exit 1
fi

auth_post() {
  local path="$1"
  local json_body="$2"
  curl -sS -X POST "$BASE_URL$path" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$json_body"
}

auth_get() {
  local path="$1"
  curl -sS "$BASE_URL$path" \
    -H "Authorization: Bearer $ACCESS_TOKEN"
}

echo "========================================"
echo "Hawana HSE Smoke Test"
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

SITE_NAME="Smoke Site $(date +%s)"
SITE_LOCATION="Alexandria"
SITE_STATUS="ACTIVE"

REPORT_TITLE="Smoke Safety Report $(date +%s)"
REPORT_DESCRIPTION="Automated smoke test report"

ACTION_TITLE="Smoke Action Plan $(date +%s)"
ACTION_DESCRIPTION="Automated smoke test action plan"
ACTION_DUE_DATE="$(
  date -u -v+7d +%Y-%m-%d 2>/dev/null || date -u -d '+7 days' +%Y-%m-%d
)"

echo
echo "[2] Create Site / Project"
SITE_PAYLOAD="$(jq -n \
  --arg name "$SITE_NAME" \
  --arg location "$SITE_LOCATION" \
  --arg status "$SITE_STATUS" \
  '{name:$name, location:$location, status:$status}')"

SITE_RESPONSE="$(auth_post "/api/v1/sites-projects" "$SITE_PAYLOAD")"
SITE_ID="$(echo "$SITE_RESPONSE" | jq -r '.id // empty')"

if [[ -z "$SITE_ID" ]]; then
  echo "FAIL: Site creation failed"
  echo "$SITE_RESPONSE"
  exit 1
fi

echo "OK: Site created ($SITE_ID)"

echo
echo "[3] Create Safety Report"
REPORT_PAYLOAD="$(jq -n \
  --arg title "$REPORT_TITLE" \
  --arg description "$REPORT_DESCRIPTION" \
  --arg siteProjectId "$SITE_ID" \
  '{title:$title, description:$description, siteProjectId:$siteProjectId}')"

REPORT_RESPONSE="$(auth_post "/api/v1/safety-reports" "$REPORT_PAYLOAD")"
REPORT_ID="$(echo "$REPORT_RESPONSE" | jq -r '.id // empty')"

if [[ -z "$REPORT_ID" ]]; then
  echo "FAIL: Safety Report creation failed"
  echo "$REPORT_RESPONSE"
  exit 1
fi

echo "OK: Safety Report created ($REPORT_ID)"

echo
echo "[4] Get first assignable user"
USERS_RESPONSE="$(auth_get "/api/v1/users")"
ASSIGNED_TO_USER_ID="$(echo "$USERS_RESPONSE" | jq -r '
  if type=="array" and length>0 then .[0].id
  elif .data and (.data|type=="array") and (.data|length>0) then .data[0].id
  else empty
  end
')"

if [[ -z "$ASSIGNED_TO_USER_ID" ]]; then
  echo "FAIL: No user available for assignment"
  echo "$USERS_RESPONSE"
  exit 1
fi

echo "OK: User found ($ASSIGNED_TO_USER_ID)"

echo
echo "[5] Create Action Plan"
ACTION_PAYLOAD="$(jq -n \
  --arg title "$ACTION_TITLE" \
  --arg description "$ACTION_DESCRIPTION" \
  --arg safetyReportId "$REPORT_ID" \
  --arg assignedToUserId "$ASSIGNED_TO_USER_ID" \
  --arg dueDate "${ACTION_DUE_DATE}T00:00:00.000Z" \
  '{
    title:$title,
    description:$description,
    safetyReportId:$safetyReportId,
    assignedToUserId:$assignedToUserId,
    dueDate:$dueDate
  }')"

ACTION_RESPONSE="$(auth_post "/api/v1/action-plans" "$ACTION_PAYLOAD")"
ACTION_ID="$(echo "$ACTION_RESPONSE" | jq -r '.id // empty')"

if [[ -z "$ACTION_ID" ]]; then
  echo "FAIL: Action Plan creation failed"
  echo "$ACTION_RESPONSE"
  exit 1
fi

echo "OK: Action Plan created ($ACTION_ID)"

echo
echo "[6] Verify workflow relations"

REPORT_DETAIL="$(auth_get "/api/v1/safety-reports/$REPORT_ID")"
REPORT_SITE_ID="$(echo "$REPORT_DETAIL" | jq -r '.siteProjectId // empty')"

if [[ "$REPORT_SITE_ID" != "$SITE_ID" ]]; then
  echo "FAIL: Safety Report is not linked to Site"
  echo "$REPORT_DETAIL"
  exit 1
fi

ACTION_DETAIL="$(auth_get "/api/v1/action-plans/$ACTION_ID")"
ACTION_REPORT_ID="$(echo "$ACTION_DETAIL" | jq -r '.safetyReportId // empty')"
ACTION_ASSIGNED_ID="$(echo "$ACTION_DETAIL" | jq -r '.assignedToUserId // empty')"

if [[ "$ACTION_REPORT_ID" != "$REPORT_ID" ]]; then
  echo "FAIL: Action Plan is not linked to Safety Report"
  echo "$ACTION_DETAIL"
  exit 1
fi

if [[ "$ACTION_ASSIGNED_ID" != "$ASSIGNED_TO_USER_ID" ]]; then
  echo "FAIL: Action Plan assigned user mismatch"
  echo "$ACTION_DETAIL"
  exit 1
fi

echo "OK: Workflow verified"

echo
echo "========================================"
echo "SMOKE TEST PASSED"
echo "========================================"
echo "Site ID         : $SITE_ID"
echo "Safety Report ID: $REPORT_ID"
echo "Action Plan ID  : $ACTION_ID"
