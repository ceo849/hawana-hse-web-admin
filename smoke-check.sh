#!/usr/bin/env bash
set -euo pipefail

BASE_URL="https://hawanaglobal.com"
EMAIL="owner@hawana.com"
PASSWORD="Hawana@2026"

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required. Install it first."
  exit 1
fi

TMP_DIR="$(mktemp -d)"
COOKIE_JAR="$TMP_DIR/cookies.txt"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "========================================"
echo "Hawana HSE Production Smoke Check"
echo "Base URL: $BASE_URL"
echo "========================================"

echo
echo "[1] Login..."
LOGIN_RESPONSE="$(curl -sS -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -c "$COOKIE_JAR" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")"

ACCESS_TOKEN="$(echo "$LOGIN_RESPONSE" | jq -r '.access_token // empty')"

if [[ -z "$ACCESS_TOKEN" ]]; then
  echo "FAIL: Login failed"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo "OK: Login success"

auth_header() {
  echo "Authorization: Bearer $ACCESS_TOKEN"
}

call_api() {
  local path="$1"
  curl -sS "$BASE_URL$path" \
    -H "$(auth_header)"
}

echo
echo "[2] Health..."
HEALTH="$(curl -sS "$BASE_URL/api/v1/health")"
HEALTH_STATUS="$(echo "$HEALTH" | jq -r '.status // empty')"

if [[ "$HEALTH_STATUS" != "ok" ]]; then
  echo "FAIL: Health endpoint is not OK"
  echo "$HEALTH"
  exit 1
fi

echo "OK: Health = ok"

echo
echo "[3] Users..."
USERS_JSON="$(call_api "/api/v1/users")"
USERS_COUNT="$(echo "$USERS_JSON" | jq 'if type=="array" then length elif .data then (.data|length) else 0 end')"
echo "Users count: $USERS_COUNT"

echo
echo "[4] Companies..."
COMPANIES_JSON="$(call_api "/api/v1/companies")"
COMPANIES_COUNT="$(echo "$COMPANIES_JSON" | jq 'if type=="array" then length elif .data then (.data|length) else 0 end')"
echo "Companies count: $COMPANIES_COUNT"

echo
echo "[5] Sites / Projects..."
SITES_JSON="$(call_api "/api/v1/sites-projects")"
SITES_COUNT="$(echo "$SITES_JSON" | jq 'if type=="array" then length elif .data then (.data|length) else 0 end')"
echo "Sites / Projects count: $SITES_COUNT"

echo
echo "[6] Safety Reports..."
REPORTS_JSON="$(call_api "/api/v1/safety-reports?page=1&limit=20")"
REPORTS_COUNT="$(echo "$REPORTS_JSON" | jq 'if .data then (.data|length) elif type=="array" then length else 0 end')"
echo "Safety Reports count: $REPORTS_COUNT"

echo
echo "[7] Action Plans..."
ACTIONS_JSON="$(call_api "/api/v1/action-plans?page=1&limit=20")"
ACTIONS_COUNT="$(echo "$ACTIONS_JSON" | jq 'if .data then (.data|length) elif type=="array" then length else 0 end')"
echo "Action Plans count: $ACTIONS_COUNT"

echo
echo "[8] Basic relationship checks..."

FIRST_COMPANY_ID="$(echo "$COMPANIES_JSON" | jq -r '
  if type=="array" and length>0 then .[0].id
  elif .data and (.data|length>0) then .data[0].id
  else empty
  end
')"

if [[ -z "$FIRST_COMPANY_ID" ]]; then
  echo "FAIL: No company found, cannot validate relations"
  exit 1
fi

echo "Reference companyId: $FIRST_COMPANY_ID"

USER_COMPANY_MISMATCH="$(echo "$USERS_JSON" | jq --arg cid "$FIRST_COMPANY_ID" '
  if type=="array" then
    [ .[] | select(.companyId != $cid) ] | length
  elif .data then
    [ .data[] | select(.companyId != $cid) ] | length
  else 0
  end
')"

if [[ "$USER_COMPANY_MISMATCH" != "0" ]]; then
  echo "WARN: Some users belong to a different companyId"
else
  echo "OK: Users linked to expected companyId"
fi

SITE_COMPANY_MISMATCH="$(echo "$SITES_JSON" | jq --arg cid "$FIRST_COMPANY_ID" '
  if type=="array" then
    [ .[] | select(.companyId? != null and .companyId != $cid) ] | length
  elif .data then
    [ .data[] | select(.companyId? != null and .companyId != $cid) ] | length
  else 0
  end
')"

if [[ "$SITE_COMPANY_MISMATCH" != "0" ]]; then
  echo "WARN: Some sites/projects belong to a different companyId"
else
  echo "OK: Sites/Projects company relation looks consistent"
fi

REPORT_COMPANY_MISMATCH="$(echo "$REPORTS_JSON" | jq --arg cid "$FIRST_COMPANY_ID" '
  if .data then
    [ .data[] | select(.companyId? != null and .companyId != $cid) ] | length
  elif type=="array" then
    [ .[] | select(.companyId? != null and .companyId != $cid) ] | length
  else 0
  end
')"

if [[ "$REPORT_COMPANY_MISMATCH" != "0" ]]; then
  echo "WARN: Some safety reports belong to a different companyId"
else
  echo "OK: Safety Reports company relation looks consistent"
fi

ACTION_COMPANY_MISMATCH="$(echo "$ACTIONS_JSON" | jq --arg cid "$FIRST_COMPANY_ID" '
  if .data then
    [ .data[] | select(.companyId? != null and .companyId != $cid) ] | length
  elif type=="array" then
    [ .[] | select(.companyId? != null and .companyId != $cid) ] | length
  else 0
  end
')"

if [[ "$ACTION_COMPANY_MISMATCH" != "0" ]]; then
  echo "WARN: Some action plans belong to a different companyId"
else
  echo "OK: Action Plans company relation looks consistent"
fi

echo
echo "========================================"
echo "Smoke check finished"
echo "========================================"
