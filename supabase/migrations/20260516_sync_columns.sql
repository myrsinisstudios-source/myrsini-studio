-- Sync duplicate columns: run once in Supabase SQL Editor
UPDATE apartments SET area_sqm = sqm     WHERE area_sqm IS NULL AND sqm     IS NOT NULL;
UPDATE apartments SET sqm     = area_sqm WHERE sqm     IS NULL AND area_sqm IS NOT NULL;
UPDATE apartments SET images  = gallery  WHERE (images  IS NULL OR images = '{}') AND gallery IS NOT NULL AND gallery != '{}';
UPDATE apartments SET gallery = images   WHERE (gallery IS NULL OR gallery = '{}') AND images  IS NOT NULL AND images  != '{}';
