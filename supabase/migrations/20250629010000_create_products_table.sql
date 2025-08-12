-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name JSONB NOT NULL, -- Multilingual names
  description JSONB NOT NULL, -- Multilingual descriptions
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for category filtering
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(available);
CREATE INDEX idx_products_sort_order ON products(sort_order);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read products
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT 
USING (true);

-- Only authenticated users can modify products (for admin)
CREATE POLICY "Products are editable by authenticated users only" 
ON products FOR ALL 
USING (auth.role() = 'authenticated');

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, sort_order) VALUES
  (
    '{"en": "Hummus", "fr": "Houmous", "nl": "Hummus"}',
    '{"en": "Chickpeas puree with tahini (sesame paste)", "fr": "Purée de pois chiches au tahini (pâte de sésame)", "nl": "Kikkererwten puree met tahini (sesampasta)"}',
    7.50,
    'cold-mezzes',
    '/images/products/houmos.webp',
    1
  ),
  (
    '{"en": "Moutabal", "fr": "Moutabal", "nl": "Moutabal"}',
    '{"en": "Grilled eggplant caviar with tahini (sesame paste)", "fr": "Caviar d\'aubergine grillée au tahini (pâte de sésame)", "nl": "Gegrilde aubergine kaviaar met tahini (sesampasta)"}',
    8.00,
    'cold-mezzes',
    '/images/products/moutabal.webp',
    2
  ),
  (
    '{"en": "Falafel", "fr": "Falafel", "nl": "Falafel"}',
    '{"en": "Deep-fried mashed chickpea balls served with tahini sauce", "fr": "Boulettes de pois chiches frits servies avec sauce tahini", "nl": "Gefrituurde kikkererwten balletjes geserveerd met tahini saus"}',
    7.00,
    'hot-mezzes',
    '/images/products/falafel.webp',
    3
  ),
  (
    '{"en": "Kibbeh (2pcs)", "fr": "Kibbeh (2pcs)", "nl": "Kibbeh (2st)"}',
    '{"en": "Fried bulgur croquettes stuffed with minced beef, onion and walnuts", "fr": "Croquettes de boulgour frites farcies à la viande hachée, oignon et noix", "nl": "Gefrituurde bulgur kroketten gevuld met gehakt, ui en walnoten"}',
    5.00,
    'hot-mezzes',
    '/images/products/kebbe.webp',
    4
  ),
  (
    '{"en": "Fattoush Salad", "fr": "Salade Fattoush", "nl": "Fattoush Salade"}',
    '{"en": "Tomatoes, lettuce, red cabbage, radish, cucumber, onion, fried bread with pomegranate molasses", "fr": "Tomates, laitue, chou rouge, radis, concombre, oignon, pain frit aux mélasses de grenade", "nl": "Tomaten, sla, rode kool, radijs, komkommer, ui, gebakken brood met granaatappel melasse"}',
    12.00,
    'salads',
    '/images/products/fattoush.webp',
    5
  ),
  (
    '{"en": "Falafel Sandwich", "fr": "Sandwich Falafel", "nl": "Falafel Sandwich"}',
    '{"en": "Fresh pita bread filled with falafel, vegetables and tahini sauce", "fr": "Pain pita frais garni de falafel, légumes et sauce tahini", "nl": "Vers pitabrood gevuld met falafel, groenten en tahini saus"}',
    9.50,
    'sandwiches',
    '/images/products/falafel.webp',
    6
  ),
  (
    '{"en": "Shish Taouk", "fr": "Shish Taouk", "nl": "Shish Taouk"}',
    '{"en": "Grilled chicken cubes with rice and grilled vegetables", "fr": "Cubes de poulet grillés avec riz et légumes grillés", "nl": "Gegrilde kip blokjes met rijst en gegrilde groenten"}',
    16.50,
    'lunch-dishes',
    '/images/products/shish-taouk.webp',
    7
  ),
  (
    '{"en": "Aish el Saraya", "fr": "Aish el Saraya", "nl": "Aish el Saraya"}',
    '{"en": "Sweetened biscuit, vegan pudding, orange blossom water and pistachio", "fr": "Biscuit sucré, pudding végétalien, eau de fleur d\'oranger et pistache", "nl": "Gezoete biscuit, veganistische pudding, oranjebloesemwater en pistache"}',
    8.50,
    'desserts',
    '/images/products/aish-el-saraya.webp',
    8
  ); 