-- Run this in Supabase SQL Editor
ALTER TABLE apartments
  ADD COLUMN IF NOT EXISTS name_en text,
  ADD COLUMN IF NOT EXISTS description_en text;

-- Optional: add start_point_en to hiking_trails for translated start points
ALTER TABLE hiking_trails
  ADD COLUMN IF NOT EXISTS start_point_en text;
