-- Run this in Supabase SQL Editor

ALTER TABLE apartments
  ADD COLUMN IF NOT EXISTS area_sqm integer,
  ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT '{}';

ALTER TABLE hiking_trails
  ADD COLUMN IF NOT EXISTS name_en text,
  ADD COLUMN IF NOT EXISTS description_en text;
