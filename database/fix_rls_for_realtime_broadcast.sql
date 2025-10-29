-- ============================================================================
-- Fix RLS Policies to Allow Realtime Broadcasting
-- ============================================================================
-- Issue: Realtime subscriptions connect successfully, but RLS filters prevent
--        changes from being broadcast to clients.
-- Solution: Add policies that allow supabase_realtime_admin to SELECT data
--           for broadcasting while maintaining client-side RLS enforcement.
-- ============================================================================

-- ============================================================================
-- EMERGENCY CONTACTS
-- ============================================================================

-- Drop existing realtime policy if it exists, then recreate
DROP POLICY IF EXISTS "Realtime can broadcast emergency contacts" ON emergency_contacts;
CREATE POLICY "Realtime can broadcast emergency contacts"
ON emergency_contacts
FOR SELECT
TO supabase_realtime_admin
USING (true);

-- ============================================================================
-- HOTEL SETTINGS
-- ============================================================================

DROP POLICY IF EXISTS "Realtime can broadcast hotel settings" ON hotel_settings;
CREATE POLICY "Realtime can broadcast hotel settings"
ON hotel_settings
FOR SELECT
TO supabase_realtime_admin
USING (true);

-- ============================================================================
-- AMENITY REQUESTS
-- ============================================================================

DROP POLICY IF EXISTS "Realtime can broadcast amenity requests" ON amenity_requests;
CREATE POLICY "Realtime can broadcast amenity requests"
ON amenity_requests
FOR SELECT
TO supabase_realtime_admin
USING (true);

-- ============================================================================
-- DINE IN ORDERS
-- ============================================================================

DROP POLICY IF EXISTS "Realtime can broadcast dine in orders" ON dine_in_orders;
CREATE POLICY "Realtime can broadcast dine in orders"
ON dine_in_orders
FOR SELECT
TO supabase_realtime_admin
USING (true);

-- ============================================================================
-- SHOP ORDERS
-- ============================================================================

DROP POLICY IF EXISTS "Realtime can broadcast shop orders" ON shop_orders;
CREATE POLICY "Realtime can broadcast shop orders"
ON shop_orders
FOR SELECT
TO supabase_realtime_admin
USING (true);

-- ============================================================================
-- ORDER ITEMS (for completeness)
-- ============================================================================

DROP POLICY IF EXISTS "Realtime can broadcast dine in order items" ON dine_in_order_items;
CREATE POLICY "Realtime can broadcast dine in order items"
ON dine_in_order_items
FOR SELECT
TO supabase_realtime_admin
USING (true);

DROP POLICY IF EXISTS "Realtime can broadcast shop order items" ON shop_order_items;
CREATE POLICY "Realtime can broadcast shop order items"
ON shop_order_items
FOR SELECT
TO supabase_realtime_admin
USING (true);

-- ============================================================================
-- Verify Policies
-- ============================================================================

-- Check all policies for emergency_contacts
SELECT 
  tablename,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'emergency_contacts'
ORDER BY policyname;

-- Check all policies for hotel_settings
SELECT 
  tablename,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'hotel_settings'
ORDER BY policyname;

-- Check all policies for order tables
SELECT 
  tablename,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('amenity_requests', 'dine_in_orders', 'shop_orders')
ORDER BY tablename, policyname;

-- ============================================================================
-- Expected Result
-- ============================================================================
-- You should see policies for:
-- 1. authenticated users (your app users - hotel staff and guests)
-- 2. supabase_realtime_admin (for broadcasting)
--
-- How this works:
-- - supabase_realtime_admin can SELECT all rows (broadcasts everything)
-- - Your app still enforces RLS when clients query
-- - Clients receive broadcasts, but RLS filters what they can actually see
-- - This is the standard Supabase pattern for realtime with RLS
-- ============================================================================
