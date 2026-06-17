#!/bin/bash
# setup.sh — installs deps, generates Prisma client, pushes schema
#
# REPLIT_BUILD=1  -> fast path: install directly to node_modules (production build container,
#                   no inode limits). Uses npm ci where a lockfile exists.
# (default)       -> /tmp workaround for Replit dev workspace (inode-limited).

set -e

WORKSPACE="/home/runner/workspace"
BACKEND_TMP="/tmp/arqiva-backend"
FRONTEND_TMP="/tmp/arqiva-frontend"

echo "=============================="
echo " ARQIVA — Setup"
echo "=============================="

if [ "$REPLIT_BUILD" = "1" ]; then
  # ── Production build: install directly ──────────────────────────────────
  echo ""
  echo "-> [backend] Installing directly..."
  cd "$WORKSPACE/backend"
  NODE_ENV=development npm install --no-audit --no-fund 2>&1 | grep -v "^npm warn" | tail -3

  echo ""
  echo "-> [frontend] Installing directly..."
  cd "$WORKSPACE/frontend"
  NODE_ENV=development npm install --no-audit --no-fund 2>&1 | grep -v "^npm warn" | tail -3
  cd "$WORKSPACE"

else
  # ── Dev workspace: install to /tmp (avoids inode limits) ────────────────
  echo ""
  echo "-> [backend] Installing to $BACKEND_TMP ..."
  mkdir -p "$BACKEND_TMP"
  cp "$WORKSPACE/backend/package.json" "$BACKEND_TMP/package.json"

  cd "$BACKEND_TMP"
  NODE_ENV=development npm install --no-audit --no-fund --ignore-scripts 2>&1 \
    | grep -v "^npm warn" | tail -5
  cd "$WORKSPACE"

  echo "-> [backend] Linking backend/node_modules -> $BACKEND_TMP/node_modules"
  rm -rf backend/node_modules
  ln -sfn "$BACKEND_TMP/node_modules" backend/node_modules

  ln -sf ../typescript/bin/tsc            "$BACKEND_TMP/node_modules/.bin/tsc"        2>/dev/null || true
  ln -sf ../typescript/bin/tsserver       "$BACKEND_TMP/node_modules/.bin/tsserver"   2>/dev/null || true
  ln -sf ../ts-node/dist/bin.js           "$BACKEND_TMP/node_modules/.bin/ts-node"    2>/dev/null || true

  echo ""
  echo "-> [frontend] Installing to $FRONTEND_TMP ..."
  mkdir -p "$FRONTEND_TMP"
  cp "$WORKSPACE/frontend/package.json" "$FRONTEND_TMP/package.json"

  cd "$FRONTEND_TMP"
  NODE_ENV=development npm install --no-audit --no-fund --ignore-scripts 2>&1 \
    | grep -v "^npm warn" | tail -5
  cd "$WORKSPACE"

  echo "-> [frontend] Linking frontend/node_modules -> $FRONTEND_TMP/node_modules"
  rm -rf frontend/node_modules
  ln -sfn "$FRONTEND_TMP/node_modules" frontend/node_modules

  ln -sf ../vite/bin/vite.js              "$FRONTEND_TMP/node_modules/.bin/vite"      2>/dev/null || true
  ln -sf ../tailwindcss/lib/cli.js        "$FRONTEND_TMP/node_modules/.bin/tailwindcss" 2>/dev/null || true
  ln -sf ../typescript/bin/tsc            "$FRONTEND_TMP/node_modules/.bin/tsc"       2>/dev/null || true
fi

# ── Prisma (both paths) ─────────────────────────────────────────────────────
echo ""
echo "-> [prisma] Generating client..."
cd "$WORKSPACE/backend"
./node_modules/.bin/prisma generate 2>&1 | tail -4

echo "-> [prisma] Pushing schema to database..."
./node_modules/.bin/prisma db push --skip-generate 2>&1 | tail -6
cd "$WORKSPACE"

echo ""
echo "=============================="
echo " Setup complete!"
echo " Next: npm run build && npm run start"
echo "=============================="
