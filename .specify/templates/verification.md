# Verification: [Feature Name]

## Build Checks
- [ ] `npx tsc --noEmit` — zero errors
- [ ] `npm run lint` — passes
- [ ] `npm run build` — production build succeeds

## Code Quality
- [ ] No `console.log` in source files
- [ ] No `any` types in source files
- [ ] No hardcoded secrets or API keys
- [ ] All new functions have explicit TypeScript types

## Testing
- [ ] Unit tests written for new utility/service functions
- [ ] Component tests written for new interactive UI
- [ ] All tests pass: `npm test`
- [ ] Each acceptance criterion has at least one corresponding test

## Security
- [ ] API routes validate auth where required
- [ ] Input validation with Zod for external data
- [ ] `.env.example` updated if new env vars added
- [ ] `firestore.rules` updated if schema changed

## Manual Verification
- [ ] Feature works in Chrome
- [ ] Feature works in Safari
- [ ] Responsive: mobile (375px)
- [ ] Responsive: tablet (768px)
- [ ] Responsive: desktop (1280px)
- [ ] No console errors in browser DevTools
- [ ] Keyboard accessible (tab navigation works)

## Acceptance Criteria (from spec)
- [ ] [Criterion 1 — how was it verified?]
- [ ] [Criterion 2 — how was it verified?]

## Gate Result
- [ ] `bash .specify/hooks/post-implement.sh` — PASSED
