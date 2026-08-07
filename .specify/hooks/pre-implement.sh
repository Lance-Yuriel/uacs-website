#!/bin/bash
# PRE-IMPLEMENT HOOK
# Ensures the project is in a clean, buildable state before any implementation begins.

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
source "$SCRIPT_DIR/utils.sh"

cd "$PROJECT_ROOT"

echo "Pre-implementation checks"
echo "────────────────────────────────────────"

ERRORS=0

# 1. Regenerate architecture snapshot
echo "Regenerating architecture snapshot..."
bash .specify/scripts/codebase-snapshot.sh
pass "Architecture snapshot updated"

# 2. Clean install dependencies
echo ""
echo "Verifying dependencies..."
if npm ci --silent 2>/dev/null; then
  pass "npm ci succeeded"
else
  fail "npm ci failed — fix dependency issues first"
  ERRORS=$((ERRORS + 1))
fi

# 3. TypeScript compilation
echo ""
echo "Type-checking..."
if npx tsc --noEmit 2>/dev/null; then
  pass "TypeScript compiles cleanly"
else
  fail "TypeScript compilation errors — fix before implementing"
  ERRORS=$((ERRORS + 1))
fi

# 4. Linting
echo ""
echo "Linting..."
if npm run lint --silent 2>/dev/null; then
  pass "Linter passes"
else
  warn "Linter has warnings/errors — review before implementing"
fi

# 5. Check that .env.example exists
if [ -f ".env.example" ]; then
  pass ".env.example exists"
else
  warn "No .env.example — create one to document required environment variables"
fi

# 6. Check that employment/ is gitignored
if grep -q "employment/" .gitignore 2>/dev/null; then
  pass "employment/ is in .gitignore"
else
  warn "employment/ is NOT in .gitignore — add it immediately"
fi

echo "────────────────────────────────────────"

if [ "$ERRORS" -gt 0 ]; then
  gate_fail "pre-implement ($ERRORS issues)"
else
  gate_pass "pre-implement"
fi
