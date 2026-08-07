#!/bin/bash
# POST-SPECIFY HOOK
# Validates that a feature spec includes all required sections before the plan phase can begin.

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils.sh"

SPEC_FILE="${1:-}"
if [ -z "$SPEC_FILE" ] || [ ! -f "$SPEC_FILE" ]; then
  echo "Usage: post-specify.sh <path-to-spec.md>"
  echo "Looking for most recent spec..."
  SPEC_FILE=$(find specs -name "spec.md" -type f 2>/dev/null | head -1)
  if [ -z "$SPEC_FILE" ]; then
    fail "No spec.md found in specs/ directory."
    gate_fail "post-specify"
  fi
fi

echo "Validating spec: $SPEC_FILE"
echo "────────────────────────────────────────"

ERRORS=0

# Required sections
for section in "Problem Statement" "User Stories" "Acceptance Criteria" "Out of Scope" "Dependencies" "Security Considerations"; do
  if ! check_section "$SPEC_FILE" "$section"; then
    ERRORS=$((ERRORS + 1))
  fi
done

# Must have at least one acceptance criterion checkbox
if grep -qE '^\s*- \[ \]' "$SPEC_FILE" 2>/dev/null; then
  pass "Acceptance criteria checkboxes found"
else
  fail "No acceptance criteria checkboxes (- [ ]) found"
  ERRORS=$((ERRORS + 1))
fi

# Must have at least one user story
if grep -qi "As a" "$SPEC_FILE" 2>/dev/null; then
  pass "User story format detected"
else
  fail "No 'As a [role]' user stories found"
  ERRORS=$((ERRORS + 1))
fi

# Feature name must be present
if head -1 "$SPEC_FILE" | grep -qE '^# Feature:'; then
  pass "Feature name present in title"
else
  fail "First line must be '# Feature: [Name]'"
  ERRORS=$((ERRORS + 1))
fi

echo "────────────────────────────────────────"

if [ "$ERRORS" -gt 0 ]; then
  gate_fail "post-specify ($ERRORS issues)"
else
  gate_pass "post-specify"
fi
