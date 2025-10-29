-- RLS Policy for amenity_requests UPDATE
-- Allows guests to update their own amenity requests
-- Only allows changing status from 'pending' to 'cancelled'

-- Drop existing UPDATE policy if it exists
DROP POLICY IF EXISTS "Guests can cancel their pending amenity requests" ON amenity_requests;

-- Create UPDATE policy
CREATE POLICY "Guests can cancel their pending amenity requests"
ON amenity_requests
FOR UPDATE
TO authenticated
USING (
  -- Can only update their own requests
  guest_id = auth.uid()
  AND
  -- Only if current status is pending
  status = 'pending'
  AND
  -- Verify user is a guest
  (auth.jwt() ->> 'user_role') = 'guest'
)
WITH CHECK (
  -- Can only update their own requests
  guest_id = auth.uid()
  AND
  -- Can only change to cancelled status
  status = 'cancelled'
  AND
  -- Verify user is a guest
  (auth.jwt() ->> 'user_role') = 'guest'
);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'amenity_requests' 
  AND policyname = 'Guests can cancel their pending amenity requests';
