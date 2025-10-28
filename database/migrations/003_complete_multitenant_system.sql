-- Migration: Complete Third-Party Places Multi-Tenant System
-- Run this AFTER creating the base thirdparty_places table

-- Step 1: Add elvira_approved column to thirdparty_places
ALTER TABLE thirdparty_places 
ADD COLUMN IF NOT EXISTS elvira_approved BOOLEAN DEFAULT false;

-- Add indexes for elvira_approved
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_elvira_approved 
ON thirdparty_places(elvira_approved);

CREATE INDEX IF NOT EXISTS idx_thirdparty_places_category_approved 
ON thirdparty_places(category, elvira_approved);

-- Add comment
COMMENT ON COLUMN thirdparty_places.elvira_approved IS 'Indicates if this place has been approved by Elvira admin to be visible to hotels';

-- Step 2: Create hotel_thirdparty_places junction table
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

-- Step 3: Create indexes for hotel_thirdparty_places
CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_hotel_id 
ON hotel_thirdparty_places(hotel_id);

CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_place_id 
ON hotel_thirdparty_places(thirdparty_place_id);

CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_approved 
ON hotel_thirdparty_places(hotel_id, hotel_approved);

CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_recommended 
ON hotel_thirdparty_places(hotel_id, hotel_recommended);

CREATE INDEX IF NOT EXISTS idx_hotel_thirdparty_places_approved_recommended 
ON hotel_thirdparty_places(hotel_id, hotel_approved, hotel_recommended);

-- Step 4: Enable RLS for hotel_thirdparty_places
ALTER TABLE hotel_thirdparty_places ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies for hotel_thirdparty_places
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

-- Step 6: Create trigger for updated_at on hotel_thirdparty_places
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

-- Step 7: Add comments for hotel_thirdparty_places
COMMENT ON TABLE hotel_thirdparty_places IS 'Junction table linking hotels with third-party places, allowing each hotel to independently approve and recommend places';
COMMENT ON COLUMN hotel_thirdparty_places.hotel_approved IS 'Whether this specific hotel approves/wants to show this place to their guests';
COMMENT ON COLUMN hotel_thirdparty_places.hotel_recommended IS 'Whether this specific hotel recommends this place to their guests (shown with star)';
COMMENT ON COLUMN hotel_thirdparty_places.display_order IS 'Custom ordering number for how this hotel wants to display places';
COMMENT ON COLUMN hotel_thirdparty_places.custom_notes IS 'Hotel-specific notes or comments about this place';
