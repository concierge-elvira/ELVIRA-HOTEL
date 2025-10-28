-- Add fetched_by column to track who fetched the place
-- Add approved_by column to track who approved the place
-- This helps track which Elvira admin/staff member added and approved each place

-- Add the columns
ALTER TABLE thirdparty_places 
ADD COLUMN IF NOT EXISTS fetched_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_fetched_by 
ON thirdparty_places(fetched_by);

CREATE INDEX IF NOT EXISTS idx_thirdparty_places_approved_by 
ON thirdparty_places(approved_by);

-- Add comments
COMMENT ON COLUMN thirdparty_places.fetched_by IS 'User ID of the person who fetched/added this place from Google Places API';
COMMENT ON COLUMN thirdparty_places.approved_by IS 'User ID of the person who approved this place for hotels to see';

-- Update RLS policy to allow users to see who fetched and approved places
-- (The existing SELECT policy already allows this, no changes needed)
