#!/bin/bash
# Builds a static export of the app for Capacitor (iOS/Android).
# The Next.js API routes (/api/analytics/*) need a server and can't be
# statically exported, so they're excluded from this build only — the
# native app's analytics calls will simply no-op (caught in try/catch).
# The live website build (`npm run build`) is unaffected.
set -e

API_DIR="src/app/api"
API_BAK="src/app/_api-excluded-for-mobile-build"

cleanup() {
  if [ -d "$API_BAK" ]; then
    mv "$API_BAK" "$API_DIR"
  fi
}
trap cleanup EXIT

if [ -d "$API_DIR" ]; then
  mv "$API_DIR" "$API_BAK"
fi

CAP_BUILD=1 npx next build

npx cap sync
