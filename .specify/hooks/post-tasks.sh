#!/bin/bash
# POST-TASKS HOOK
# Validates that the task breakdown is complete, ordered, and maps back to acceptance criteria.

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils.sh"

TASKS_FILE="${1:-}"
if [ -z "$TASKS_FILE" ] || [ ! -f "$TASKS_FILE" ]; then
  TASKS_FILE=$(find specs -name "tasks.md" -type f 2>/dev/null | head -1)
  if [ -z "$TASKS_FILE" ]; then
    fail "No tasks.md found in specs/ directory."
    gate_fail "post-tasks"
  fi
fi

# Find the corresponding spec for cross-referencing
SPEC_DIR=$(dirname "$TASKS_FILE")
SPEC_FILE="$SPEC_DIR/spec.md"

echo "Validating tasks: $TASKS_FILE"
echo "────────────────────────────────────────"

ERRORS=0

# 1. Must have at least one task checkbox
TASK_COUNT=$(grep -cE '^\s*- \[ \]' "$TASKS_FILE" 2>/dev/null || echo 0)
if [ "$TASK_COUNT" -gt 0 ]; then
  pass "Found $TASK_COUNT tasks"
else
  fail "No task checkboxes (- [ ]) found"
  ERRORS=$((ERRORS + 1))
fi

# 2. Each task should have a size estimate
SIZED_COUNT=$(grep -cE '\[(S|M|L|XL)\]' "$TASKS_FILE" 2>/dev/null || echo 0)
if [ "$SIZED_COUNT" -ge "$TASK_COUNT" ] && [ "$TASK_COUNT" -gt 0 ]; then
  pass "All tasks have size estimates"
else
  warn "$SIZED_COUNT of $TASK_COUNT tasks have size estimates — add [S], [M], [L], or [XL] to each"
fi

# 3. Must include a testing task
if grep -qi "test" "$TASKS_FILE" 2>/dev/null; then
  pass "Testing task(s) found"
else
  fail "No testing tasks found — every feature must include test tasks"
  ERRORS=$((ERRORS + 1))
fi

# 4. Cross-reference with spec acceptance criteria
if [ -f "$SPEC_FILE" ]; then
  CRITERIA_COUNT=$(grep -cE '^\s*- \[ \]' "$SPEC_FILE" 2>/dev/null || echo 0)
  if [ "$CRITERIA_COUNT" -gt 0 ]; then
    pass "Spec has $CRITERIA_COUNT acceptance criteria to cover"
  fi
  
  # Check that tasks reference acceptance criteria
  if grep -qi "acceptance" "$TASKS_FILE" 2>/dev/null || grep -qi "AC" "$TASKS_FILE" 2>/dev/null; then
    pass "Tasks reference acceptance criteria"
  else
    warn "Tasks should reference which acceptance criteria they satisfy"
  fi
else
  warn "No spec.md found at $SPEC_FILE — cannot cross-reference"
fi

# 5. Must have an implementation order section or numbered tasks
if grep -qE '(## Order|## Implementation Order|^[0-9]+\.)' "$TASKS_FILE" 2>/dev/null; then
  pass "Implementation order is defined"
else
  warn "No explicit implementation order — tasks should be sequenced by dependency"
fi

echo "────────────────────────────────────────"

if [ "$ERRORS" -gt 0 ]; then
  gate_fail "post-tasks ($ERRORS issues)"
else
  gate_pass "post-tasks"
fi
