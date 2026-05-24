#!/usr/bin/env bash
# Preflight check before deleting /home/wn/ on Dreamhost.
# Generates a manifest of every file on both sides (path + size)
# and reports: remote-only paths, local-only paths, and size mismatches.
#
# Usage:
#   ./preflight-diff.sh <ssh-target> [remote-path] [local-path]
#
# Examples:
#   ./preflight-diff.sh wn@dreamhost.example.com
#   ./preflight-diff.sh wn@dreamhost.example.com /home/wn ./from-dreamhost
#
# Artifacts are written to ./preflight-out/ for later review.

set -euo pipefail

REMOTE="${1:?usage: $0 <ssh-target> [remote-path] [local-path]}"
REMOTE_PATH="${2:-/home/wn}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOCAL_PATH="${3:-$SCRIPT_DIR/from-dreamhost}"

if [[ ! -d "$LOCAL_PATH" ]]; then
  echo "error: local path does not exist: $LOCAL_PATH" >&2
  exit 1
fi

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "remote:  $REMOTE:$REMOTE_PATH"
echo "local:   $LOCAL_PATH"
echo

# Manifest format: <path>\t<size>\n, sorted by the full line (path first => path order).
# Putting path first avoids the "split a field with embedded whitespace" problem
# that bites when size comes first.

echo "-> generating remote manifest via ssh (can take several minutes on ~1M files)"
# Note: find is run under a login shell, $REMOTE_PATH is expanded remotely.
ssh "$REMOTE" "cd $(printf %q "$REMOTE_PATH") && find . -mindepth 1 -printf '%p\t%s\n' 2>/dev/null | LC_ALL=C sort" \
  > "$WORK/remote.manifest"

echo "-> generating local manifest"
( cd "$LOCAL_PATH" && find . -mindepth 1 -printf '%p\t%s\n' 2>/dev/null | LC_ALL=C sort ) \
  > "$WORK/local.manifest"

remote_count=$(wc -l < "$WORK/remote.manifest")
local_count=$(wc -l < "$WORK/local.manifest")
echo "   remote entries: $remote_count"
echo "   local  entries: $local_count"
echo

# Path-only lists (strip size column)
awk -F'\t' '{print $1}' "$WORK/remote.manifest" > "$WORK/remote.paths"
awk -F'\t' '{print $1}' "$WORK/local.manifest"  > "$WORK/local.paths"

comm -23 "$WORK/remote.paths" "$WORK/local.paths" > "$WORK/remote_only.paths"
comm -13 "$WORK/remote.paths" "$WORK/local.paths" > "$WORK/local_only.paths"

remote_only_count=$(wc -l < "$WORK/remote_only.paths")
local_only_count=$(wc -l < "$WORK/local_only.paths")

echo "=== summary ==="
echo "remote-only paths (on Dreamhost, missing locally):   $remote_only_count"
echo "local-only  paths (local, missing on Dreamhost):     $local_only_count"
echo

echo "=== top 20 remote-only directories (first 3 path levels) ==="
awk -F/ 'NF>=4{print $2"/"$3"/"$4; next} NF==3{print $2"/"$3; next} {print $2}' \
  "$WORK/remote_only.paths" \
  | sort | uniq -c | sort -rn | head -20
echo

echo "=== size mismatches (path on both sides, different size) ==="
# Join on the path column (field 1, tab-delimited). Output: path\tremote_size\tlocal_size
join -t $'\t' "$WORK/remote.manifest" "$WORK/local.manifest" \
  | awk -F'\t' '$2 != $3 && $2 != "" && $3 != "" { print $0 }' \
  > "$WORK/size_mismatches.tsv"
mismatch_count=$(wc -l < "$WORK/size_mismatches.tsv")
echo "total mismatches: $mismatch_count"
head -20 "$WORK/size_mismatches.tsv"
echo

# Persist artifacts for later inspection / for the deletion-phase decision
OUT_DIR="$SCRIPT_DIR/preflight-out"
mkdir -p "$OUT_DIR"
cp "$WORK/remote.manifest"     "$OUT_DIR/remote.manifest"
cp "$WORK/local.manifest"      "$OUT_DIR/local.manifest"
cp "$WORK/remote_only.paths"   "$OUT_DIR/remote_only.paths"
cp "$WORK/local_only.paths"    "$OUT_DIR/local_only.paths"
cp "$WORK/size_mismatches.tsv" "$OUT_DIR/size_mismatches.tsv"

echo "artifacts written to: $OUT_DIR/"
echo
echo "next step: inspect $OUT_DIR/remote_only.paths"
echo "  anything there that is NOT on your 'don't care' list should be recovered"
echo "  before you run the deletion phase on Dreamhost."
