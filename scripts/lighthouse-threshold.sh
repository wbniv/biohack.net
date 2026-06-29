#!/usr/bin/env bash
# Threshold gate. Reads every /tmp/lh/latest/*.run-1.report.json and
# fails (exit 1) if any sampled page drops below Perf / A11y / BP /
# SEO ≥ 95. Writes a Markdown table to $GITHUB_STEP_SUMMARY on both
# pass and fail.
#
# EXCEPTION: /snes/ pages (the playable bsnes-jg WASM emulator demos) are
# ignored — their heavy WASM core skews Perf/A11y and must not gate a deploy.
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: lighthouse-threshold.sh [-h|--help]

Reads /tmp/lh/latest/*.run-1.report.json and fails (exit 1) if any page
drops below 95 on Perf / A11y / BP / SEO. /snes/ pages (the WASM emulator
demos) are excluded from the gate. Writes a Markdown summary to
$GITHUB_STEP_SUMMARY when that env var is set.

Run after `task lighthouse` (or after the CI Lighthouse audit step).

Options:
  -h, --help    Show this help and exit 0.
EOF
}

case "${1:-}" in
  -h|--help) usage; exit 0 ;;
esac

THRESHOLD=95
REPORT_DIR=/tmp/lh/latest
shopt -s nullglob
reports=( "$REPORT_DIR"/*.run-1.report.json )
if [ ${#reports[@]} -eq 0 ]; then
  echo "error: no Lighthouse JSON reports found under $REPORT_DIR" >&2
  exit 2
fi

# Collect rows: "slug<tab>perf<tab>a11y<tab>bp<tab>seo<tab>status"
rows=()
violations=0
for f in "${reports[@]}"; do
  slug=$(basename "$f" .run-1.report.json)

  # /snes/ demo pages are EXCLUDED from the gate: each boots a multi-MB bsnes-jg WASM core
  # that tanks Perf/A11y in ways that don't reflect site quality, so their scores must not
  # block a deploy. Key off the audited URL path so any /snes/... page (now or later) is
  # ignored automatically. Reported as "— ignored" in the table, never counted as a violation.
  url=$(jq -r '.finalUrl // .requestedUrl // ""' "$f")
  noscheme=${url#*://}
  path=/${noscheme#*/}
  case "$path" in
    /snes/*|/snes)
      rows+=( "$(printf '%s\t%s\t%s\t%s\t%s\t%s' "$slug" "—" "—" "—" "—" "— ignored (/snes/)")" )
      continue
      ;;
  esac

  read -r perf a11y bp seo < <(jq -r '
    [(.categories.performance.score * 100 | round),
     (.categories.accessibility.score * 100 | round),
     (.categories["best-practices"].score * 100 | round),
     (.categories.seo.score * 100 | round)] | @tsv' "$f")
  status="✓"
  for score in "$perf" "$a11y" "$bp" "$seo"; do
    if [ "$score" -lt "$THRESHOLD" ]; then
      status="✗"
      violations=$((violations + 1))
    fi
  done
  rows+=( "$(printf '%s\t%s\t%s\t%s\t%s\t%s' "$slug" "$perf" "$a11y" "$bp" "$seo" "$status")" )
done

emit_table() {
  local out="$1"
  {
    echo
    echo "### Threshold check (≥ ${THRESHOLD})"
    echo
    echo "| Page | Perf | A11y | BP | SEO | Status |"
    echo "|---|---:|---:|---:|---:|:---:|"
    for row in "${rows[@]}"; do
      IFS=$'\t' read -r slug perf a11y bp seo status <<< "$row"
      printf '| %s | %s | %s | %s | %s | %s |\n' "$slug" "$perf" "$a11y" "$bp" "$seo" "$status"
    done
    if [ "$violations" -gt 0 ]; then
      echo
      echo "**$violations score(s) below ${THRESHOLD}.**"
    fi
  } >> "$out"
}

if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  emit_table "$GITHUB_STEP_SUMMARY"
fi
# Always print to stdout too so local runs see the table.
emit_table /dev/stdout

if [ "$violations" -gt 0 ]; then
  echo "::warning::Threshold check failed: $violations score(s) below ${THRESHOLD}."
  exit 1
fi
exit 0
