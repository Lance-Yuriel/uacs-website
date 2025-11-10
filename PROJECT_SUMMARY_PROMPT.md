# UACS Website Project Summary - Full Feature Documentation

## Project Overview
This is a Next.js 15 website for the University of Auckland Calisthenics Society (UACS), built with TypeScript, Tailwind CSS, Framer Motion, and Supabase. The project uses the App Router, server-side rendering, and a modern component architecture.

## Tech Stack
- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 12.23.24
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (@supabase/ssr)
- **UI Libraries**: Lucide React (icons), @dnd-kit (drag-and-drop)
- **Other**: Google Sheets API (via googleapis)

## Current Features Implemented

### 1. Dynamic Member Count
- **Location**: Hero section (`src/components/home/HeroMemberCount.tsx`)
- **Data Source**: Google Sheets spreadsheet
- **API Endpoint**: `/api/members`
- **Implementation**:
  - Uses Google Sheets API with Service Account authentication
  - Fetches member count from live spreadsheet
  - Automatically filters by current year if date column is detected
  - Updates on page refresh with intelligent caching (s-maxage=300, stale-while-revalidate=600)
  - Displays "2025 Member Count" (or current year) with a singular User icon
- **Error Handling**: If unable to fetch, displays "Unable to retrieve member count at this time" with icon only (no "0", no emojis, no unprofessional text)
- **Security**: Google Sheets API credentials stored in `.env.local` (never committed)

### 2. Executive Management System

#### 2.1 Executive Database Schema
- **Table**: `executives`
- **Columns**:
  - `id` (TEXT PRIMARY KEY) - Unique identifier (e.g., "exec-001")
  - `name` (TEXT NOT NULL)
  - `position` (TEXT NOT NULL) - e.g., "President", "Vice President"
  - `title` (TEXT) - e.g., "Executive", "Treasurer" (default: "Executive")
  - `is_co_founder` (BOOLEAN DEFAULT false)
  - `bio` (TEXT) - Short bio for card display (50 chars max)
  - `image` (TEXT) - Image URL path
  - `responsibilities` (TEXT[]) - Array of responsibility strings
  - `joined_year` (INTEGER)
  - `email` (TEXT)
  - `instagram` (TEXT)
  - `introduction` (TEXT) - Full introduction paragraph for expanded view (750 characters max)
  - `degree` (TEXT) - Degree information
  - `favourite_skills` (TEXT[]) - Array of up to 3 skills
  - `display_order` (INTEGER DEFAULT 0) - For custom ordering on website
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP) - Auto-updated via trigger

#### 2.2 Executive Display (Main Website)
- **Component**: `src/components/executives/ExecutiveGrid.tsx`
- **Fetches from**: `/api/executives` (not JSON)
- **Display**:
  - Infinite horizontal snap-scroll carousel (`ExecutiveCarousel.tsx`)
  - Cards show: photo (or initials fallback), name, position, badges (Co-Founder/Executive), short bio, key responsibilities, email/Instagram icons, joined year
  - Cards have white borders, grey-ish background (`bg-[#1a1a1a]/90`), proper spacing
  - Center card is emphasized (scale 1.0, opacity 1.0), side cards are de-emphasized (scale 0.85, opacity 0.6)
  - Initial display shows `[last_card, card_0, card_1]` with card_0 (Lance) centered
  - Seamless infinite loop with smooth transitions
  - Navigation arrows for manual scrolling
- **Expandable Cards**:
  - Expand icon (Maximize2) in top-right corner with hover effect
  - Clicking expand icon opens full-screen modal (`ExecutiveModal.tsx`)
  - Modal displays: all card info + introduction, degree, favourite_skills
  - Modal has dark backdrop, smooth Framer Motion animations
  - Close button (X) or ESC key to close (improved z-index to ensure clickability)
  - Body scroll disabled when modal is open
  - Shared layout lives in `ExecutiveProfileContent.tsx` so the modal and admin preview stay visually identical

