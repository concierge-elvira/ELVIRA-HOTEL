-- ============================================================================
-- Fix All Realtime Subscription Errors
-- ============================================================================
-- This script enables realtime for all tables causing "channel error - undefined"
-- Run this in your Supabase SQL Editor to fix the errors
-- ============================================================================

-- ============================================================================
-- STEP 1: Add all required tables to realtime publication
-- ============================================================================

-- Guest-facing tables (settings, emergency contacts, etc.)
ALTER PUBLICATION supabase_realtime ADD TABLE hotel_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE emergency_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE amenities;
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE hotel_thirdparty_places;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE thirdparty_places;
ALTER PUBLICATION supabase_realtime ADD TABLE guests;

-- Order and request tables
ALTER PUBLICATION supabase_realtime ADD TABLE amenity_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE dine_in_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE shop_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE dine_in_order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE shop_order_items;

-- ============================================================================
-- STEP 2: Verify all tables are in the publication
-- ============================================================================

SELECT 
  schemaname, 
  tablename,
  '✅ Realtime enabled' as status
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename IN (
  -- Guest-facing tables
  'hotel_settings',
  'emergency_contacts',
  'amenities',
  'menu_items',
  'products',
  'hotel_thirdparty_places',
  'announcements',
  'thirdparty_places',
  'guests',
  -- Order and request tables
  'amenity_requests',
  'dine_in_orders',
  'shop_orders',
  'dine_in_order_items',
  'shop_order_items'
)
ORDER BY tablename;

-- ============================================================================
-- STEP 3: Check RLS policies for guest SELECT access
-- ============================================================================
-- Realtime requires SELECT permissions through RLS policies

SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename IN (
  'hotel_settings',
  'emergency_contacts',
  'amenity_requests',
  'dine_in_orders',
  'shop_orders'
)
AND cmd = 'SELECT'
ORDER BY tablename, policyname;

-- ============================================================================
-- STEP 4: Create missing RLS policies (if needed)
-- ============================================================================
-- These policies allow guests to SELECT their own data
-- Uncomment and modify as needed for your authentication setup

-- Hotel Settings - Allow guests to view hotel settings
-- CREATE POLICY IF NOT EXISTS "Guests can view hotel settings"
-- ON hotel_settings FOR SELECT
-- TO authenticated, anon
-- USING (true);

-- Emergency Contacts - Allow guests to view active emergency contacts
-- CREATE POLICY IF NOT EXISTS "Guests can view active emergency contacts"
-- ON emergency_contacts FOR SELECT
-- TO authenticated, anon
-- USING (is_active = true);

-- Amenity Requests - Allow guests to view their own requests
-- CREATE POLICY IF NOT EXISTS "Guests can view their own amenity requests"
-- ON amenity_requests FOR SELECT
-- TO authenticated
-- USING (guest_id = auth.uid());

-- Dine-In Orders - Allow guests to view their own orders
-- CREATE POLICY IF NOT EXISTS "Guests can view their own dine-in orders"
-- ON dine_in_orders FOR SELECT
-- TO authenticated
-- USING (guest_id = auth.uid());

-- Shop Orders - Allow guests to view their own orders
-- CREATE POLICY IF NOT EXISTS "Guests can view their own shop orders"
-- ON shop_orders FOR SELECT
-- TO authenticated
-- USING (guest_id = auth.uid());

-- ============================================================================
-- STEP 5: Final summary - show status for all tables
-- ============================================================================

SELECT 
  t.tablename,
  CASE 
    WHEN p.tablename IS NOT NULL THEN '✅ Realtime Enabled'
    ELSE '❌ Realtime Disabled'
  END as realtime_status,
  (
    SELECT count(*) 
    FROM pg_policies pol 
    WHERE pol.tablename = t.tablename 
    AND pol.cmd = 'SELECT'
  ) as select_policies_count,
  CASE 
    WHEN (SELECT count(*) FROM pg_policies pol WHERE pol.tablename = t.tablename AND pol.cmd = 'SELECT') > 0
    THEN '✅ Has SELECT policies'
    ELSE '⚠️  No SELECT policies'
  END as rls_status
FROM information_schema.tables t
LEFT JOIN pg_publication_tables p 
  ON p.tablename = t.tablename 
  AND p.pubname = 'supabase_realtime'
WHERE t.table_schema = 'public'
AND t.tablename IN (
  'hotel_settings',
  'emergency_contacts',
  'amenity_requests',
  'dine_in_orders',
  'shop_orders',
  'amenities',
  'menu_items',
  'products',
  'hotel_thirdparty_places',
  'announcements',
  'thirdparty_places',
  'guests',
  'dine_in_order_items',
  'shop_order_items'
)
ORDER BY 
  CASE 
    WHEN p.tablename IS NULL THEN 0
    ELSE 1
  END,
  t.tablename;

-- ============================================================================
-- Expected Output:
-- ============================================================================
-- All tables should show:
--   ✅ Realtime Enabled
--   ✅ Has SELECT policies
--
-- If any table shows ❌ or ⚠️, review the RLS policies for that table
-- ============================================================================
