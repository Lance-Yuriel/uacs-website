# Testing Guidelines

## Testing Philosophy
- **Confidence over Coverage:** Do not write tests just to hit an arbitrary 100% coverage metric. Write tests that give you confidence that the application works for the user and won't break during refactoring.
- **Test Behavior, Not Implementation:** Component tests should verify what the user sees and interacts with (e.g., "clicking 'Submit' shows an error"), not the internal state (e.g., "state.isError is true").

## Unit Testing (Vitest)
- **What to test:** 
  - Pure functions in `src/lib/utils.ts` (e.g., date formatters, data transformers).
  - Service functions in `src/lib/` (e.g., Firestore wrappers, Zod validation logic).
- **Mocking:** When testing service functions, mock external dependencies (like the Firestore SDK or Fetch API) so tests run instantly and don't hit real databases.
- **Naming:** Name the test file identical to the source file (e.g., `utils.test.ts`).

## Component Testing (React Testing Library)
- **What to test:** Complex, interactive components (e.g., `EventForm.tsx`, `AuthContext.tsx`).
- **Queries:** Use `getByRole`, `getByLabelText`, and `getByText`. Avoid `getByTestId` unless no other semantic query works. This ensures you are testing accessible UI.
- **Accessibility:** If you can't select an element using `getByRole`, your component is likely inaccessible. Fix the component, not the test.

## Spec Kit Testing Gates
- Every new feature spec (`spec.md`) must include testing criteria.
- The `post-implement.sh` gate will verify that test files exist for newly added logic files and will execute the test suite. If tests fail, the phase cannot be completed.
