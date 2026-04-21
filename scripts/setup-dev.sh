#!/usr/bin/env bash
# Run once after cloning to set up the dev environment.
# Usage: bash scripts/setup-dev.sh

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN="$HOME/.local/bin"
VENVS="$HOME/.local/venvs"

mkdir -p "$BIN" "$VENVS"

# ── Helpers ────────────────────────────────────────────────────────────────
ok()      { echo "  [ok] $*"; }
install() { echo "  [>>] Installing $1..."; }
skip()    { echo "  [--] $1 already installed, skipping"; }

check_bin() {
  local name="$1" ver_flag="${2:---version}"
  if command -v "$name" &>/dev/null; then
    skip "$name ($(${name} ${ver_flag} 2>&1 | head -1))"
    return 0
  fi
  return 1
}

# ── Tool versions ──────────────────────────────────────────────────────────
GITLEAKS_VERSION=8.30.1
TYPOS_VERSION=1.45.1
ACTIONLINT_VERSION=1.7.12
VALE_VERSION=3.14.1

echo ""
echo "==> RaspiBolt dev environment setup"
echo ""

# ── pre-commit + yamllint (Python venv) ────────────────────────────────────
echo "--> pre-commit & yamllint"
if command -v pre-commit &>/dev/null && command -v yamllint &>/dev/null; then
  skip "pre-commit ($(pre-commit --version)) + yamllint"
else
  install "pre-commit + yamllint"
  python3 -m venv "$VENVS/dev-tools"
  "$VENVS/dev-tools/bin/pip" install -q pre-commit yamllint
  ln -sf "$VENVS/dev-tools/bin/pre-commit" "$BIN/pre-commit"
  ln -sf "$VENVS/dev-tools/bin/yamllint"   "$BIN/yamllint"
  ok "pre-commit $(pre-commit --version) + yamllint"
fi

# ── markdownlint-cli2 (Node) ───────────────────────────────────────────────
echo "--> markdownlint-cli2"
if command -v markdownlint-cli2 &>/dev/null; then
  skip "markdownlint-cli2"
else
  install "markdownlint-cli2"
  npm install -g markdownlint-cli2 --silent
  ok "markdownlint-cli2 installed"
fi

# ── Node deps for the site (Next.js + Fumadocs) ───────────────────────────
echo "--> npm dependencies"
if [ -f "$REPO_ROOT/package-lock.json" ]; then
  (cd "$REPO_ROOT" && npm ci --silent)
  ok "npm dependencies installed"
else
  echo "  [skip] no package-lock.json at repo root"
fi

# ── gitleaks ───────────────────────────────────────────────────────────────
echo "--> gitleaks"
if ! check_bin gitleaks version; then
  install "gitleaks $GITLEAKS_VERSION"
  wget -q "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz" -O /tmp/gitleaks.tar.gz
  tar -xzf /tmp/gitleaks.tar.gz -C /tmp/ gitleaks
  mv /tmp/gitleaks "$BIN/gitleaks" && chmod +x "$BIN/gitleaks"
  ok "gitleaks $GITLEAKS_VERSION"
fi

# ── typos ──────────────────────────────────────────────────────────────────
echo "--> typos"
if ! check_bin typos; then
  install "typos $TYPOS_VERSION"
  wget -q "https://github.com/crate-ci/typos/releases/download/v${TYPOS_VERSION}/typos-v${TYPOS_VERSION}-x86_64-unknown-linux-musl.tar.gz" -O /tmp/typos.tar.gz
  tar -xzf /tmp/typos.tar.gz -C /tmp/ ./typos
  mv /tmp/typos "$BIN/typos" && chmod +x "$BIN/typos"
  ok "typos $TYPOS_VERSION"
fi

# ── actionlint ─────────────────────────────────────────────────────────────
echo "--> actionlint"
if ! check_bin actionlint; then
  install "actionlint $ACTIONLINT_VERSION"
  wget -q "https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}/actionlint_${ACTIONLINT_VERSION}_linux_amd64.tar.gz" -O /tmp/actionlint.tar.gz
  tar -xzf /tmp/actionlint.tar.gz -C /tmp/ actionlint
  mv /tmp/actionlint "$BIN/actionlint" && chmod +x "$BIN/actionlint"
  ok "actionlint $ACTIONLINT_VERSION"
fi

# ── vale ───────────────────────────────────────────────────────────────────
echo "--> vale"
if ! check_bin vale; then
  install "vale $VALE_VERSION"
  wget -q "https://github.com/errata-ai/vale/releases/download/v${VALE_VERSION}/vale_${VALE_VERSION}_Linux_64-bit.tar.gz" -O /tmp/vale.tar.gz
  tar -xzf /tmp/vale.tar.gz -C /tmp/ vale
  mv /tmp/vale "$BIN/vale" && chmod +x "$BIN/vale"
  ok "vale $VALE_VERSION"
fi

# ── git hooks ─────────────────────────────────────────────────────────────
echo ""
echo "--> Installing git hooks via pre-commit..."
cd "$REPO_ROOT"
export PATH="$BIN:$PATH"
pre-commit install
ok "pre-commit hook installed (.git/hooks/pre-commit)"

echo ""
echo "==> All done. Run 'pre-commit run --all-files' to check the full repo."
echo ""
