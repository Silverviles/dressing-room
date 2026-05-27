#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

usage() {
  cat <<'EOF'
Usage: ./setup-services.sh [options]

Installs dependencies for backend and frontend services.

Options:
  --backend-only     Install only backend dependencies
  --frontend-only    Install only frontend dependencies
  -h, --help         Show this help

Examples:
  ./setup-services.sh
  ./setup-services.sh --backend-only
  ./setup-services.sh --frontend-only
EOF
}

INSTALL_BACKEND="true"
INSTALL_FRONTEND="true"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --backend-only)
      INSTALL_BACKEND="true"
      INSTALL_FRONTEND="false"
      shift
      ;;
    --frontend-only)
      INSTALL_BACKEND="false"
      INSTALL_FRONTEND="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

if [[ ! -d "$BACKEND_DIR" || ! -d "$FRONTEND_DIR" ]]; then
  echo "Error: backend/ or frontend/ directory not found."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed or not in PATH."
  exit 1
fi

echo "Installing service dependencies..."
echo

if [[ "$INSTALL_BACKEND" == "true" ]]; then
  echo "[backend] npm install"
  (
    cd "$BACKEND_DIR"
    npm install
  )
  echo "[backend] done"
  echo
fi

if [[ "$INSTALL_FRONTEND" == "true" ]]; then
  echo "[frontend] npm install"
  (
    cd "$FRONTEND_DIR"
    npm install
  )
  echo "[frontend] done"
  echo
fi

echo "All requested dependencies installed successfully."
