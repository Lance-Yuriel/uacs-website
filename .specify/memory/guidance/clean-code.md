# Clean Code & Maintainability

## Readability First
- **Descriptive Naming:** Variable and function names must be explicit and pronounceable. Avoid single-letter variables except in very short loops (`i`, `j`). 
  > Bad: `const x = getD(usr.id);`
  > Good: `const eventDetails = getEventDetails(user.id);`
- **Boolean Variables:** Prefix booleans with `is`, `has`, `should`, or `can` (e.g., `isLoading`, `hasPermission`).
- **No Magic Numbers:** Replace unexplained numbers with named constants.
  > Bad: `if (password.length < 8)`
  > Good: `const MIN_PASSWORD_LENGTH = 8; if (password.length < MIN_PASSWORD_LENGTH)`

## Function Design
- **Single Responsibility Principle (SRP):** A function should do one thing and do it well. If a function contains the word "and" in its description or name, it should probably be split.
- **Early Returns (Bouncer Pattern):** Handle invalid states and edge cases at the top of the function and return early. This prevents deep nesting (`arrow anti-pattern`).
  ```typescript
  // Good
  if (!user) return null;
  if (!user.isAdmin) return <Unauthorized />;
  return <Dashboard />;
  ```
- **Parameter Limits:** Functions should ideally take no more than 3 parameters. If more are needed, pass a single configuration object.

## Comments & Documentation
- **Why, not What:** Code tells you *what* is happening. Comments should explain *why* it is happening (business logic, workarounds, context).
- **Self-Documenting Code:** If you feel the need to write a comment explaining a complex block of code, consider refactoring the code into a well-named function instead.
- **JSDoc:** Use JSDoc comments (`/** ... */`) for exported utility functions and shared components to provide IDE intellisense.

## Error Handling
- **Never Fail Silently:** Empty `catch` blocks are forbidden. Errors must be logged (appropriately) and handled.
- **User-Facing Errors:** Differentiate between system errors (logged to console/monitoring) and user-facing errors (shown in a toast/alert). Don't show raw technical errors to users.
