#!/usr/bin/env bash
# Verify all source-link hrefs in claude.astro resolve (HTTP 200/302).
# Uses raw.githubusercontent.com for blob URLs (avoids HTML redirect overhead);
# falls back to direct curl for tree URLs.
set -euo pipefail

ASTRO="src/pages/claude.astro"
REPO="wbniv/biohack-claude"
RAW_BASE="https://raw.githubusercontent.com/${REPO}/main"
BLOB_PREFIX="https://github.com/${REPO}/blob/main/"
TREE_PREFIX="https://github.com/${REPO}/tree/main/"

fail=0

while IFS= read -r href; do
  if [[ "$href" == "${BLOB_PREFIX}"* ]]; then
    path="${href#"${BLOB_PREFIX}"}"
    url="${RAW_BASE}/${path}"
  else
    url="$href"
  fi

  status=$(curl -sI -o /dev/null -w "%{http_code}" --max-time 10 -L "$url" || true)
  if [[ "$status" == "200" ]]; then
    printf "  \033[32m✓\033[0m %s\n" "$href"
  else
    printf "  \033[31m✗\033[0m %s  [HTTP %s]\n" "$href" "$status"
    fail=1
  fi
done < <(grep -oP 'class="source-link" href="\K[^"]+' "$ASTRO")

if [[ $fail -eq 1 ]]; then
  echo ""
  echo "FAIL: one or more source links are broken" >&2
  exit 1
fi
echo ""
echo "All source links OK"
