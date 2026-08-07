# Firebase Guidelines

## Architecture & Initialization
- **Client SDK (`src/lib/firebase.ts`):** This is a singleton. Import `auth`, `db`, and `storage` from here for all client-side operations. Do not initialize Firebase in multiple places.
- **Admin SDK (`src/lib/firebase-admin.ts`):** This is a singleton for server-side operations (API routes, Server Components, Server Actions). 
  > **CRITICAL:** The Admin SDK must *never* be imported into a file with `'use client'`. This will leak service account credentials and crash the client bundle.
- **Initialization Guard:** Both SDKs must use a guard (`getApps().length === 0`) to prevent re-initialization errors during Next.js Hot Module Replacement (HMR).

## Firestore Operations
- **Service Layer:** All database operations (reads, writes, queries) must be abstracted into service functions (e.g., `src/lib/events.ts`). Do not write raw Firestore queries (`getDoc`, `setDoc`) directly inside React components.
- **Batching:** Use `writeBatch` when modifying multiple documents at once to ensure atomicity.
- **Pagination:** Always use `limit()` on list queries. Do not fetch entire collections.

## Authentication & Security
- **Auth State:** Use `onAuthStateChanged` in a global AuthProvider (e.g., `AuthContext.tsx`) to manage the current user. 
- **Admin Verification:** Relying on `!!user` on the client is insufficient for admin privileges. Admin status must be verified server-side either by checking Custom Claims or by querying an `admins` collection.
- **Security Rules (`firestore.rules`):**
  - The database must never be in open "Test Mode" (`allow read, write: if true;`).
  - Rules must enforce authentication (`request.auth != null`) for writes.
  - Granular rules must be updated whenever a new collection is introduced.
- **Environment Variables:**
  - Client config uses `NEXT_PUBLIC_FIREBASE_*`.
  - Admin SDK credentials use `FIREBASE_ADMIN_*`.

## Data Modeling
- **Denormalization:** No-SQL databases favor read performance. It is acceptable to duplicate data (e.g., storing a user's name on an event document) to avoid complex client-side joins.
