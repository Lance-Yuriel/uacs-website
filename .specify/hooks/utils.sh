#!/bin/bash
# Shared utilities for Spec Kit hooks.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}✓${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }

gate_fail() {
  echo ""
  echo -e "${RED}════════════════════════════════════════${NC}"
  echo -e "${RED}  GATE FAILED: $1${NC}"
  echo -e "${RED}  Fix the issues above before proceeding.${NC}"
  echo -e "${RED}════════════════════════════════════════${NC}"
  exit 1
}

gate_pass() {
  echo ""
  echo -e "${GREEN}════════════════════════════════════════${NC}"
  echo -e "${GREEN}  GATE PASSED: $1${NC}"
  echo -e "${GREEN}════════════════════════════════════════${NC}"
}

check_section() {
  local file="$1"
  local section="$2"
  if grep -qi "## $section" "$file" 2>/dev/null; then
    pass "Section found: $section"
    return 0
  else
    fail "Missing section: $section"
    return 1
  fi
}

check_file_exists() {
  if [ -f "$1" ]; then
    pass "File exists: $1"
    return 0
  else
    fail "File missing: $1"
    return 1
  fi
}
