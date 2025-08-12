-- Add missing columns to reservations table
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';

-- Add index for invoice_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_reservations_invoice_number ON public.reservations (invoice_number);

-- Add comment for new columns
COMMENT ON COLUMN public.reservations.invoice_number IS 'Unique invoice number for reservation tracking';
COMMENT ON COLUMN public.reservations.language IS 'Language used for reservation (en, fr, nl)'; 