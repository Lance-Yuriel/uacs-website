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
3. Paste this SQL and click **RUN**:

```sql
-- Create executives table
CREATE TABLE executives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  title TEXT,
  photo_url TEXT,
  short_bio TEXT,
  introduction TEXT,
  degree TEXT,
  favourite_skills TEXT[],
  email TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  description TEXT,
  google_drive_link TEXT,
  status TEXT CHECK (status IN ('upcoming', 'past')) DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on both tables
ALTER TABLE executives ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (visitors can view data)
CREATE POLICY "Public read access for executives"
  ON executives FOR SELECT
  USING (true);

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

After setup is complete, we'll:
1. Add migration data (existing executives and events)
2. Implement admin authentication
3. Add CRUD operations
