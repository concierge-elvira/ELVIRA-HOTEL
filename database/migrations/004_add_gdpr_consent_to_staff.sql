-- Migration: Add GDPR consent column to hotel_staff_personal_data table
-- This column tracks whether the hotel has accepted responsibility for processing staff personal data

-- Add gdpr_consent column
ALTER TABLE public.hotel_staff_personal_data
ADD COLUMN IF NOT EXISTS gdpr_consent boolean DEFAULT false;

-- Add comment to explain the column
COMMENT ON COLUMN public.hotel_staff_personal_data.gdpr_consent IS 'Indicates whether the hotel has accepted responsibility for processing this staff member''s personal data in accordance with GDPR regulations';

-- Optional: Create an index if you plan to query by gdpr_consent frequently
CREATE INDEX IF NOT EXISTS idx_hotel_staff_personal_data_gdpr_consent
ON public.hotel_staff_personal_data (gdpr_consent);
