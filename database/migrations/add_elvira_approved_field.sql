-- Migration: Add elvira_approved column to thirdparty_places table
-- Description: Adds a boolean field to control which places are visible to hotels
-- Date: 2025-10-22

-- Add the elvira_approved column with default value false
ALTER TABLE thirdparty_places 
ADD COLUMN IF NOT EXISTS elvira_approved BOOLEAN DEFAULT false;

-- Create index for performance on elvira_approved queries
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_elvira_approved 
ON thirdparty_places(elvira_approved);

-- Create composite index for category + elvira_approved queries (common use case)
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_category_approved 
ON thirdparty_places(category, elvira_approved);

-- Update the comment on the table
COMMENT ON COLUMN thirdparty_places.elvira_approved IS 'Indicates if this place has been approved by Elvira admin to be visible to hotels';

-- Optional: Set initial approval status
-- Uncomment ONE of the following options based on your requirements:

-- Option 1: Approve all existing places (recommended for initial setup)
-- UPDATE thirdparty_places SET elvira_approved = true;

-- Option 2: Keep all unapproved (requires manual approval)
-- UPDATE thirdparty_places SET elvira_approved = false;

-- Option 3: Approve based on rating (example: 4+ stars and operational)
-- UPDATE thirdparty_places 
-- SET elvira_approved = true 
-- WHERE rating >= 4.0 AND business_status = 'OPERATIONAL';

-- Option 4: Approve based on rating threshold and minimum reviews
-- UPDATE thirdparty_places 
-- SET elvira_approved = true 
-- WHERE rating >= 4.0 
--   AND user_ratings_total >= 10 
--   AND business_status = 'OPERATIONAL';

-- Verify the migration
SELECT 
  COUNT(*) as total_places,
  COUNT(*) FILTER (WHERE elvira_approved = true) as approved_places,
  COUNT(*) FILTER (WHERE elvira_approved = false) as pending_places
FROM thirdparty_places;

-- Show places by category and approval status
SELECT 
  category,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE elvira_approved = true) as approved,
  COUNT(*) FILTER (WHERE elvira_approved = false) as pending
FROM thirdparty_places
GROUP BY category
ORDER BY category;
