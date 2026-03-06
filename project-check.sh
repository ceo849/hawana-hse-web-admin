#!/usr/bin/env bash
set -e

echo "=============================="
echo "1) TypeScript check"
echo "=============================="
npx tsc --noEmit || true
echo

echo "=============================="
echo "2) ESLint check"
echo "=============================="
npm run lint || true
echo

echo "=============================="
echo "3) Next build check"
echo "=============================="
npm run build || true
echo

echo "=============================="
echo "4) Find auth/login related files"
echo "=============================="
find app src -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | grep -E "login|logout|auth|users|safety-reports|action-plans" || true
echo

echo "=============================="
echo "5) Search for cookie usage"
echo "=============================="
grep -RIn "access_token\|refresh_token\|cookies.set\|cookieStore.get" app src 2>/dev/null || true
echo

echo "=============================="
echo "6) Search for direct backend calls"
echo "=============================="
grep -RIn "127.0.0.1:3001\|localhost:3001\|/v1/" app src 2>/dev/null || true
echo

echo "=============================="
echo "7) Search for redirects to login"
echo "=============================="
grep -RIn "redirect('/login')\|redirect(\"/login\")" app src 2>/dev/null || true
echo

echo "=============================="
echo "8) Search for api/auth/login route usage"
echo "=============================="
grep -RIn "/api/auth/login\|auth/login" app src 2>/dev/null || true
echo

echo "=============================="
echo "Done"
echo "=============================="
