# UACS Website

A Next.js 15 App Router site for the University of Auckland Calisthenics Society (UACS). The app combines a public marketing site with authenticated admin tools backed by Supabase.

## Overview

- **Public experience**: Aurora-inspired design, dynamic hero with live member count, executive carousel with modal details, smooth motion via Framer Motion, and responsive layout with Tailwind CSS 4.
- **Admin experience**: Secure Supabase-authenticated dashboards where committee members manage executive profiles, upload images, and preview cards in real time.
- **Data sources**: Supabase Postgres for structured content and Google Sheets for real-time member statistics. API routes use `@supabase/ssr` helpers for cookie-aware sessions.

## Key Features

- **Real-time Member Counter**: Reads from Google Sheets with smart caching (`s-maxage=300`, `stale-while-revalidate=600`) and graceful fallbacks.
- **Executive Management System**: CRUD via `/admin/executives`, drag-and-drop ordering, rich modal previews, and Supabase Storage-backed image uploads.
- **Executive Carousel**: Infinite snap-scroll carousel with emphasized center card, expansions handled by `ExecutiveModal` sharing layout via `ExecutiveProfileContent`.
- **Authentication & Authorization**: Supabase Auth integration (SSR-compatible), middleware session refresh, and app-wide `AuthContext`.
- **Admin Dashboard**: Personalized welcome, quick stats, and navigation to management tools; admin navigation elements appear only when signed in.

## Tech Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + custom tokens
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Utilities**: Google Sheets API, `@supabase/ssr`
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
   # Populate .env.local with Supabase + Google credentials (see below)
   ```
3. **Run locally**
   ```bash
   npm run dev
   ```
4. **Open the site**: `http://localhost:3000`

### Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional service key (CLI scripts only)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Sheets member count
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----\n"
```

### Available Scripts

- `npm run dev` – Start development server (Turbopack)
- `npm run build` – Production build
- `npm run start` – Run production server
- `npm run lint` – ESLint
- `npm run migrate` – Seed Supabase tables from JSON data

## Documentation & Setup Guides

- **Supabase project bootstrap**: `SETUP_SUPABASE.md`
- **Admin authentication**: `SETUP_ADMIN_AUTH.md`
- **Supabase Storage for executive photos**: `SUPABASE_EXECUTIVE_PHOTOS_SETUP.md`
- **Supabase Storage for event photos**: `SUPABASE_EVENT_PHOTOS_SETUP.md`
- **Local + deployment quick reference**: `SETUP.md`

Each guide focuses on a specific operational area; the README stays high-level to avoid duplication.

## Architecture Notes

```
src/
├── app/
│   ├── api/               # Supabase-powered Next.js API routes
│   ├── admin/             # Auth-protected admin pages
│   └── layout.tsx         # Wraps site with AuthProvider
├── components/
│   ├── executives/        # Carousel, modal, shared profile content
│   ├── admin/             # Forms & previews used in dashboard
│   └── home/              # Hero member counter and landing sections
├── contexts/              # Auth context for client components
├── lib/                   # Supabase clients, Google Sheets helpers, utilities
└── types/                 # Shared TypeScript contracts
```

### Executive Validation Rules

- **Name**: ≤ 32 characters (≈ 4-5 words); live validation with error messaging.
- **Bio**: ≤ 50 characters; live counter with friendly error messaging.
- **Introduction**: 700-750 characters (≈ 112-120 words); real-time counter and error state.
- **Favourite skills**: ≤ 3 comma-separated values; live badge preview and error when exceeded.
- **Images**: 20 MB max, JPEG/PNG/WebP; validated before upload.

These rules are enforced in `ExecutiveForm` with immediate feedback, matching the layout used in the public modal preview.

## Security & Deployment

- Secrets live in `.env.local` (never committed). Production variables configured in Vercel.
- Supabase RLS policies permit public reads while restricting writes to authenticated admins.
- Admin pages hide from unauthenticated visitors and redirect to `/admin/login`.
- Deploy to Vercel by connecting your repository, setting environment variables, and pushing to `main`.

## Upcoming Feature: Events Management

- **Database**: Supabase `events` table with `id`, `event_name`, `date`, `time`, `location`, optional `description` (past events only), optional `google_drive_link`, `status` (`upcoming` | `past`), and timestamps.
- **Admin experience**: `/admin/events` CRUD surface with live previews, ability to update any field (date/time/location changes included), and automatic status transitions when event dates pass.
- **Public upcoming events**:
  - Chronologically sorted cards showing name, date/time, location.
  - Dynamic message per event: `"X days until [Event Name]!"` or `"[Event Name] is happening today!"`.
- **Public past events**:
  - Automatically moves events once the date passes.
  - Cards grouped by year (e.g., 2024, 2025) with space for descriptions and a Google Drive gallery link.
  - Before photos are available, display a `Photos coming soon` button placeholder; when a link exists, show a `View photos` action.
- **Validation**:
  - Event name: ≤ 32 characters (≈ 4-5 words)
  - Location: ≤ 50 characters
  - Description: ≤ 210 characters (~24 words)
  - All validations include real-time counters, error messaging, and enforced submission guardrails.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-change`
3. Commit: `git commit -m "Describe your change"`
4. Open a pull request