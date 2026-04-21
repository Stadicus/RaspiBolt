#!/usr/bin/env bash
# RaspiBolt v4 test runner
# Usage: ./test-runner.sh [section] [--vm debian12|rpios]
#   ./test-runner.sh all
#   ./test-runner.sh raspberry-pi
#   ./test-runner.sh bitcoin
#   ./test-runner.sh lightning

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC2034
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# ── Config ────────────────────────────────────────────────
VM="${VM:-debian12}"
SECTION="${1:-all}"

# Versions live in lib/versions.json — single source of truth for the guide.
_vars="$REPO_ROOT/lib/versions.json"
BITCOIN_VERSION=$(jq -r '.bitcoin_core' "$_vars")
LND_VERSION=$(jq     -r '.lnd'          "$_vars")
ELECTRS_VERSION=$(jq -r '.electrs'      "$_vars")
RTL_VERSION=$(jq     -r '.rtl'          "$_vars")
unset _vars

# ── Helpers ───────────────────────────────────────────────
log()  { echo "[TEST] $*"; }
pass() { echo "[PASS] $*"; }
fail() { echo "[FAIL] $*" >&2; FAILURES=$((FAILURES + 1)); }

FAILURES=0

vm_run() {
  vagrant ssh "$VM" -c "$1"
}

# ── Test suites ───────────────────────────────────────────

test_raspberry_pi() {
  log "Testing Raspberry Pi section..."
  # TODO: Week 1 — add OS, SSH, ufw, fail2ban, tor checks
  pass "raspberry-pi placeholder"
}

test_bitcoin() {
  log "Testing Bitcoin section..."
  # TODO: Week 2 — bitcoin-cli getblockchaininfo, verify version
  # vm_run "bitcoin-cli -version | grep -q '$BITCOIN_VERSION'"
  pass "bitcoin placeholder"
}

test_electrs() {
  log "Testing Electrs..."
  # TODO: check electrs service running + version
  pass "electrs placeholder"
}

test_lightning() {
  log "Testing Lightning section..."
  # TODO: lncli getinfo, verify version
  pass "lightning placeholder"
}

test_rtl() {
  log "Testing RTL web app..."
  # TODO: check RTL service + HTTP response
  pass "rtl placeholder"
}

# ── Main ──────────────────────────────────────────────────

log "RaspiBolt v4 Test Runner"
log "VM: $VM | Section: $SECTION"
log "Versions: Bitcoin Core $BITCOIN_VERSION | LND $LND_VERSION | Electrs $ELECTRS_VERSION | RTL $RTL_VERSION"
echo

cd "$SCRIPT_DIR"

case "$SECTION" in
  all)
    test_raspberry_pi
    test_bitcoin
    test_electrs
    test_lightning
    test_rtl
    ;;
  raspberry-pi) test_raspberry_pi ;;
  bitcoin)      test_bitcoin; test_electrs ;;
  lightning)    test_lightning; test_rtl ;;
  *)
    echo "Unknown section: $SECTION"
    echo "Usage: $0 [all|raspberry-pi|bitcoin|lightning]"
    exit 1
    ;;
esac

echo
if [ "$FAILURES" -eq 0 ]; then
  log "All tests passed."
else
  log "$FAILURES test(s) FAILED."
  exit 1
fi
