# UACS Website

A Next.js 15 App Router site for the University of Auckland Calisthenics Society (UACS). The app combines a public marketing site with authenticated admin tools backed by Firebase (Cloud Firestore and Firebase Auth).

## Overview

- **Public experience**: Aurora-inspired design, dynamic hero with live member count, events gallery, smooth motion via Framer Motion, and responsive layout with Tailwind CSS 4.
- **Admin experience**: Secure Firebase-authenticated dashboard where committee members manage events.
- **Data sources**: Cloud Firestore for structured event content, and Google Sheets for real-time member statistics.

## Key Features

- **Real-time Member Counter**: Reads from Google Sheets with smart caching (`s-maxage=300`, `stale-while-revalidate=600`) and graceful fallbacks.
- **Events Management**: CRUD via `/admin/events` using Cloud Firestore as the database.
- **Authentication & Authorization**: Firebase Auth integration (Email/Password), route protection, and app-wide `AuthContext`.
- **Admin Dashboard**: Redesigned dashboard with statistics and event management capabilities. Admin navigation elements appear only when signed in.

## Tech Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + custom tokens
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Backend**: Firebase (Cloud Firestore, Authentication)
- **Utilities**: Google Sheets API, Firebase Admin SDK
- **Deployment**: Vercel

## Getting Started

1. **Clone & install**
   ```bash
   git clone https://github.com/yourusername/uacs-website.git
   cd uacs-website
   npm install
   ```
2. **Environment variables**
   ```bash
   cp .env.example .env.local
   # Populate .env.local with Firebase + Google credentials (see below)
   ```
3. **Run locally**
   ```bash
   npm run dev
   ```
4. **Open the site**: `http://localhost:3000`

### Required Environment Variables

```env
# Google Sheets member count
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----\n"

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin configuration (reuses Google Service Account credentials by default if not set)
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----\n"
```

### Available Scripts

- `npm run dev` – Start development server (Turbopack)
- `npm run build` – Production build
- `npm run start` – Run production server
- `npm run lint` – ESLint
- `npm run migrate` – Seed Firebase Firestore database with initial events from JSON data

## Documentation & Setup Guides

- **Admin authentication setup**: [SETUP_ADMIN_AUTH.md](./SETUP_ADMIN_AUTH.md)
- **Local + deployment reference**: [SETUP.md](./SETUP.md)
- **Vercel hosting guide**: [VERCEL_HOSTING_GUIDE.md](./VERCEL_HOSTING_GUIDE.md)

## Architecture Notes

```
src/
├── app/
│   ├── api/               # API routes verifying Firebase Admin tokens
│   ├── admin/             # Auth-protected admin dashboard & login pages
│   └── layout.tsx         # Wraps site with AuthProvider
├── components/
│   ├── events/            # Event gallery, cards, modals
│   ├── admin/             # Forms and dashboard components
│   └── home/              # Hero member counter and landing sections
├── contexts/              # Auth context for client components using Firebase Auth
├── lib/                   # Firebase clients and Admin SDK initialization, Google Sheets helpers
└── types/                 # Shared TypeScript contracts
```

## Security & Deployment

- Secrets live in `.env.local` (never committed). Production variables are configured in Vercel.
- Firebase Auth rules and Firestore security rules restrict writes to authenticated admins.
- Admin pages hide from unauthenticated visitors and redirect to `/admin/login`.
- Deploy to Vercel by connecting your repository, setting environment variables, and pushing to `main`.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-change`
3. Commit: `git commit -m "Describe your change"`
4. Open a pull request
