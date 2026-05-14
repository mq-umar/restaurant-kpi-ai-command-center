#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Checking public portfolio copy for obvious private-data risks..."

if find . -path './.git' -prune -o \( -name '*.zip' -o -name '*.csv' -o -name '*.xlsx' -o -name '*.xls' -o -name '.env' -o -name '.env.local' \) -print | grep -q .; then
  echo "Blocked: found raw exports, spreadsheets, or env files."
  find . -path './.git' -prune -o \( -name '*.zip' -o -name '*.csv' -o -name '*.xlsx' -o -name '*.xls' -o -name '.env' -o -name '.env.local' \) -print
  exit 1
fi

if grep -RInE 'PRIVATE KEY|client_secret|Bearer [A-Za-z0-9._-]+|sk_live|TOAST_CLIENT_SECRET=.+[^_value]$|SEVENSHIFTS_ACCESS_TOKEN=.+[^_value]$' . --exclude-dir=.git --exclude='check_public_safety.sh'; then
  echo "Blocked: found a possible secret pattern."
  exit 1
fi

if grep -RInE 'TonysTacosDataExports|server.transfer|TonyDashboardData|07caa6ea|9210bb69|410336|328616|328627|328629|492853' . --exclude-dir=.git --exclude='check_public_safety.sh'; then
  echo "Blocked: found a known private identifier."
  exit 1
fi

echo "OK: no obvious private data found."
