# UACS Website — Master Constitution (Registry)

This is the central registry for all project rules, coding standards, and architectural decisions. 
Before beginning any planning or implementation phase, the AI agent MUST read and adhere to the guidelines linked below.

## Project Overview
- **Project:** UACS Website (University of Auckland Calisthenics Society)
- **Core Stack:** Next.js 15 (App Router), TypeScript (Strict), Firebase (Firestore + Auth), Tailwind CSS.
- **Deployment:** Vercel

## 📚 Guidance Registry
The following files contain detailed rules. The AI agent must query these files based on the technologies relevant to the current task.

1. **[Next.js & React](./guidance/nextjs.md)** 
   *(App Router, Server Components, State Management, Data Fetching)*
2. **[TypeScript](./guidance/typescript.md)** 
   *(Strict typing, Zod validation, Interfaces vs Types)*
3. **[Firebase & Security](./guidance/firebase.md)** 
   *(Admin vs Client SDK, Firestore rules, Data modeling, Auth)*
4. **[Tailwind CSS](./guidance/tailwind.md)** 
   *(Utility-first principles, class merging, responsive design)*
5. **[Clean Code](./guidance/clean-code.md)** 
   *(Naming conventions, early returns, SRP, error handling)*
6. **[Architecture & Modularity](./guidance/architecture-modularity.md)** 
   *(Directory structure, service pattern, component composition)*
7. **[Testing](./guidance/testing.md)** 
   *(Vitest, React Testing Library, testing philosophy)*

## 🛑 Global Anti-Hallucination Directives
Regardless of the task, the agent must obey these universal directives:

1. **Verify Before Assuming:** The agent must never assume a function, component, or API route exists. It must check the actual codebase or the `.specify/memory/architecture.md` snapshot first.
2. **No Fictional Packages:** The agent must not invent npm packages. Verify existence before adding to `package.json`.
3. **Ask for Clarification:** If a Spec or Plan is ambiguous, or if architectural decisions conflict with the guidance files, the agent must flag the issue for human review rather than guessing.
4. **Secrets Management:** Never hardcode API keys, service accounts, or tokens in source code. Use environment variables and document them in `.env.example`.
5. **Security First:** Never trust client-side data. All data mutations must be authorized (Bearer token) and validated (Zod schema) on the server.
