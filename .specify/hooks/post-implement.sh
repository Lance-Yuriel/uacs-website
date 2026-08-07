#!/bin/bash
# POST-IMPLEMENT HOOK
# The final quality gate. Runs all deterministic checks after implementation.
# Must pass before the feature can be considered "done".

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
source "$SCRIPT_DIR/utils.sh"

cd "$PROJECT_ROOT"

echo "Post-implementation verification"
echo "════════════════════════════════════════"

ERRORS=0
WARNINGS=0

# ──────────────────────────────────────
# BUILD CHECKS
# ──────────────────────────────────────
echo ""
echo "── Build Checks ──"

# 1. TypeScript
echo "Type-checking..."
if npx tsc --noEmit 2>/dev/null; then
  pass "TypeScript compiles with zero errors"
else
  fail "TypeScript compilation failed"
  ERRORS=$((ERRORS + 1))
fi

# 2. Lint
echo "Linting..."
if npm run lint --silent 2>/dev/null; then
  pass "ESLint passes"
else
  fail "ESLint has errors"
  ERRORS=$((ERRORS + 1))
fi

# 3. Build
echo "Building production bundle..."
if npm run build --silent 2>/dev/null; then
  pass "Production build succeeded"
else
  fail "Production build failed"
  ERRORS=$((ERRORS + 1))
fi

# ──────────────────────────────────────
# CODE QUALITY CHECKS (Changed Files Only)
# ──────────────────────────────────────
echo ""
echo "── Code Quality Checks (Changed Files Only) ──"

# Get changed files in this branch compared to main, or currently modified/untracked files
TARGET_FILES=""
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

if [ "$CURRENT_BRANCH" != "main" ] && [ -n "$CURRENT_BRANCH" ]; then
  # On a feature branch: check all files changed compared to main
  TARGET_FILES=$(git diff --name-only main... 2>/dev/null | grep -E '\.(ts|tsx)$' || true)
fi

# Fallback: check currently modified (staged + unstaged) and untracked files
if [ -z "$TARGET_FILES" ]; then
  MODIFIED=$( (git diff --name-only; git diff --cached --name-only) 2>/dev/null || true)
  UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null || true)
  TARGET_FILES=$(echo -e "$MODIFIED\n$UNTRACKED" | sort -u | grep -E '\.(ts|tsx)$' || true)
fi

if [ -n "$TARGET_FILES" ]; then
  # 4. No console.log in changed files
  CONSOLE_LOGS=$(echo "$TARGET_FILES" | xargs grep -rn "console\.log" 2>/dev/null | grep -v ".test." || true)
  if [ -z "$CONSOLE_LOGS" ]; then
    pass "No console.log statements in changed files"
  else
    CONSOLE_COUNT=$(echo "$CONSOLE_LOGS" | wc -l | tr -d ' ')
    fail "Found $CONSOLE_COUNT console.log statement(s) in changed files:"
    echo "$CONSOLE_LOGS" | head -10
    ERRORS=$((ERRORS + 1))
  fi

  # 5. No 'any' type in changed files
  ANY_TYPES=$(echo "$TARGET_FILES" | xargs grep -rn ": any" 2>/dev/null | grep -v ".test." | grep -v "// eslint-disable" || true)
  if [ -z "$ANY_TYPES" ]; then
    pass "No 'any' types in changed files"
  else
    ANY_COUNT=$(echo "$ANY_TYPES" | wc -l | tr -d ' ')
    fail "Found $ANY_COUNT 'any' type usage(s) in changed files:"
    echo "$ANY_TYPES" | head -10
    ERRORS=$((ERRORS + 1))
  fi

  # 6. No hardcoded secrets in changed files
  SECRET_PATTERNS="(AIzaSy[A-Za-z0-9_-]{33}|sk_live_[a-zA-Z0-9]+|sk_test_[a-zA-Z0-9]+|-----BEGIN|password\s*=\s*['\"][^'\"]+['\"])"
  SECRETS=$(echo "$TARGET_FILES" | xargs grep -rnE "$SECRET_PATTERNS" 2>/dev/null | grep -v "process\.env" | grep -v ".test." || true)
  if [ -z "$SECRETS" ]; then
    pass "No hardcoded secrets detected in changed files"
  else
    fail "Possible hardcoded secrets found in changed files:"
    echo "$SECRETS" | head -5
    ERRORS=$((ERRORS + 1))
  fi
