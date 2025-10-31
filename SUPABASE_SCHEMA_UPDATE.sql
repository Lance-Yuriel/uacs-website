-- Update Executives Table Schema
-- This migration updates the executives table to match the current JSON structure
-- Run this in Supabase SQL Editor

-- Step 0: Clear existing data and change id column type to TEXT
-- First, delete all existing executives
DELETE FROM executives;

-- Change id column type to TEXT if it's currently UUID
-- This allows us to use string IDs like "exec-001" from JSON
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'executives' 
    AND column_name = 'id' 
    AND data_type = 'uuid'
  ) THEN
    -- If id is UUID, we need to change it to TEXT
    -- First, drop any constraints on the id column
    ALTER TABLE executives DROP CONSTRAINT IF EXISTS executives_pkey;
    ALTER TABLE executives ALTER COLUMN id TYPE TEXT;
    ALTER TABLE executives ADD PRIMARY KEY (id);
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'executives' 
    AND column_name = 'id' 
    AND data_type = 'text'
  ) THEN
    -- Already TEXT, just ensure primary key exists
    -- Check if primary key constraint already exists
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'executives_pkey'
    ) THEN
      ALTER TABLE executives ADD PRIMARY KEY (id);
    END IF;
  END IF;
END $$;

-- Step 1: Add new columns that don't exist yet
ALTER TABLE executives
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS responsibilities TEXT[],
ADD COLUMN IF NOT EXISTS joined_year INTEGER,
ADD COLUMN IF NOT EXISTS linked_in TEXT;

-- Step 2: Ensure is_co_founder column exists (should already exist)
ALTER TABLE executives
ADD COLUMN IF NOT EXISTS is_co_founder BOOLEAN DEFAULT false;

-- Step 3: Copy data from old columns to new columns (if old columns exist and data exists)
-- Only copy if the old columns exist (for backward compatibility)
DO $$ 
BEGIN
  -- Copy short_bio to bio if short_bio column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'executives' 
    AND column_name = 'short_bio'
  ) THEN
    UPDATE executives 
    SET bio = short_bio 
    WHERE bio IS NULL AND short_bio IS NOT NULL;
  END IF;

  -- Copy photo_url to image if photo_url column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'executives' 
    AND column_name = 'photo_url'
  ) THEN
    UPDATE executives 
    SET image = photo_url 
    WHERE image IS NULL AND photo_url IS NOT NULL;
  END IF;
END $$;

-- Step 4: After re-migrating data, you can drop old columns that are no longer needed
-- UNCOMMENT THESE LINES AFTER YOU'VE VERIFIED THE DATA MIGRATION IS CORRECT:
-- ALTER TABLE executives DROP COLUMN IF EXISTS short_bio;
-- ALTER TABLE executives DROP COLUMN IF EXISTS photo_url;
-- ALTER TABLE executives DROP COLUMN IF EXISTS introduction;
-- ALTER TABLE executives DROP COLUMN IF EXISTS degree;
-- ALTER TABLE executives DROP COLUMN IF EXISTS favourite_skills;

-- Note: After running this migration and re-migrating your data, update database.ts types file