#### 2.3 Admin Executive Management
- **Page**: `/admin/executives`
- **Features**:
  - View all executives in a grid
  - **Drag-and-Drop Reordering**: Grip icon (GripVertical) on each card for drag-and-drop reordering
    - Order persists to database via `display_order` field
    - Website displays executives in this custom order
  - Add new executive (opens form modal)
  - Edit executive (opens form with pre-filled data)
  - Delete executive (with confirmation dialog)
- **Form Validation** (`src/components/admin/ExecutiveForm.tsx`):
  - **Bio**: Max 50 characters (≈8 words)
    - Real-time character counter: `X/50 characters`
    - Error message if exceeded: "Bio must be 50 characters or less (currently X)"
    - Red border on error
  - **Introduction**: Max 750 characters (≈120 words)
    - Real-time character counter: `X/750 characters`
    - Error message if exceeded: "Introduction must be 750 characters or less (currently X)"
    - Red border on error
  - **Favourite Skills**: Max 3 skills, comma-separated (preview badges update live)
    - Real-time skill counter: `X/3 skills`
    - Error message if exceeded: "Favourite skills must be 3 or fewer (currently X). Separate with commas."
    - Red border on error
  - Profile photo upload is optional (drag-and-drop styled input) with Supabase Storage integration, preview thumbnail, change/remove actions, and 20MB JPEG/PNG/WebP validation.
  - Live “Expanded Card Preview” renders alongside the form using the same layout as the public modal so admins can see spacing in real time. Heading/preview alignment matches the first form row and mirrors the exact 800px modal width, including responsive typography tweaks.
  - Form prevents submission if validation fails and all validation errors display in real-time as user types.

### 3. Authentication System
- **Provider**: Supabase Auth with `@supabase/ssr` for SSR compatibility
- **Client**: `src/lib/supabase.ts` uses `createBrowserClient`
- **Server**: `src/lib/supabase-server.ts` uses `createServerClient` with cookie handling
- **Middleware**: `middleware.ts` refreshes sessions on every request
- **Context**: `src/contexts/AuthContext.tsx` provides auth state globally
- **Admin Login**: `/admin/login`
  - Simple email/password login
  - Styled to match website aesthetic
  - Admin-only access (any logged-in user is considered admin for now)
- **Protected Routes**: Admin pages redirect to `/admin/login` if not authenticated
- **Navbar Integration**: Admin buttons ("View Website", "Dashboard", "Logout") only visible when logged in

### 4. Admin Dashboard
- **Page**: `/admin`
- **Features**:
  - Welcome message with user email
  - Quick stats card
  - Navigation cards to Executives and Events management
  - Cards have hover effect (white background, black text)
  - Gradient heading: "UACS Admin Dashboard"
- **Navbar**: Admin-specific buttons (View Website, Dashboard, Logout) visible when logged in
- **Footer**: Hidden on admin pages

### 5. Database Setup
- **Single Schema File**: `SUPABASE_INITIAL_SCHEMA.sql`
  - Creates both `executives` and `events` tables
  - Includes all fields (introduction, degree, favourite_skills, display_order)
  - Sets up RLS policies
  - Creates triggers for `updated_at`
  - Creates indexes for efficient sorting
- **Migration Script**: `scripts/migrate-data.ts`
  - Migrates data from JSON files to Supabase
  - Uses `npm run migrate`

### 6. API Routes
- **GET `/api/executives`**: Returns all executives ordered by `display_order`, then `name`
- **POST `/api/executives`**: Creates new executive (admin only), auto-assigns `display_order`
- **GET `/api/executives/[id]`**: Returns single executive
- **PUT `/api/executives/[id]`**: Updates executive (admin only)
- **DELETE `/api/executives/[id]`**: Deletes executive (admin only)
- **POST `/api/executives/reorder`**: Updates `display_order` for multiple executives (admin only)
- **GET `/api/members`**: Returns member count from Google Sheets

All API routes use `createClientFromRequest` for server-side Supabase client with proper cookie handling.

## Validation Rules Summary

### Executive Form Validation
1. **Bio**: Maximum 50 characters
   - Counter: "X/50 characters"
   - Error: "Bio must be 50 characters or less (currently X)"
   - Visual: Red border on error