else
  pass "No typescript/react files changed — skipping code quality checks"
fi

# 7. No unused imports (basic check)
UNUSED_IMPORTS=$(npx tsc --noEmit 2>&1 | grep "is declared but" || true)
if [ -z "$UNUSED_IMPORTS" ]; then
  pass "No unused declarations detected"
else
  UNUSED_COUNT=$(echo "$UNUSED_IMPORTS" | wc -l | tr -d ' ')
  warn "$UNUSED_COUNT unused declaration(s) detected"
  WARNINGS=$((WARNINGS + 1))
fi

# ──────────────────────────────────────
# TESTING CHECKS
# ──────────────────────────────────────
echo ""
echo "── Testing Checks ──"

# 8. Check if test files exist for changed files
CHANGED_FILES=$(git diff --name-only HEAD~1 2>/dev/null | grep -E '\.(ts|tsx)$' | grep -v '.test.' | grep -v '.spec.' || true)
if [ -n "$CHANGED_FILES" ]; then
  MISSING_TESTS=0
  echo "$CHANGED_FILES" | while read -r changed; do
    test_file="${changed%.tsx}.test.tsx"
    test_file2="${changed%.ts}.test.ts"
    if [ -f "$test_file" ] || [ -f "$test_file2" ]; then
      pass "Test exists for: $changed"
    else
      # Only warn for non-trivial files (skip layouts, pages with no logic, configs)
      basename=$(basename "$changed")
      if [[ "$basename" != "layout.tsx" && "$basename" != "page.tsx" && "$basename" != "loading.tsx" && "$basename" != "not-found.tsx" ]]; then
        warn "No test file for: $changed"
        MISSING_TESTS=$((MISSING_TESTS + 1))
      fi
    fi
  done
fi

# 9. Run tests if they exist
if [ -f "vitest.config.ts" ] || [ -f "jest.config.ts" ] || [ -f "jest.config.js" ]; then
  echo "Running test suite..."
  if npm test --silent 2>/dev/null; then
    pass "All tests pass"
  else
    fail "Tests failed"
    ERRORS=$((ERRORS + 1))
  fi
else
  warn "No test runner configured (vitest/jest) — test execution skipped"
  WARNINGS=$((WARNINGS + 1))
fi

# ──────────────────────────────────────
# SECURITY CHECKS
# ──────────────────────────────────────
echo ""
echo "── Security Checks ──"

# 10. Check .env.example is up to date
if [ -f ".env.example" ]; then
  pass ".env.example exists"
else
  warn "No .env.example — required environment variables are undocumented"
  WARNINGS=$((WARNINGS + 1))
fi

# 11. Check employment/ is gitignored
if grep -q "employment/" .gitignore 2>/dev/null; then
  pass "employment/ is gitignored"
else
  fail "employment/ is NOT in .gitignore — sensitive files may be exposed"
  ERRORS=$((ERRORS + 1))
fi

# 12. Check firestore.rules exists
if [ -f "firestore.rules" ]; then
  pass "firestore.rules exists"
else
  warn "No firestore.rules file — database may be in insecure test mode"
  WARNINGS=$((WARNINGS + 1))
fi

# ──────────────────────────────────────
# SUMMARY
# ──────────────────────────────────────
echo ""
echo "════════════════════════════════════════"
echo "Results: $ERRORS error(s), $WARNINGS warning(s)"
echo "════════════════════════════════════════"

if [ "$ERRORS" -gt 0 ]; then
  gate_fail "post-implement ($ERRORS errors, $WARNINGS warnings)"
else
  if [ "$WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}Gate passed with $WARNINGS warning(s). Review before merging.${NC}"
  fi
  gate_pass "post-implement"
fi
