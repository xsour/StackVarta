#!/usr/bin/env bash
set -euo pipefail

URL="${1:-}"

if [ -z "$URL" ]; then
  echo "Usage: bash scripts/check-site.sh https://your-project.railway.app"
  exit 1
fi

mkdir -p reports

curl -I -L "$URL" > reports/headers.txt
curl -sL "$URL" > reports/curl-result.txt

TITLE=$(grep -oPm1 '(?<=<title>)[^<]+' reports/curl-result.txt || true)
DESCRIPTION=$(grep -oPm1 '(?<=<meta name="description" content=")[^"]+' reports/curl-result.txt || true)
BODY_PREVIEW=$(sed 's/<script[^>]*>.*<\/script>//g' reports/curl-result.txt | sed 's/<style[^>]*>.*<\/style>//g' | sed 's/<[^>]*>/ /g' | tr -s ' ' | head -c 300 || true)

cat > reports/summary.md <<EOF
# Site inspection summary

- URL: $URL
- Title: ${TITLE:-not found}
- Meta description: ${DESCRIPTION:-not found}
- Body preview: ${BODY_PREVIEW:-not found}
EOF

echo "Saved reports/headers.txt, reports/curl-result.txt, reports/summary.md"
