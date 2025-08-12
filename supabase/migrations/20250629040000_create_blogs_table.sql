-- Create blogs table for dynamic blog system
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_name TEXT,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  meta_title TEXT, -- For SEO
  meta_description TEXT, -- For SEO
  reading_time INTEGER, -- In minutes
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_blogs_published ON public.blogs(published);
CREATE INDEX idx_blogs_featured ON public.blogs(featured);
CREATE INDEX idx_blogs_published_at ON public.blogs(published_at);
CREATE INDEX idx_blogs_slug ON public.blogs(slug);
CREATE INDEX idx_blogs_tags ON public.blogs USING GIN(tags);
CREATE INDEX idx_blogs_created_at ON public.blogs(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published blogs
CREATE POLICY "Anyone can read published blogs" ON public.blogs
  FOR SELECT USING (published = true);

-- Policy: Authenticated users can manage blogs (for admin)
CREATE POLICY "Authenticated users can manage blogs" ON public.blogs
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blogs_updated_at();

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(
    regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
END;
$$ LANGUAGE plpgsql;

-- Insert sample blog posts
INSERT INTO public.blogs (
  title,
  slug,
  excerpt,
  content,
  author_name,
  cover_image_url,
  tags,
  published,
  featured,
  meta_title,
  meta_description,
  reading_time,
  published_at
) VALUES 
(
  'Vegetarian Restaurant Brussels: All you need to know about it!',
  'vegetarian-restaurant-brussels',
  'Most folks misperceive the demand for vegan and vegetarian food in Brussels. However, the truth is Brussels hosts a thriving vibrant vegetarian and vegan culture.',
  E'# Introduction\n\nMost folks misperceive the demand for vegan and vegetarian food in Brussels. However, the truth is Brussels hosts a thriving vibrant vegetarian and vegan culture.\n\n## Vegetarian restaurant brussels\n\nThere are many vegetarian options available in Brussels. Guests can find many family traditional places. For instance, there''s a remarkable center to dine with kids.\n\nIn addition to so-soft haven decoration and coffee, this among venue offers a wide variety of kid dishes and main courses that will make your experience to live good restaurants.\n\n## Belgium''s must-try vegetarian cuisine\n\nHere are some must-try dishes that you should definitely add to your list:\n\n### Fries from Belgium\nYou could never visit Belgium without trying their famous fries. The crispy exterior and fluffy interior make them irresistible.\n\n### Waffles\nConsidered one of the most beloved treats in Belgium, waffles are perfect with fruits, cream, and various toppings.\n\n### Cheese structs\nBelgian cheese offerings are diverse and delicious, perfect for vegetarian food lovers.\n\n## Conclusion\n\nVegetarian restaurants are a great business opportunity in Brussels. The high-quality food and diverse options make the city a perfect destination for plant-based dining.',
  'East at West Team',
  '/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp',
  ARRAY['vegetarian', 'brussels', 'restaurant', 'food'],
  true,
  true,
  'Vegetarian Restaurant Brussels: Complete Guide 2024',
  'Discover the best vegetarian restaurants in Brussels. Complete guide to plant-based dining, must-try dishes, and vegetarian culture in Belgium.',
  8,
  NOW()
),
(
  'Lebanese Mezze: A Journey Through Authentic Flavors',
  'lebanese-mezze-authentic-flavors',
  'Discover the rich tradition of Lebanese mezze at East at West. From hummus to falafel, explore the authentic flavors that make Lebanese cuisine special.',
  E'# Lebanese Mezze: A Journey Through Authentic Flavors\n\n## What is Mezze?\n\nMezze is the heart of Lebanese dining culture. It''s not just a meal, but a social experience that brings people together around a table filled with small, flavorful dishes.\n\n## Our Signature Cold Mezze\n\n### Hummus\nOur signature hummus is made fresh daily with the finest tahini, olive oil, and chickpeas. Smooth, creamy, and bursting with flavor.\n\n### Moutabal\nA smoky eggplant dip that perfectly balances the richness of tahini with the subtle char of roasted eggplant.\n\n### Warak Enab\nDelicate grape leaves stuffed with rice, herbs, and spices. Each bite is a perfect harmony of flavors.\n\n## Hot Mezze Favorites\n\n### Falafel\nCrispy on the outside, tender on the inside. Our falafel is made from fresh herbs and spices, never from a mix.\n\n### Kebbe\nTraditional Lebanese kibbeh, perfectly seasoned and fried to golden perfection.\n\n## The East at West Experience\n\nAt East at West, we bring authentic Lebanese flavors to Brussels. Every dish is prepared with love and traditional techniques passed down through generations.',
  'Chef Ahmad',
  '/images/cold-mezzes/houmos.webp',
  ARRAY['lebanese', 'mezze', 'authentic', 'middle-eastern'],
  true,
  false,
  'Lebanese Mezze Guide - Authentic Middle Eastern Cuisine',
  'Experience authentic Lebanese mezze at East at West Brussels. Traditional recipes, fresh ingredients, and the true taste of the Middle East.',
  6,
  NOW() - INTERVAL '2 days'
),
(
  'The Art of Lebanese Hospitality in Brussels',
  'lebanese-hospitality-brussels',
  'Explore how East at West brings the warmth and tradition of Lebanese hospitality to the heart of Brussels.',
  E'# The Art of Lebanese Hospitality in Brussels\n\n## A Tradition of Warmth\n\nLebanese hospitality, known as "karam," is more than just service – it''s a way of life. At East at West, we bring this ancient tradition to Brussels.\n\n## More Than Just a Meal\n\nWhen you dine with us, you''re not just a customer – you''re a guest in our home. This philosophy shapes every interaction, from the moment you walk in until you leave.\n\n## Creating Community\n\nOur restaurant serves as a gathering place where cultures meet and friendships are formed over shared meals and stories.\n\n## The Brussels Connection\n\nBrussels'' multicultural spirit perfectly complements Lebanese values of openness and hospitality. Together, they create something unique and special.',
  'Hanna Ghanem',
  '/images/hanna.webp',
  ARRAY['hospitality', 'culture', 'brussels', 'community'],
  true,
  false,
  'Lebanese Hospitality in Brussels - East at West',
  'Experience authentic Lebanese hospitality in Brussels. Discover how East at West creates a warm, welcoming environment for all guests.',
  4,
  NOW() - INTERVAL '5 days'
),
(
  'Upcoming: Ramadan Special Menu 2024',
  'ramadan-special-menu-2024',
  'Get ready for our special Ramadan menu featuring traditional iftar dishes and family sharing platters.',
  E'# Upcoming: Ramadan Special Menu 2024\n\n## Coming Soon\n\nThis Ramadan, East at West will offer a special menu designed for iftar gatherings and family celebrations.\n\n## What to Expect\n\n- Traditional iftar starters\n- Family sharing platters\n- Special Ramadan beverages\n- Extended evening hours\n\n## Reservations\n\nReservations will open soon. Stay tuned for more details!\n\n*This is a preview of our upcoming Ramadan offerings. Full details will be announced closer to the date.*',
  'East at West Team',
  '/images/menus/menu-east-at-west.webp',
  ARRAY['ramadan', 'special-menu', 'coming-soon'],
  false,
  false,
  'Ramadan Special Menu 2024 - East at West Brussels',
  'Coming soon: Special Ramadan menu at East at West Brussels. Traditional iftar dishes and family sharing platters.',
  2,
  NULL
)
ON CONFLICT (slug) DO NOTHING;

-- Comment on table
COMMENT ON TABLE public.blogs IS 'Dynamic blog system for East at West restaurant website';
COMMENT ON COLUMN public.blogs.slug IS 'URL-friendly unique identifier for blog posts';
COMMENT ON COLUMN public.blogs.tags IS 'Array of tags for categorization and filtering';
COMMENT ON COLUMN public.blogs.published IS 'Whether the blog post is publicly visible';
COMMENT ON COLUMN public.blogs.featured IS 'Whether the blog post should be highlighted on the homepage';
COMMENT ON COLUMN public.blogs.reading_time IS 'Estimated reading time in minutes'; 