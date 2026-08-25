#!/bin/bash
# Builds a static export of the app for Capacitor (iOS/Android).
#
# Two things must NOT ship inside the native binary, so they're temporarily
# moved aside for this build only (restored after, live website build unaffected):
#
# - src/app/api    — needs a server, can't be statically exported anyway.
# - src/app/admin  — internal analytics dashboard with no UI entry point in
#   the app. Apple rejected the first submission under Guideline 5.6
#   ("features that appear to have been intentionally hidden during review")
#   because this page shipped inside the bundle, unlinked from any nav, with
#   only a client-side password field gating it — exactly what that
#   guideline is designed to catch. Never let an unlinked admin/debug route
#   ship inside a consumer app binary again.
set -e

EXCLUDE_DIRS=("src/app/api" "src/app/admin")
RESTORE_LIST=()

cleanup() {
  for pair in "${RESTORE_LIST[@]}"; do
    bak="${pair%%|*}"
    orig="${pair##*|}"
    if [ -d "$bak" ]; then
      mv "$bak" "$orig"
    fi
  done
}
trap cleanup EXIT

for dir in "${EXCLUDE_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    # Leading underscore is required — Next.js App Router only excludes
    # path segments starting with "_" from routing (a trailing suffix,
    # like "api-excluded", is NOT excluded and still gets built as a route).
    parent="$(dirname "$dir")"
    base="$(basename "$dir")"
    bak="${parent}/_${base}-excluded-for-mobile-build"
    mv "$dir" "$bak"
    RESTORE_LIST+=("$bak|$dir")
  fi
done

CAP_BUILD=1 npx next build

npx cap sync
