# Technical Plan: Library JSDoc Documentation

## Summary
Add clear, comprehensive JSDoc comments to all exported functions, constants, and utilities inside the `src/lib/` directory. This includes documenting descriptions, parameters, return types, throws, and side effects.

## Proposed Changes

### Files to Modify
- `src/lib/events.ts` — Document local timezone conversion helpers, event status determination, and countdown metadata builders.
- `src/lib/firebase.ts` — Document client-side Firebase Auth and Storage initializes, client config checks, and mock fallbacks.
- `src/lib/firebase-admin.ts` — Document server-side Firebase Admin SDK references (Firestore, Auth, Storage) and initialization logic.
- `src/lib/googleSheets.ts` — Document sheets counting functions, current year filtering, relative time parser, and environment key requirements.
- `src/lib/utils.ts` — Document utility helpers like CSS class merging (`cn`), date/time formatters, viewport scrolling, debouncing, and throttling.

### Files to Create
- None

### Files to Delete
- None

## New Dependencies
- None

## Architecture Decisions
- Use standard JSDoc annotations (e.g. `@param`, `@returns`, `@throws`, `@example`, `@private`) for inline IDE autocomplete and documentation tooling.
- Do not make any functional logic changes or refactors to keep the commit focused entirely on documentation.

## Data Model Changes
- No data model changes

## API Changes
- No API changes

## Testing Strategy
- Unit tests: Verify using `npm run test` to confirm our documentation changes do not cause syntax issues or affect test assertions.
- Component tests: None
- Manual verification: Run `npm run lint` and `npm run build` to ensure the linter is clean and the app compiles successfully.

## Security Review
- Add comments explaining that `firebase-admin.ts` operates on the server-side, bypassing Firestore security rules.
- Remind developers in JSDoc that Google Sheets private keys should remain server-only secrets.

## Rollback Plan
- Discard git changes or revert the branch commit if needed.
