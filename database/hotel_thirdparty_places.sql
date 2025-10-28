-- Hotel Third Party Places Junction Table
-- Links hotels with third-party places and stores hotel-specific approval/recommendation status
-- This allows each hotel to have independent opinions on places

CREATE TABLE IF NOT EXISTS hotel_thirdparty_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  thirdparty_place_id UUID NOT NULL REFERENCES thirdparty_places(id) ON DELETE CASCADE,
  
  -- Hotel-specific flags
  hotel_approved BOOLEAN DEFAULT false, -- Whether this hotel approves/wants to show this place
  hotel_recommended BOOLEAN DEFAULT false, -- Whether this hotel recommends this place to guests
  
  -- Display settings
  display_order INTEGER, -- Custom ordering for this hotel
  custom_notes TEXT, -- Hotel-specific notes about this place
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one relationship per hotel-place combination
  UNIQUE(hotel_id, thirdparty_place_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_hotel_id ON hotel_thirdparty_places(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_place_id ON hotel_thirdparty_places(thirdparty_place_id);
CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_approved ON hotel_thirdparty_places(hotel_id, hotel_approved);
CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_recommended ON hotel_thirdparty_places(hotel_id, hotel_recommended);
CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_approved_recommended ON hotel_thirdparty_places(hotel_id, hotel_approved, hotel_recommended);

-- Enable Row Level Security
ALTER TABLE hotel_thirdparty_places ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Hotels can only see their own relationships
CREATE POLICY "Hotels can view their own place relationships"
ON hotel_thirdparty_places
FOR SELECT
TO authenticated
USING (
  hotel_id IN (
    SELECT id FROM hotels WHERE owner_id = auth.uid()
  )
);

-- Hotels can create their own relationships
CREATE POLICY "Hotels can create their own place relationships"
ON hotel_thirdparty_places
FOR INSERT
TO authenticated
WITH CHECK (
  hotel_id IN (
    SELECT id FROM hotels WHERE owner_id = auth.uid()
  )
);

-- Hotels can update their own relationships
CREATE POLICY "Hotels can update their own place relationships"
ON hotel_thirdparty_places
FOR UPDATE
TO authenticated
USING (
  hotel_id IN (
    SELECT id FROM hotels WHERE owner_id = auth.uid()
  )
);

-- Hotels can delete their own relationships
CREATE POLICY "Hotels can delete their own place relationships"
ON hotel_thirdparty_places
FOR DELETE
TO authenticated
USING (
  hotel_id IN (
    SELECT id FROM hotels WHERE owner_id = auth.uid()
  )
);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hotel_thirdparty_places_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_hotel_thirdparty_places_updated_at
BEFORE UPDATE ON hotel_thirdparty_places
FOR EACH ROW
EXECUTE FUNCTION update_hotel_thirdparty_places_updated_at();

-- Comments
COMMENT ON TABLE hotel_thirdparty_places IS 'Junction table linking hotels with third-party places, allowing each hotel to independently approve and recommend places';
COMMENT ON COLUMN hotel_thirdparty_places.hotel_approved IS 'Whether this specific hotel approves/wants to show this place to their guests';
COMMENT ON COLUMN hotel_thirdparty_places.hotel_recommended IS 'Whether this specific hotel recommends this place to their guests (shown with star)';
COMMENT ON COLUMN hotel_thirdparty_places.display_order IS 'Custom ordering number for how this hotel wants to display places';
COMMENT ON COLUMN hotel_thirdparty_places.custom_notes IS 'Hotel-specific notes or comments about this place';
