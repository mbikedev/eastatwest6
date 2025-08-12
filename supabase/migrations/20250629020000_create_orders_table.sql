-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  delivery_type VARCHAR(20) NOT NULL CHECK (delivery_type IN ('pickup', 'delivery')),
  delivery_address JSONB, -- Only for delivery orders
  delivery_date DATE NOT NULL,
  delivery_time TIME NOT NULL,
  additional_notes TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  language VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name JSONB NOT NULL, -- Store product name at time of order
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Orders are viewable by authenticated users only" 
ON orders FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Orders are insertable by everyone" 
ON orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Orders are editable by authenticated users only" 
ON orders FOR UPDATE 
USING (auth.role() = 'authenticated');

-- RLS Policies for order_items
CREATE POLICY "Order items are viewable by authenticated users only" 
ON order_items FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Order items are insertable by everyone" 
ON order_items FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Order items are editable by authenticated users only" 
ON order_items FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  -- Get current date in YYYYMMDD format
  SELECT TO_CHAR(NOW(), 'YYYYMMDD') INTO new_number;
  
  -- Get count of orders today
  SELECT COUNT(*) + 1 
  FROM orders 
  WHERE DATE(created_at) = CURRENT_DATE
  INTO counter;
  
  -- Combine date with padded counter
  new_number := new_number || LPAD(counter::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number(); 