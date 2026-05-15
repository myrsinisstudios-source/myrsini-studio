-- CMS Tables for Myrsini Studios admin panel
-- Run once in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS emergency_contacts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon        text NOT NULL DEFAULT '📞',
  label       text NOT NULL,
  number      text NOT NULL,
  description text NOT NULL DEFAULT '',
  category    text NOT NULL DEFAULT 'Χρήσιμα',
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hiking_trails (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  distance    text NOT NULL DEFAULT '',
  duration    text NOT NULL DEFAULT '',
  elevation   text NOT NULL DEFAULT '',
  difficulty  text NOT NULL DEFAULT 'Εύκολη',
  description text NOT NULL DEFAULT '',
  start_point text NOT NULL DEFAULT '',
  tags        text[] NOT NULL DEFAULT '{}',
  icon        text NOT NULL DEFAULT '🥾',
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           text NOT NULL UNIQUE,
  name_el        text NOT NULL,
  name_en        text NOT NULL DEFAULT '',
  icon           text NOT NULL DEFAULT '🏖️',
  image_url      text,
  description_el text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  duration       text,
  distance       text,
  category       text,
  sort_order     integer NOT NULL DEFAULT 0,
  created_at     timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS history_photos (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url  text NOT NULL,
  caption    text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS slider_photos (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url  text NOT NULL,
  title      text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (allow public reads, restrict writes)
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiking_trails      ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities         ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_photos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE slider_photos      ENABLE ROW LEVEL SECURITY;

-- Public read access for site display
CREATE POLICY "public read emergency_contacts" ON emergency_contacts FOR SELECT USING (true);
CREATE POLICY "public read hiking_trails"      ON hiking_trails      FOR SELECT USING (true);
CREATE POLICY "public read activities"         ON activities         FOR SELECT USING (true);
CREATE POLICY "public read history_photos"     ON history_photos     FOR SELECT USING (true);
CREATE POLICY "public read slider_photos"      ON slider_photos      FOR SELECT USING (true);

-- Full access for authenticated users (admin panel)
CREATE POLICY "auth all emergency_contacts" ON emergency_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "auth all hiking_trails"      ON hiking_trails      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "auth all activities"         ON activities         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "auth all history_photos"     ON history_photos     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "auth all slider_photos"      ON slider_photos      FOR ALL USING (true) WITH CHECK (true);
