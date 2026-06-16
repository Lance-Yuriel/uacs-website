# Supabase Setup Instructions

## Step 1: Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: UACS Website
   - **Region**: Asia Pacific (Sydney) or closest to you
   - **Database Password**: Create a strong password (save it securely!)
5. Click "Create new project" and wait 2-3 minutes

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click the **gear icon** (⚙️) → **API**
2. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co` (copy this)
   - **anon public** key: Starts with `eyJ...` (copy this)

## Step 3: Create Database Tables

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Paste the contents of `SUPABASE_INITIAL_SCHEMA.sql` and click **RUN**

Alternatively, paste this SQL directly:

```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  description TEXT,
  upcoming_description TEXT,
  event_photo_url TEXT,
  google_drive_link TEXT,
  registration_link TEXT,
  status TEXT DEFAULT 'past' CHECK (status IN ('upcoming', 'past')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for events"
  ON events FOR SELECT
  USING (true);
```

## Step 4: Configure Environment Variables

Once you have your credentials, add them to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Test Connection

Run `npm run dev` and check if the connection works. You should see no errors in the console.

## Next Steps

After setup is complete:
1. Run `npm run migrate` to seed events from JSON data
2. Configure admin authentication (see `SETUP_ADMIN_AUTH.md`)
3. Set up event photo storage (see `SUPABASE_EVENT_PHOTOS_SETUP.md`)
