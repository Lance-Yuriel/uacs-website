-- Add policies to allow data insertion
-- Run this in Supabase SQL Editor

-- Allow anyone to insert executives (for now, we'll restrict this later with admin auth)
CREATE POLICY "Allow insert on executives"
  ON executives FOR INSERT
  WITH CHECK (true);

-- Allow anyone to insert events (for now, we'll restrict this later with admin auth)
CREATE POLICY "Allow insert on events"
  ON events FOR INSERT
  WITH CHECK (true);

-- Allow public to update data (will restrict later with admin auth)
CREATE POLICY "Allow update on executives"
  ON executives FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow update on events"
  ON events FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public to delete data (will restrict later with admin auth)
CREATE POLICY "Allow delete on executives"
  ON executives FOR DELETE
  USING (true);

CREATE POLICY "Allow delete on events"
  ON events FOR DELETE
  USING (true);
