#!/bin/bash
# setup.sh — installs dependencies with node_modules symlinked to /tmp
# Workaround for Replit workspace subdirectory write constraints

set -e

NPM_CACHE="/tmp/.npm-cache"

setup_pkg() {
  local dir="$1"
  local name
  name=$(basename "$dir")
  local tmpnm="/tmp/nm_${name}"

  echo "→ Setting up ${dir}..."

  # Create target in /tmp
  mkdir -p "$tmpnm"

  # Symlink node_modules → /tmp if not already
  if [ ! -L "${dir}/node_modules" ]; then
    rm -rf "${dir}/node_modules"
    ln -sfn "$tmpnm" "${dir}/node_modules"
    echo "  Linked ${dir}/node_modules → ${tmpnm}"
  fi

  # Install into /tmp via the symlink
  cd "$dir"
  npm install --cache "$NPM_CACHE" --prefer-offline 2>&1
  cd - > /dev/null
  echo "  ✓ ${dir} done"
}

echo "=============================="
echo " ARQIVA — Dependency Setup"
echo "=============================="

setup_pkg "frontend"
setup_pkg "backend"

echo ""
echo "✓ All dependencies installed in /tmp"
