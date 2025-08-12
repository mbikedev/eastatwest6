-- Migration to add EXCLUDE constraint for preventing overlapping reservations
-- This is optional and can be applied if strict non-overlap is required

-- First, let's add the btree_gist extension which is needed for EXCLUDE constraints with time ranges
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Add a comment explaining the constraint options
COMMENT ON TABLE public.reservations IS 'Store restaurant reservations for East at West. 
To enable strict non-overlap constraint, uncomment the ALTER TABLE statement below.';

-- OPTIONAL: Uncomment the following lines to enforce strict non-overlap constraint
-- This will prevent any overlapping reservations on the same date
-- WARNING: This will fail if there are existing overlapping reservations in the database

/*
-- Add EXCLUDE constraint to prevent overlapping reservations on the same date
ALTER TABLE public.reservations 
ADD CONSTRAINT no_overlapping_reservations 
EXCLUDE USING gist (
  reservation_date WITH =,
  tsrange(
    (reservation_date || ' ' || start_time)::timestamp,
    (reservation_date || ' ' || end_time)::timestamp,
    '[)'
  ) WITH &&
) 
WHERE (status != 'cancelled');
*/

-- Alternative approach: Add a unique constraint helper function for simpler overlap detection
-- This function can be used in application logic or triggers

CREATE OR REPLACE FUNCTION check_reservation_overlap(
  p_reservation_date DATE,
  p_start_time TIME,
  p_end_time TIME,
  p_exclude_id UUID DEFAULT NULL
) RETURNS TABLE(
  id UUID,
  name VARCHAR(255),
  email VARCHAR(255),
  reservation_date DATE,
  start_time TIME,
  end_time TIME,
  number_of_guests INTEGER,
  status VARCHAR(50)
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.email,
    r.reservation_date,
    r.start_time,
    r.end_time,
    r.number_of_guests,
    r.status
  FROM public.reservations r
  WHERE 
    r.reservation_date = p_reservation_date
    AND r.status != 'cancelled'
    AND (p_exclude_id IS NULL OR r.id != p_exclude_id)
    AND (
      -- Check for time overlap: two ranges overlap if start1 < end2 AND start2 < end1
      (p_start_time < r.end_time AND r.start_time < p_end_time)
    );
END;
$$;

-- Add comment to the function
COMMENT ON FUNCTION check_reservation_overlap IS 'Helper function to detect overlapping reservations for a given date and time range. Used by the admin dashboard for conflict detection.';

-- Create an index to optimize the overlap detection queries
CREATE INDEX IF NOT EXISTS idx_reservations_date_time_status 
ON public.reservations (reservation_date, start_time, end_time, status)
WHERE status != 'cancelled';

-- Add a view for easy conflict detection queries
CREATE OR REPLACE VIEW reservation_conflicts AS
SELECT 
  r1.id as reservation_id,
  r1.name,
  r1.email,
  r1.reservation_date,
  r1.start_time,
  r1.end_time,
  r1.status,
  COUNT(r2.id) as conflict_count,
  STRING_AGG(r2.name || ' (' || r2.start_time || '-' || r2.end_time || ')', ', ') as conflicting_with
FROM public.reservations r1
LEFT JOIN public.reservations r2 ON (
  r1.id != r2.id
  AND r1.reservation_date = r2.reservation_date
  AND r1.status != 'cancelled'
  AND r2.status != 'cancelled'
  AND r1.start_time < r2.end_time
  AND r2.start_time < r1.end_time
)
GROUP BY r1.id, r1.name, r1.email, r1.reservation_date, r1.start_time, r1.end_time, r1.status
ORDER BY r1.reservation_date, r1.start_time;

-- Add comment to the view
COMMENT ON VIEW reservation_conflicts IS 'View showing all reservations with their conflict count and details of conflicting reservations.';
