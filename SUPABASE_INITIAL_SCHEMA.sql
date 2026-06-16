-- Initial Supabase Schema Setup
-- This file creates the events table from scratch
-- Run this in Supabase SQL Editor if you want to start fresh
-- WARNING: This will DROP existing tables and all data!

-- Step 1: Drop existing tables if they exist (this deletes all data!)
DROP TABLE IF EXISTS events CASCADE;

-- Step 2: Create Events Table
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

-- Step 3: Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger to auto-update updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Step 6: Create initial RLS policies (allow public access for now, will restrict with admin auth later)
CREATE POLICY "Allow public read on events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on events"
  ON events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on events"
  ON events FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on events"
  ON events FOR DELETE
  USING (true);

-- Note: After running this schema, run the migration script to populate data:
-- npm run migrate
