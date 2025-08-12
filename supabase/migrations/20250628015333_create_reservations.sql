-- Create reservations table for East at West restaurant
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0 AND number_of_guests <= 22),
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations (reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON public.reservations (email);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations (status);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations (created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own reservations
CREATE POLICY "Users can view own reservations" ON public.reservations
  FOR SELECT USING (auth.email() = email);

-- Policy: Users can insert their own reservations
CREATE POLICY "Users can create reservations" ON public.reservations
  FOR INSERT WITH CHECK (auth.email() = email);

-- Policy: Users can update their own reservations
CREATE POLICY "Users can update own reservations" ON public.reservations
  FOR UPDATE USING (auth.email() = email);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on row update
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to the table
COMMENT ON TABLE public.reservations IS 'Store restaurant reservations for East at West';
COMMENT ON COLUMN public.reservations.status IS 'Reservation status: pending (for 7+ guests), confirmed, cancelled';
COMMENT ON COLUMN public.reservations.number_of_guests IS 'Number of guests (1-22, 7+ requires approval)';
