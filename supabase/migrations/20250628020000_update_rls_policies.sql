-- Update Row-Level Security policies for reservations table
-- This migration replaces the existing RLS policies with the new requirements

-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can create reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can update own reservations" ON public.reservations;

-- Ensure RLS is enabled (already done in previous migration, but keeping for clarity)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Customers can CRUD their own rows
CREATE POLICY "customer access"
ON public.reservations
FOR ALL
USING (auth.email() = email)
WITH CHECK (auth.email() = email);

-- Policy 2: Public insert if email provided (no auth) - for anonymous bookings
CREATE POLICY "public insert"
ON public.reservations
FOR INSERT
WITH CHECK (true);

-- Policy 3: Staff can manage everything
-- This policy allows service role or users with admin role to manage all reservations
CREATE POLICY "staff management"
ON public.reservations
FOR ALL
USING (
  auth.role() = 'service_role' OR 
  (auth.jwt() ->> 'role') = 'admin'
)
WITH CHECK (
  auth.role() = 'service_role' OR 
  (auth.jwt() ->> 'role') = 'admin'
);

-- Add comments explaining the policies
COMMENT ON POLICY "customer access" ON public.reservations IS 'Allows authenticated customers to CRUD their own reservations based on email match';
COMMENT ON POLICY "public insert" ON public.reservations IS 'Allows anonymous users to create reservations without authentication';
COMMENT ON POLICY "staff management" ON public.reservations IS 'Allows service role and admin users to manage all reservations';
