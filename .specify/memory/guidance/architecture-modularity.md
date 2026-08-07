# Architecture & Modularity

## Directory Structure Strategy
- **`src/app/`**: Next.js routing, layouts, and page-level Server Components. Keep logic minimal here; delegate to feature components.
- **`src/components/`**: Reusable UI components.
  - **`src/components/ui/`**: Generic, dumb components (Buttons, Cards, Inputs). These should have no business logic and no side effects.
  - **`src/components/[feature]/`**: Smart components tied to a specific domain (e.g., `events/EventCard.tsx`, `admin/EventForm.tsx`).
- **`src/lib/`**: Core utilities, database initialization, third-party API wrappers, and shared service functions.
- **`src/types/`**: Global TypeScript definitions.

## Decoupling Logic from UI
- **Separation of Concerns:** React components should focus on rendering UI and handling user interactions. Business logic (data fetching, transformation, database writes) should live in `src/lib/` or custom hooks.
  > Bad: A React component that fetches data, maps it to a new shape, calculates totals, and writes to Firestore.
  > Good: A React component that calls `useFetchEvents()`, displays the loading state, and renders `<EventCard>` mapping over the data.
- **Service Pattern:** Use the service pattern for backend operations. Instead of calling Firebase directly in an API route, create a service function `createEvent(data)` in `src/lib/events.ts` and call that from the API route. This makes the logic testable and reusable.

## Dependency Injection & Reusability
- **Props vs. Global State:** Pass data down via props whenever feasible. Only lift state to context when prop drilling becomes deeper than 3 levels or the data is globally needed.
- **Component Composition:** Prefer composing smaller components using `children` over creating massive, monolithic components with dozens of configuration props.
  ```typescript
  // Bad: monolithic component
  <Header showLogo={true} showNav={true} customTitle="Events" hideSearch={false} />
  
  // Good: composition
  <Header>
    <Logo />
    <Nav />
    <Title>Events</Title>
    <Search />
  </Header>
  ```
