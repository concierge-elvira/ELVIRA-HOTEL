-- ============================================================================
-- RLS Policy for Guests Table - Allow Guests to View Their Own Data
-- ============================================================================
-- This policy allows authenticated guests to view only their own record
-- from the guests table using their JWT token.
-- ============================================================================

-- Enable RLS on guests table if not already enabled
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Drop existing guest policies if they exist
-- ============================================================================
DROP POLICY IF EXISTS "Guests can view their own data" ON guests;
DROP POLICY IF EXISTS "Guests can update their own data" ON guests;
DROP POLICY IF EXISTS "Hotel staff can view all guests" ON guests;
DROP POLICY IF EXISTS "Hotel staff can manage guests" ON guests;

-- ============================================================================
-- Policy 1: Guests can view and update their own data
-- ============================================================================
-- Allows guests to SELECT and UPDATE only their own record using their JWT
CREATE POLICY "Guests can view their own data"
ON guests
FOR SELECT
TO authenticated
USING (
  -- Check if user is a guest via JWT claim and can see their own data
  (((auth.jwt() ->> 'user_role'::text) = 'guest'::text) AND (id = auth.uid()))
);

CREATE POLICY "Guests can update their own data"
ON guests
FOR UPDATE
TO authenticated
USING (
  -- Check if user is a guest via JWT claim and can update their own data
  (((auth.jwt() ->> 'user_role'::text) = 'guest'::text) AND (id = auth.uid()))
)
WITH CHECK (
  -- Ensure they're still updating their own record
  (((auth.jwt() ->> 'user_role'::text) = 'guest'::text) AND (id = auth.uid()))
);

-- ============================================================================
-- Policy 2: Hotel staff can view all guests for their hotel
-- ============================================================================
CREATE POLICY "Hotel staff can view all guests"
ON guests
FOR SELECT
TO authenticated
USING (
  hotel_id IN (
    SELECT hotel_id 
    FROM hotel_staff 
    WHERE id = auth.uid() 
    AND status = 'active'
  )
);

-- ============================================================================
-- Policy 3: Hotel staff can manage guests (INSERT, UPDATE, DELETE)
-- ============================================================================
CREATE POLICY "Hotel staff can manage guests"
ON guests
FOR ALL
TO authenticated
USING (
  hotel_id IN (
    SELECT hotel_id 
    FROM hotel_staff 
    WHERE id = auth.uid() 
    AND status = 'active'
    AND (
      position = 'Hotel Admin'
      OR (position = 'Hotel Staff' AND department = 'Reception')
    )
  )
)
WITH CHECK (
  hotel_id IN (
    SELECT hotel_id 
    FROM hotel_staff 
    WHERE id = auth.uid() 
    AND status = 'active'
    AND (
      position = 'Hotel Admin'
      OR (position = 'Hotel Staff' AND department = 'Reception')
    )
  )
);

-- ============================================================================
-- Grant necessary permissions
-- ============================================================================
GRANT SELECT ON guests TO authenticated;
GRANT INSERT, UPDATE, DELETE ON guests TO authenticated;

-- ============================================================================
-- Verify Policies
-- ============================================================================
SELECT 
  tablename,
  policyname,
  cmd,
  roles,
  CASE 
    WHEN policyname LIKE '%Guests can%' THEN '👤 Guest Policy'
    WHEN policyname LIKE '%Hotel staff%' THEN '👔 Staff Policy'
    WHEN policyname LIKE '%realtime%' THEN '🔔 Realtime Policy'
    ELSE '🔒 Other Policy'
  END as policy_type
FROM pg_policies
WHERE tablename = 'guests'
ORDER BY policyname;

-- ============================================================================
-- Expected Result
-- ============================================================================
-- You should see 5 policies:
-- 1. "Enable realtime for guests" - FOR SELECT (allows realtime broadcasting)
-- 2. "Guests can view their own data" - FOR SELECT (allows guests to see their record)
-- 3. "Guests can update their own data" - FOR UPDATE (allows guests to update their record)
-- 4. "Hotel staff can view all guests" - FOR SELECT (allows staff to see all guests)
-- 5. "Hotel staff can manage guests" - FOR ALL (allows staff to manage guests)
-- ============================================================================

-- ============================================================================
-- Testing
-- ============================================================================
-- As a guest:
-- SELECT * FROM guests WHERE id = auth.uid();
-- Should return only their own record
--
-- As hotel staff:
-- SELECT * FROM guests WHERE hotel_id = 'your-hotel-id';
-- Should return all guests for their hotel
-- ============================================================================
