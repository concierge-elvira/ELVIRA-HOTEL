-- RLS Policies for emergency_contacts table
-- Allows hotel staff to manage emergency contacts and guests to view them

-- Enable RLS
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Hotel staff can view emergency contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Hotel staff can insert emergency contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Hotel staff can update emergency contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Hotel staff can delete emergency contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Guests can view emergency contacts for their hotel" ON emergency_contacts;

-- Policy 1: Hotel Admin can view all emergency contacts for their hotel
CREATE POLICY "Hotel staff can view emergency contacts"
ON emergency_contacts
FOR SELECT
USING (
  hotel_id IN (
    SELECT hotel_id 
    FROM hotel_staff 
    WHERE id = auth.uid() 
    AND status = 'active'
  )
);

-- Policy 2: Hotel Admin and Managers can insert emergency contacts
CREATE POLICY "Hotel staff can insert emergency contacts"
ON emergency_contacts
FOR INSERT
WITH CHECK (
  hotel_id IN (
    SELECT hotel_id 
    FROM hotel_staff 
    WHERE id = auth.uid() 
    AND status = 'active'
    AND (
      position = 'Hotel Admin'
      OR (position = 'Manager' AND department IS NOT NULL)
    )
  )
);

-- Policy 3: Hotel Admin and Managers can update emergency contacts
CREATE POLICY "Hotel staff can update emergency contacts"
ON emergency_contacts
FOR UPDATE
USING (
  hotel_id IN (
    SELECT hotel_id 
    FROM hotel_staff 
    WHERE id = auth.uid() 
    AND status = 'active'
    AND (
      position = 'Hotel Admin'
      OR (position = 'Manager' AND department IS NOT NULL)
    )
  )
);

-- Policy 4: Hotel Admin and Managers can delete emergency contacts
CREATE POLICY "Hotel staff can delete emergency contacts"
ON emergency_contacts
FOR DELETE
USING (
  hotel_id IN (
    SELECT hotel_id 
    FROM hotel_staff 
    WHERE id = auth.uid() 
    AND status = 'active'
    AND (
      position = 'Hotel Admin'
      OR (position = 'Manager' AND department IS NOT NULL)
    )
  )
);

-- Policy 5: Guests can view active emergency contacts for their hotel
-- This policy uses JWT claim 'user_role' = 'guest' and 'hotel_id' from the JWT
CREATE POLICY "Guests can view emergency contacts for their hotel"
ON emergency_contacts
FOR SELECT
USING (
  -- Check if the user is a guest via JWT claim
  (auth.jwt() -> 'user_role')::text = '"guest"'
  AND hotel_id = (auth.jwt() -> 'hotel_id')::text::uuid
  AND is_active = true
);

-- Grant necessary permissions
GRANT SELECT ON emergency_contacts TO authenticated;
GRANT SELECT ON emergency_contacts TO anon;
GRANT INSERT, UPDATE, DELETE ON emergency_contacts TO authenticated;
