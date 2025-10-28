-- RLS Policy for hotel_settings table
-- Allows Hotel Admin, Manager, Hotel Staff, and Reception to perform all operations
-- Also allows authenticated guests to view settings for their hotel

-- Enable RLS on hotel_settings
ALTER TABLE hotel_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Hotel staff can manage hotel settings" ON hotel_settings;
DROP POLICY IF EXISTS "Guests can view hotel settings for their hotel" ON hotel_settings;

-- Policy 1: Hotel staff (Admin, Manager, Staff, Reception) can perform all operations
CREATE POLICY "Hotel staff can manage hotel settings"
ON hotel_settings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM hotel_staff
    WHERE hotel_staff.id = auth.uid()
    AND hotel_staff.hotel_id = hotel_settings.hotel_id
    AND (
      hotel_staff.position = 'Hotel Admin'
      OR hotel_staff.department = 'Manager'
      OR (hotel_staff.position = 'Hotel Staff' AND hotel_staff.department = 'Reception')
    )
    AND hotel_staff.status = 'active'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM hotel_staff
    WHERE hotel_staff.id = auth.uid()
    AND hotel_staff.hotel_id = hotel_settings.hotel_id
    AND (
      hotel_staff.position = 'Hotel Admin'
      OR hotel_staff.department = 'Manager'
      OR (hotel_staff.position = 'Hotel Staff' AND hotel_staff.department = 'Reception')
    )
    AND hotel_staff.status = 'active'
  )
);

-- Policy 2: Guests can view hotel settings for their hotel (SELECT only)
CREATE POLICY "Guests can view hotel settings for their hotel"
ON hotel_settings
FOR SELECT
TO authenticated
USING (
  ((auth.jwt() ->> 'user_role'::text) = 'guest'::text) 
  AND 
  (hotel_id = ((auth.jwt() ->> 'hotel_id'::text)::uuid))
);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON hotel_settings TO authenticated;
