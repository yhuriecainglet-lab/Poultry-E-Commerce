-- supabase/seed.sql
-- Sample data for the poultry e-commerce app.
-- Run AFTER schema.sql. Inserts 9 sample chickens (3 per category).
-- Image URLs are placeholders — replace with real Supabase Storage URLs after upload.

DO $$
DECLARE
  cat_4 uuid;
  cat_5 uuid;
  cat_6 uuid;
BEGIN
  SELECT id INTO cat_4 FROM categories WHERE slug = '4-months';
  SELECT id INTO cat_5 FROM categories WHERE slug = '5-months';
  SELECT id INTO cat_6 FROM categories WHERE slug = '6-months-and-older';

  -- 4-Month-Old Chickens
  INSERT INTO chickens (name, breed, age_months, sex, weight_kg, color, price, stock_quantity, description, health_notes, image_urls, category_id, is_featured, is_published) VALUES
    ('Rhode Island Red Pullet', 'Rhode Island Red', 4, 'Female', 1.8, 'Rich mahogany', 350, 12, 'Healthy 4-month-old pullet, ideal for starting a small flock. Active forager with a calm temperament.', 'Vaccinated, dewormed', ARRAY['https://placehold.co/600x400/2d6a4f/ffffff?text=Rhode+Island+Red'], cat_4, true, true),
    ('Leghorn Layer', 'Leghorn', 4, 'Female', 1.6, 'Pure white', 320, 8, 'White Leghorn pullet known for excellent egg production and alert behavior.', 'Vaccinated, dewormed', ARRAY['https://placehold.co/600x400/2d6a4f/ffffff?text=Leghorn'], cat_4, true, true),
    ('Barred Plymouth Rock', 'Plymouth Rock', 4, 'Unsexed', 1.9, 'Barred black and white', 360, 0, 'Sturdy barred Plymouth Rock, great for backyard flocks. Friendly and cold-hardy.', 'Vaccinated, dewormed', ARRAY['https://placehold.co/600x400/2d6a4f/ffffff?text=Plymouth+Rock'], cat_4, false, true);

  -- 5-Month-Old Chickens
  INSERT INTO chickens (name, breed, age_months, sex, weight_kg, color, price, stock_quantity, description, health_notes, image_urls, category_id, is_featured, is_published) VALUES
    ('Capon (Castrated Rooster)', 'Cobb 500', 5, 'Male', 2.8, 'Light cream', 650, 6, 'Premium capon raised for tender meat. Castrated for optimal weight gain and flavor.', 'Vaccinated, dewormed, grain-fed', ARRAY['https://placehold.co/600x400/2d6a4f/ffffff?text=Capon'], cat_5, true, true),
    ('Buff Orpington Hen', 'Orpington', 5, 'Female', 2.6, 'Golden buff', 580, 3, 'Docile and beautiful Buff Orpington hen, excellent layer and broody mother.', 'Vaccinated, dewormed', ARRAY['https://placehold.co/600x400/2d6a4f/ffffff?text=Orpington'], cat_5, true, true),
    ('Australorp Pullet', 'Australorp', 5, 'Female', 2.2, 'Glossy black', 490, 15, 'Australian-derived breed known for calm disposition and high egg output.', 'Vaccinated, dewormed', ARRAY['https://placehold.co/600x400/2d6a4f/ffffff?text=Australorp'], cat_5, false, true);

  -- 6-Months & Older Chickens
  INSERT INTO chickens (name, breed, age_months, sex, weight_kg, color, price, stock_quantity, description, health_notes, image_urls, category_id, is_featured, is_published) VALUES
    ('Broiler Rooster', 'Cobb 700', 6, 'Male', 3.4, 'White', 750, 10, 'Fast-growing broiler rooster, raised for meat production. Broad-breasted with good conformation.', 'Vaccinated, dewormed, grain-fed', ARRAY['https://placehold.co/600x400/2d6a4f/ffffff?text=Broiler'], cat_6, true, true),
    ('Easter Egger Rooster', 'Easter Egger', 7, 'Male', 2.4, 'Variegated blue/green', 420, 4, 'Colorful Easter Egger rooster that lays blue and green eggs. Friendly and alert.', 'Vaccinated, dewormed', ARRAY['https://placehold.co/600x400/2d6a4f/ffffff?text=Easter+Egger'], cat_6, false, true),
    ('Heritage Wyandotte', 'Wyandotte', 8, 'Female', 2.7, 'Silver laced', 560, 2, 'Heritage Wyandotte hen, cold-hardy and excellent forager. Known for its laced feather pattern.', 'Vaccinated, dewormed', ARRAY['https://placehold.co/600x400/2d6a4f/ffffff?text=Wyandotte'], cat_6, true, true);
END $$;