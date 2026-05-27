#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

LOG_LEVEL="info"
SEED_ADMIN="false"

usage() {
  cat <<'EOF'
Usage: ./run-services.sh [options]

Starts backend and frontend dev services together with merged logs.

Options:
  -s, --seed-admin         Run backend admin seed script before startup
  -l, --log-level LEVEL    Log level (default: debug)
  -h, --help               Show this help

Examples:
  ./run-services.sh
  ./run-services.sh --seed-admin
  ./run-services.sh --log-level info
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -s|--seed-admin)
      SEED_ADMIN="true"
      shift
      ;;
    -l|--log-level)
      if [[ $# -lt 2 ]]; then
        echo "Error: --log-level requires a value"
        usage
        exit 1
      fi
      LOG_LEVEL="$2"
      shift 2
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

cleanup() {
  echo
  echo "Stopping services..."
  [[ -n "${BACKEND_PID:-}" ]] && kill "$BACKEND_PID" 2>/dev/null || true
  [[ -n "${FRONTEND_PID:-}" ]] && kill "$FRONTEND_PID" 2>/dev/null || true
  wait 2>/dev/null || true
}

trap cleanup INT TERM EXIT

echo "Using LOG_LEVEL=$LOG_LEVEL"

if [[ "$SEED_ADMIN" == "true" ]]; then
  echo "Seeding admin user..."
  (
    cd "$BACKEND_DIR"
    npm run seed:admin
  )
fi

FRONTEND_ARGS=()
if [[ "$LOG_LEVEL" == "debug" ]]; then
  FRONTEND_ARGS+=(--debug)
else
  FRONTEND_ARGS+=(--logLevel "$LOG_LEVEL")
fi

(
  cd "$BACKEND_DIR"
  LOG_LEVEL="$LOG_LEVEL" npm run dev 2>&1 | sed -u 's/^/[backend] /'
) &
BACKEND_PID=$!

(
  cd "$FRONTEND_DIR"
  LOG_LEVEL="$LOG_LEVEL" npm run dev -- "${FRONTEND_ARGS[@]}" 2>&1 | sed -u 's/^/[frontend] /'
) &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both."
echo

wait -n "$BACKEND_PID" "$FRONTEND_PID"
