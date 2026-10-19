-- supabase/schema.sql
-- Poultry E-Commerce database schema.
-- Run this in the Supabase SQL editor before running seed.sql.

-- ---------------------------------------------------------------------------
-- 1. Categories table
-- ---------------------------------------------------------------------------
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  min_age_months INTEGER NOT NULL,
  max_age_months INTEGER, -- NULL means no upper limit
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- 2. Chickens table
-- ---------------------------------------------------------------------------
CREATE TABLE chickens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age_months INTEGER NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('Male', 'Female', 'Unsexed')),
  weight_kg NUMERIC,
  color TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
  description TEXT NOT NULL,
  health_notes TEXT,
  image_urls TEXT[] DEFAULT '{}',
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at on every row update.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chickens_updated_at
  BEFORE UPDATE ON chickens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 3. Seed categories (exact order from the spec)
-- ---------------------------------------------------------------------------
INSERT INTO categories (name, slug, min_age_months, max_age_months, sort_order) VALUES
  ('4-Month-Old Chickens', '4-months', 4, 4, 1),
  ('5-Month-Old Chickens', '5-months', 5, 5, 2),
  ('6-Months & Older Chickens', '6-months-and-older', 6, NULL, 3)
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------

-- Enable RLS on all tables.
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chickens ENABLE ROW LEVEL SECURITY;

-- Categories: fully readable by anonymous users.
CREATE POLICY "Categories are public"
  ON categories
  FOR SELECT
  TO anon
  USING (true);

-- Categories: admin-only writes.
CREATE POLICY "Admin manages categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Chickens: anonymous users can only SELECT published rows.
CREATE POLICY "Published chickens are public"
  ON chickens
  FOR SELECT
  TO anon
  USING (is_published = true);

-- Chickens: admin (authenticated) full access.
CREATE POLICY "Admin manages chickens"
  ON chickens
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 5. Storage bucket for chicken images
-- ---------------------------------------------------------------------------
-- Run this in the Supabase dashboard (SQL) or via the API.
INSERT INTO storage.buckets (id, name, public)
VALUES ('chicken-images', 'chicken-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for all images in the bucket.
CREATE POLICY "Chicken images are publicly readable"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'chicken-images');

-- Admin-only write for the chicken-images bucket.
CREATE POLICY "Admin can upload chicken images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'chicken-images');

CREATE POLICY "Admin can update chicken images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'chicken-images')
  WITH CHECK (bucket_id = 'chicken-images');

CREATE POLICY "Admin can delete chicken images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'chicken-images');