2. **Introduction**: Maximum 750 characters
   - Counter: "X/750 characters"
   - Error: "Introduction must be 750 characters or less (currently X)"
   - Visual: Red border on error

3. **Favourite Skills**: Maximum 3 skills, comma-separated
   - Counter: "X/3 skills"
   - Error: "Favourite skills must be 3 or fewer (currently X). Separate with commas."
   - Visual: Red border on error

### Event Form Validation (To Be Implemented)
4. **Event Description**: Maximum 30 words
   - Estimated: ~240 characters (8 chars per word average)
   - Counter should show word count
   - Error message similar to introduction validation

## Future Features to Implement

### Events Management System
- **Database Table**: `events` (already created in schema)
- **Fields**: `id`, `event_name`, `date`, `time`, `location`, `description`, `google_drive_link`, `status` ('upcoming' or 'past')
- **Features Needed**:
  - Admin CRUD for events (Add, Edit, Delete)
  - Automatic status switching (upcoming → past when date passes)
  - Upcoming Events section:
    - Display: event name, date, time, location
    - Countdown message: "X days until Event_Name!" or "Event_Name is happening today!"
    - Sorted chronologically (soonest first)
    - Admin can edit details
  - Past Events section:
    - Display: event name, date, description, Google Drive link
    - "Photos coming soon" placeholder if no link
    - "View Photos" button when link is available
    - Admin has Add, Edit, Delete controls
- **Validation**:
  - Description: Max 30 words (~240 characters)
  - Real-time word counter and error messages

### Admin Features
- Restrict admin access to specific user IDs (currently any logged-in user is admin)
- Add member login system (future expansion)

## File Structure Overview

```
src/
├── app/
│   ├── api/
│   │   ├── executives/
│   │   │   ├── route.ts (GET, POST)
│   │   │   ├── [id]/route.ts (GET, PUT, DELETE)
│   │   │   └── reorder/route.ts (POST)
│   │   └── members/route.ts (GET)
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── page.tsx (dashboard)
│   │   └── executives/page.tsx
│   └── layout.tsx (wraps with AuthProvider)
├── components/
│   ├── admin/
│   │   └── ExecutiveForm.tsx
│   ├── executives/
│   │   ├── ExecutiveCard.tsx
│   │   ├── ExecutiveCarousel.tsx
│   │   ├── ExecutiveGrid.tsx
│   │   └── ExecutiveModal.tsx
│   └── home/
│       └── HeroMemberCount.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── supabase.ts (client)
│   ├── supabase-server.ts (server)
│   ├── googleSheets.ts
│   └── utils.ts
└── types/
    ├── executive.ts
    ├── database.ts
    └── site.ts
```

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Google Sheets
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
```

## Database Setup Instructions

1. Run `SUPABASE_INITIAL_SCHEMA.sql` in Supabase SQL Editor
2. Run `npm run migrate` to migrate existing data from JSON files

## Important Notes

1. **Authentication**: Uses `@supabase/ssr` for proper cookie handling in Next.js 15
2. **API Routes**: Must await `params` in Next.js 15 (e.g., `const { id } = await params`)
3. **Ordering**: Website displays executives by `display_order` field, which can be changed via drag-and-drop in admin panel
4. **Validation**: All form validation happens client-side with real-time feedback
5. **Modal**: Executive modal uses Framer Motion for smooth animations and prevents body scroll
6. **Carousel**: Infinite scroll carousel with seamless looping and emphasis on center card
7. **Styling**: Consistent use of Tailwind CSS with custom color tokens (primary-*, text-*, bg-*, etc.)

## Current Branch Strategy

- **Main branch**: Frontend/UI-related changes
- **Feature branch**: Backend/feature-related changes

## Next Steps for YOU (Current AI Assistant)

1. Implement Events Management System (CRUD, automatic status updates, countdowns)
2. Add validation for event descriptions (30 words max)
3. Integrate events display with existing frontend components
4. Test all validation rules thoroughly
5. Add any missing admin features
6. Consider future member login system architecture

---

**This document provides a comprehensive overview of the project. Use it as a reference for continuing development or onboarding new team members.**

