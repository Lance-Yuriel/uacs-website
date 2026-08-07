#!/bin/bash
# Generates architecture.md from the live codebase.
# Provides grounding context so the AI agent does not hallucinate file paths, exports, or dependencies.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUTPUT="$PROJECT_ROOT/.specify/memory/architecture.md"

cd "$PROJECT_ROOT"

cat > "$OUTPUT" <<'HEADER'
# Architecture Snapshot
> Auto-generated. Do not edit manually. Regenerate with `.specify/scripts/codebase-snapshot.sh`.

HEADER

echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# --- File Tree ---
echo "## Source File Tree" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | sort >> "$OUTPUT"
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

# --- Dependencies ---
echo "## Dependencies (package.json)" >> "$OUTPUT"
echo '```json' >> "$OUTPUT"
python3 -c "
import json, sys
with open('package.json') as f:
    pkg = json.load(f)
print(json.dumps(pkg.get('dependencies', {}), indent=2))
" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "## Dev Dependencies" >> "$OUTPUT"
echo '```json' >> "$OUTPUT"
python3 -c "
import json, sys
with open('package.json') as f:
    pkg = json.load(f)
print(json.dumps(pkg.get('devDependencies', {}), indent=2))
" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

# --- API Routes ---
echo "## API Routes" >> "$OUTPUT"
if [ -d "src/app/api" ]; then
  find src/app/api -name "route.ts" 2>/dev/null | sort | while read -r f; do
    route=$(echo "$f" | sed 's|src/app||' | sed 's|/route.ts||')
    methods=$(grep -oE 'export (async )?function (GET|POST|PUT|DELETE|PATCH)' "$f" 2>/dev/null | grep -oE 'GET|POST|PUT|DELETE|PATCH' | tr '\n' ', ' | sed 's/,$//')
    echo "- \`$route\` → [$methods]" >> "$OUTPUT"
  done
else
  echo "(no API routes found)" >> "$OUTPUT"
fi
echo "" >> "$OUTPUT"

# --- Exported Components ---
echo "## Exported Components" >> "$OUTPUT"
if [ -d "src/components" ]; then
  grep -rn "^export " src/components/ --include="*.tsx" 2>/dev/null | head -60 | sed 's|^src/||' >> "$OUTPUT"
else
  echo "(no components directory)" >> "$OUTPUT"
fi
echo "" >> "$OUTPUT"

# --- Type Definitions ---
echo "## Type Definitions" >> "$OUTPUT"
if [ -d "src/types" ]; then
  grep -rn "^export \(interface\|type\)" src/types/ --include="*.ts" 2>/dev/null >> "$OUTPUT"
else
  echo "(no types directory)" >> "$OUTPUT"
fi
echo "" >> "$OUTPUT"

# --- Lib Exports ---
echo "## Lib Exports" >> "$OUTPUT"
if [ -d "src/lib" ]; then
  grep -rn "^export " src/lib/ --include="*.ts" 2>/dev/null | head -40 | sed 's|^src/||' >> "$OUTPUT"
else
  echo "(no lib directory)" >> "$OUTPUT"
fi
echo "" >> "$OUTPUT"

# --- Environment Variables ---
echo "## Environment Variables (.env.example)" >> "$OUTPUT"
if [ -f ".env.example" ]; then
  echo '```' >> "$OUTPUT"
  cat .env.example >> "$OUTPUT"
  echo '```' >> "$OUTPUT"
else
  echo "> ⚠️ No .env.example found. Create one." >> "$OUTPUT"
fi
echo "" >> "$OUTPUT"

echo "---" >> "$OUTPUT"
echo "Snapshot complete." >> "$OUTPUT"
