# TypeScript Guidelines

## Strict Typing
- **No `any`:** The `any` type disables the type checker. Its use is strictly prohibited. 
  > Why: Using `any` defeats the purpose of using TypeScript and masks runtime errors.
- **`unknown` over `any`:** If data from an external source (like a fetch request or API body) is truly unknown, type it as `unknown` and use type guards or Zod validation to narrow the type before using it.
- **Explicit Returns:** All functions, especially API route handlers and React components, should have explicit return types.

## Interfaces vs. Types
- **`interface`:** Use for defining the shape of objects (e.g., Firestore documents, Component Props, API responses). Interfaces are easily extendable.
- **`type`:** Use for unions (e.g., `type Status = 'active' | 'inactive'`), intersections, or complex mapped types.

## Type Organization
- **Global Types:** Place shared types (e.g., database models, API responses) in `src/types/`. 
- **Colocation:** Place Component Props interfaces directly inside the component file, above the component definition.

## Data Validation (Zod)
- **Boundary Validation:** TypeScript types only exist at compile time. At runtime, data fetched from external APIs or submitted by users must be validated using Zod.
- **Inferring Types:** Define a Zod schema first, then infer the TypeScript type from it:
  ```typescript
  const UserSchema = z.object({ name: z.string() });
  type User = z.infer<typeof UserSchema>;
  ```

## Nullability
- Use strict null checks. If a value can be null, the type must explicitly reflect it (e.g., `string | null`).
- Avoid using the non-null assertion operator (`!`). Fix the logic to handle the null case gracefully instead of forcing the compiler to ignore it.
