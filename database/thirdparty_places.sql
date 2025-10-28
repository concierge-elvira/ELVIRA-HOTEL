-- Third Party Places Table
-- Stores raw data fetched from Google Places API
-- This is a cache/storage table to avoid repeated API calls

CREATE TABLE IF NOT EXISTS thirdparty_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Google Places Data
  google_place_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  formatted_address TEXT,
  vicinity TEXT,
  
  -- Location
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Contact Information
  formatted_phone_number TEXT,
  international_phone_number TEXT,
  website TEXT,
  google_maps_url TEXT,
  
  -- Ratings & Reviews
  rating DECIMAL(2, 1),
  user_ratings_total INTEGER,
  price_level INTEGER, -- 0-4 scale
  
  -- Categories & Types
  types TEXT[], -- Array of Google place types
  category TEXT, -- Our categorization: gastronomy, tours, wellness, etc.
  
  -- Business Info
  business_status TEXT, -- OPERATIONAL, CLOSED_TEMPORARILY, CLOSED_PERMANENTLY
  opening_hours JSONB, -- Store opening hours as JSON
  
  -- Media
  photo_reference TEXT, -- Primary photo reference
  photos JSONB, -- All photos as JSON array
  
  -- Reviews (optional, can be large)
  reviews JSONB, -- Store reviews as JSON
  
  -- API Metadata
  last_fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  api_response JSONB, -- Store full API response for reference
  
  -- Elvira Approval
  elvira_approved BOOLEAN DEFAULT false, -- Whether Elvira has approved this place for hotels to see
  
  -- User Tracking
  fetched_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- User who fetched/added this place
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- User who approved this place
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_google_id ON thirdparty_places(google_place_id);
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_category ON thirdparty_places(category);
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_location ON thirdparty_places(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_rating ON thirdparty_places(rating);
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_types ON thirdparty_places USING GIN(types);
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_elvira_approved ON thirdparty_places(elvira_approved);
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_category_approved ON thirdparty_places(category, elvira_approved);
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_fetched_by ON thirdparty_places(fetched_by);
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_approved_by ON thirdparty_places(approved_by);

-- Enable Row Level Security
ALTER TABLE thirdparty_places ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to authenticated users"
ON thirdparty_places
FOR SELECT
TO authenticated
USING (true);

-- Allow insert/update to authenticated users (for API fetching)
CREATE POLICY "Allow insert to authenticated users"
ON thirdparty_places
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update to authenticated users"
ON thirdparty_places
FOR UPDATE
TO authenticated
USING (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_thirdparty_places_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_thirdparty_places_updated_at
BEFORE UPDATE ON thirdparty_places
FOR EACH ROW
EXECUTE FUNCTION update_thirdparty_places_updated_at();

-- Comments
COMMENT ON TABLE thirdparty_places IS 'Stores raw data from Google Places API to avoid repeated API calls';
COMMENT ON COLUMN thirdparty_places.google_place_id IS 'Unique identifier from Google Places';
COMMENT ON COLUMN thirdparty_places.category IS 'Our categorization: gastronomy, tours, wellness, shopping, entertainment, etc.';
COMMENT ON COLUMN thirdparty_places.last_fetched_at IS 'Last time data was fetched from Google Places API';
COMMENT ON COLUMN thirdparty_places.api_response IS 'Full API response for debugging and future reference';
COMMENT ON COLUMN thirdparty_places.elvira_approved IS 'Indicates if this place has been approved by Elvira admin to be visible to hotels';
COMMENT ON COLUMN thirdparty_places.fetched_by IS 'User ID of the person who fetched/added this place from Google Places API';
COMMENT ON COLUMN thirdparty_places.approved_by IS 'User ID of the person who approved this place for hotels to see';
