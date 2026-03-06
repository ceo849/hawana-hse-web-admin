#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"

echo "== Project =="
echo "$ROOT"
echo

echo "== App Router roots (possible conflict if both exist) =="
for d in app src/app; do
  if [[ -d "$d" ]]; then
    echo "FOUND: $d"
  else
    echo "MISSING: $d"
  fi
done
echo

echo "== Key routes discovered (page/layout/route) =="
find app src/app -type f \( -name "page.tsx" -o -name "layout.tsx" -o -name "route.ts" \) 2>/dev/null \
| sed 's|^\./||' | sort
echo

echo "== Duplicate route files by relative path (conflicts) =="
tmp="$(mktemp)"
find app src/app -type f \( -name "page.tsx" -o -name "layout.tsx" -o -name "route.ts" \) 2>/dev/null \
| sed 's|^\./||' \
| awk '{
  # normalize: strip leading app/ or src/app/ to compare route identity
  p=$0
  sub(/^app\//,"",p)
  sub(/^src\/app\//,"",p)
  print p "\t" $0
}' | sort > "$tmp"

awk -F'\t' '
{
  key=$1; file=$2
  count[key]++
  files[key]=files[key] "\n  - " file
}
END{
  dup=0
  for(k in count){
    if(count[k]>1){
      dup++
      print "DUP:", k, "(x" count[k] ")"
      print files[k]
      print ""
    }
  }
  if(dup==0) print "No duplicates found."
}' "$tmp"
rm -f "$tmp"
echo

echo "== Auth/Login references (where login happens) =="
grep -RIn --color=always -E "(/api/auth/login|auth/login|POST\\(|fetch\\(|apiClient\\.post\\(|access_token|refresh_token)" \
  app src 2>/dev/null | head -n 120 || true
echo

echo "== Redirects to /login (who is forcing login) =="
grep -RIn --color=always -E "redirect\\(['\"]/login['\"]\\)" app src 2>/dev/null || true
echo

echo "== Cookie set/get for access_token (writer/reader mismatch check) =="
echo "-- setters --"
grep -RIn --color=always -E "cookies\\.set\\(['\"]access_token['\"]|response\\.cookies\\.set\\(['\"]access_token['\"]" app src 2>/dev/null || true
echo
echo "-- getters --"
grep -RIn --color=always -E "cookies\\(\\)|cookieStore\\.get\\(['\"]access_token['\"]|getCookieValue\\(.*access_token" app src 2>/dev/null || true
echo

echo "== NEXT_PUBLIC_API_BASE_URL usage (API base consistency) =="
grep -RIn --color=always -E "NEXT_PUBLIC_API_BASE_URL|127\\.0\\.0\\.1:3001|/v1" app src 2>/dev/null || true
echo

echo "== Summary hints =="
echo "1) If you see DUP for login/page.tsx or api/auth/login/route.ts => you have two routers active (app/ + src/app/). Keep ONE."
echo "2) If login page calls a route that doesn't exist (or exists under src/app but app/ is used) => cookie never set => redirect loop."
echo "3) If cookie is set under a Domain attribute that doesn't match localhost => browser won't send it."
