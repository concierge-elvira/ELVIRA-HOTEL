-- Migration: Add hotel_thirdparty_places junction table
-- Run this in Supabase SQL Editor

-- Step 1: Create the junction table
CREATE TABLE IF NOT EXISTS hotel_thirdparty_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  thirdparty_place_id UUID NOT NULL REFERENCES thirdparty_places(id) ON DELETE CASCADE,
  
  -- Hotel-specific flags
  hotel_approved BOOLEAN DEFAULT false,
  hotel_recommended BOOLEAN DEFAULT false,
  
  -- Display settings
  display_order INTEGER,
  custom_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one relationship per hotel-place combination
  UNIQUE(hotel_id, thirdparty_place_id)
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_hotel_id ON hotel_thirdparty_places(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_place_id ON hotel_thirdparty_places(thirdparty_place_id);
CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_approved ON hotel_thirdparty_places(hotel_id, hotel_approved);
CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_recommended ON hotel_thirdparty_places(hotel_id, hotel_recommended);
CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_approved_recommended ON hotel_thirdparty_places(hotel_id, hotel_approved, hotel_recommended);

-- Step 3: Enable RLS
ALTER TABLE hotel_thirdparty_places ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies
CREATE POLICY "Hotels can view their own place relationships"
ON hotel_thirdparty_places
FOR SELECT
TO authenticated
USING (
  hotel_id IN (
    SELECT h.id FROM hotels h
    INNER JOIN hotel_staff hs ON hs.hotel_id = h.id
    WHERE hs.id = auth.uid() AND hs.status = 'active'
  )
);

CREATE POLICY "Hotels can create their own place relationships"
ON hotel_thirdparty_places
FOR INSERT
TO authenticated
WITH CHECK (
  hotel_id IN (
    SELECT h.id FROM hotels h
    INNER JOIN hotel_staff hs ON hs.hotel_id = h.id
    WHERE hs.id = auth.uid() AND hs.status = 'active'
  )
);

CREATE POLICY "Hotels can update their own place relationships"
ON hotel_thirdparty_places
FOR UPDATE
TO authenticated
USING (
  hotel_id IN (
    SELECT h.id FROM hotels h
    INNER JOIN hotel_staff hs ON hs.hotel_id = h.id
    WHERE hs.id = auth.uid() AND hs.status = 'active'
  )
);

CREATE POLICY "Hotels can delete their own place relationships"
ON hotel_thirdparty_places
FOR DELETE
TO authenticated
USING (
  hotel_id IN (
    SELECT h.id FROM hotels h
    INNER JOIN hotel_staff hs ON hs.hotel_id = h.id
    WHERE hs.id = auth.uid() AND hs.status = 'active'
  )
);

-- Step 5: Create trigger for updated_at
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

-- Step 6: Add comments
COMMENT ON TABLE hotel_thirdparty_places IS 'Junction table linking hotels with third-party places, allowing each hotel to independently approve and recommend places';
COMMENT ON COLUMN hotel_thirdparty_places.hotel_approved IS 'Whether this specific hotel approves/wants to show this place to their guests';
COMMENT ON COLUMN hotel_thirdparty_places.hotel_recommended IS 'Whether this specific hotel recommends this place to their guests (shown with star)';
