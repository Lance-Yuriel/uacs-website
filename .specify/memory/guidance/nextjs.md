# Next.js 15 & React Guidelines

## Next.js App Router (v15+)
- **App Router Exclusively:** The `app/` directory is the only routing paradigm. The `pages/` directory is strictly forbidden.
- **Server Components by Default:** Assume all components in `src/app/` and `src/components/` are React Server Components (RSC). Do not add `'use client'` unless absolutely necessary.
  > Why: Server Components send zero JavaScript to the client, reducing bundle size and improving Largest Contentful Paint (LCP).
- **When to use `'use client'`:**
  - When using React state (`useState`, `useReducer`) or lifecycle hooks (`useEffect`, `useLayoutEffect`).
  - When using browser APIs (e.g., `window`, `document`, `localStorage`).
  - When adding event listeners (e.g., `onClick`, `onChange`).
- **Data Fetching:** Fetch data directly in Server Components using `async`/`await`. Avoid `useEffect` for data fetching unless fetching happens strictly on the client (e.g., polling after hydration).
- **Server Actions:** Use Server Actions (functions marked with `'use server'`) for data mutations (e.g., form submissions). Do not create `api/` routes just for simple database inserts if a Server Action suffices.
- **Routing & Layouts:** Use `layout.tsx` for shared UI (headers, footers). Use `page.tsx` for route-specific UI.
- **Image Optimization:** Always use `next/image` (`<Image />`) instead of `<img>` to enforce lazy loading, WebP format, and automatic resizing.
- **Navigation:** Always use `next/link` (`<Link>`) for internal routing to enable prefetching and client-side transitions.

## React State & Hooks
- **State Minimization:** Derive state from existing variables whenever possible instead of storing it in `useState`. 
  > Why: Less state means fewer bugs and unnecessary re-renders.
- **Context API:** Use React Context sparingly. It is meant for global, slowly-changing data (like Auth state or Theme). Do not use it for frequent, rapidly changing data.
- **Custom Hooks:** Extract complex component logic into custom hooks (`useFeatureName`) placed in `src/hooks/` to keep UI components focused on rendering.
