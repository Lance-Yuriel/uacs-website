#!/bin/bash
# POST-PLAN HOOK
# Validates the technical plan against the actual codebase.
# Regenerates architecture.md, then cross-references file paths mentioned in the plan.

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
source "$SCRIPT_DIR/utils.sh"

PLAN_FILE="${1:-}"
if [ -z "$PLAN_FILE" ] || [ ! -f "$PLAN_FILE" ]; then
  PLAN_FILE=$(find specs -name "plan.md" -type f 2>/dev/null | head -1)
  if [ -z "$PLAN_FILE" ]; then
    fail "No plan.md found in specs/ directory."
    gate_fail "post-plan"
  fi
fi

cd "$PROJECT_ROOT"

echo "Validating plan: $PLAN_FILE"
echo "────────────────────────────────────────"

ERRORS=0

# 1. Regenerate architecture snapshot
echo "Regenerating architecture snapshot..."
bash .specify/scripts/codebase-snapshot.sh
pass "Architecture snapshot regenerated"

# 2. Check required sections
for section in "Proposed Changes" "Files to Modify" "New Dependencies" "Testing Strategy"; do
  if ! check_section "$PLAN_FILE" "$section"; then
    ERRORS=$((ERRORS + 1))
  fi
done

# 3. Cross-reference file paths mentioned in the plan against actual files
echo ""
echo "Cross-referencing file paths..."
grep -oE 'src/[a-zA-Z0-9_./-]+\.(ts|tsx)' "$PLAN_FILE" 2>/dev/null | sort -u | while read -r filepath; do
  if [ -f "$filepath" ]; then
    pass "Exists: $filepath"
  else
    # Check if it's explicitly marked as [NEW]
    if grep -q "\[NEW\].*$filepath" "$PLAN_FILE" 2>/dev/null; then
      pass "New file (marked [NEW]): $filepath"
    else
      fail "Referenced but does not exist: $filepath"
      ERRORS=$((ERRORS + 1))
    fi
  fi
done

# 4. Check for new npm packages mentioned
echo ""
echo "Checking new dependencies..."
if grep -qi "new dependencies" "$PLAN_FILE" 2>/dev/null; then
  # Extract package names after "new dependencies" section
  grep -oE '"[a-z@][a-z0-9@/_-]+"' "$PLAN_FILE" 2>/dev/null | tr -d '"' | while read -r pkg; do
    if grep -q "\"$pkg\"" package.json 2>/dev/null; then
      pass "Already installed: $pkg"
    else
      warn "New package (not yet installed): $pkg — verify it exists on npmjs.com"
    fi
  done
fi

echo "────────────────────────────────────────"

if [ "$ERRORS" -gt 0 ]; then
  gate_fail "post-plan ($ERRORS issues)"
else
  gate_pass "post-plan"
fi
