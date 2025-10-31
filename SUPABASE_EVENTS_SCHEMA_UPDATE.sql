-- Update Events Table Schema
-- This migration updates the events table to match the current JSON structure
-- Run this in Supabase SQL Editor

-- Step 0: Clear existing data and fix id column
-- First, delete all existing events
DELETE FROM events;

-- Change id column type to TEXT if it's currently UUID or INTEGER
-- This allows us to use string IDs like "event-001" from JSON
DO $$ 
BEGIN
  -- Check if id is UUID or INTEGER, change to TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' 
    AND column_name = 'id' 
    AND (data_type = 'uuid' OR data_type = 'integer')
  ) THEN
    -- Drop primary key constraint if it exists
    ALTER TABLE events DROP CONSTRAINT IF EXISTS events_pkey;
    
    -- If id is integer, we need to drop it and recreate as TEXT
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'events' 
      AND column_name = 'id' 
      AND data_type = 'integer'
    ) THEN
      -- Drop the old id column
      ALTER TABLE events DROP COLUMN IF EXISTS id;
      -- Create new id column as TEXT
      ALTER TABLE events ADD COLUMN id TEXT PRIMARY KEY;
    ELSE
      -- If it's UUID, just change the type
      ALTER TABLE events ALTER COLUMN id TYPE TEXT;
      ALTER TABLE events ADD PRIMARY KEY (id);
    END IF;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' 
    AND column_name = 'id' 
    AND data_type = 'text'
  ) THEN
    -- Already TEXT, just ensure primary key exists
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'events_pkey'
    ) THEN
      ALTER TABLE events ADD PRIMARY KEY (id);
    END IF;
  END IF;
  
  -- Remove uuid column if it exists (we'll use id instead)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' 
    AND column_name = 'uuid'
  ) THEN
    ALTER TABLE events DROP COLUMN IF EXISTS uuid;
  END IF;
END $$;

-- Step 1: Add missing columns
ALTER TABLE events
ADD COLUMN IF NOT EXISTS time TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS google_drive_link TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'past';

-- Ensure required columns exist
ALTER TABLE events
ADD COLUMN IF NOT EXISTS event_name TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS date DATE NOT NULL;

-- Note: After running this migration, re-run the migration script to populate data correctly

