-- ============================================================================
-- Fix RLS Policies for Realtime Subscriptions
-- ============================================================================
-- This script ensures RLS policies don't block realtime subscriptions
-- while maintaining proper security for data access
--
-- ISSUE: Realtime subscriptions require SELECT permissions that RLS might block
-- SOLUTION: Add explicit realtime-friendly policies or use postgres roles
-- ============================================================================

-- ============================================================================
-- OPTION 1: Grant Realtime User Permissions (Required for Realtime with RLS)
-- ============================================================================
-- This grants the realtime user (supabase_realtime_admin) permission to bypass
-- RLS for broadcasting purposes. Your app still enforces RLS when querying data.

-- Grant realtime access to tables - this allows realtime to see changes
GRANT SELECT ON emergency_contacts TO supabase_realtime_admin;
GRANT SELECT ON hotel_settings TO supabase_realtime_admin;
GRANT SELECT ON amenity_requests TO supabase_realtime_admin;
GRANT SELECT ON dine_in_orders TO supabase_realtime_admin;
GRANT SELECT ON shop_orders TO supabase_realtime_admin;
GRANT SELECT ON dine_in_order_items TO supabase_realtime_admin;
GRANT SELECT ON shop_order_items TO supabase_realtime_admin;

-- Allow realtime to bypass RLS (broadcasts all changes, but clients still have RLS)
ALTER TABLE emergency_contacts REPLICA IDENTITY FULL;
ALTER TABLE hotel_settings REPLICA IDENTITY FULL;
ALTER TABLE amenity_requests REPLICA IDENTITY FULL;
ALTER TABLE dine_in_orders REPLICA IDENTITY FULL;
ALTER TABLE shop_orders REPLICA IDENTITY FULL;
ALTER TABLE dine_in_order_items REPLICA IDENTITY FULL;
ALTER TABLE shop_order_items REPLICA IDENTITY FULL;

-- ============================================================================
-- OPTION 2: Ensure RLS Policies Allow Realtime Subscriptions
-- ============================================================================
-- Update policies to explicitly work with realtime by ensuring they don't
-- block the supabase_realtime_admin role

-- For emergency_contacts: Ensure realtime can broadcast
-- Keep existing policies but ensure table has proper replica identity
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- For hotel_settings: Ensure realtime can broadcast
ALTER TABLE hotel_settings ENABLE ROW LEVEL SECURITY;

-- For order tables: Ensure realtime can broadcast
ALTER TABLE amenity_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE dine_in_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_orders ENABLE ROW LEVEL SECURITY;

-- Grant usage on schema to realtime admin
GRANT USAGE ON SCHEMA public TO supabase_realtime_admin;

-- Grant SELECT on all sequences (needed for realtime)
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO supabase_realtime_admin;

-- ============================================================================
-- OPTION 3: Create Realtime Bypass Policies (If Above Options Don't Work)
-- ============================================================================
-- This creates a special policy that allows realtime to see all changes
-- while still enforcing RLS on your application's queries

-- Only uncomment and run these if Options 1 & 2 don't work:

/*
-- Create a function to check if the current role is realtime admin
CREATE OR REPLACE FUNCTION is_realtime_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_user = 'supabase_realtime_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies that bypass RLS for realtime admin
CREATE POLICY "Realtime admin bypass"
ON emergency_contacts FOR SELECT
TO supabase_realtime_admin
USING (true);

CREATE POLICY "Realtime admin bypass"
ON hotel_settings FOR SELECT
TO supabase_realtime_admin
USING (true);

CREATE POLICY "Realtime admin bypass"
ON amenity_requests FOR SELECT
TO supabase_realtime_admin
USING (true);

CREATE POLICY "Realtime admin bypass"
ON dine_in_orders FOR SELECT
TO supabase_realtime_admin
USING (true);

CREATE POLICY "Realtime admin bypass"
ON shop_orders FOR SELECT
TO supabase_realtime_admin
USING (true);
*/

-- ============================================================================
-- Verify Realtime Permissions
-- ============================================================================

-- Check table permissions for realtime user
SELECT 
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE grantee = 'supabase_realtime_admin'
AND table_name IN (
  'emergency_contacts',
  'hotel_settings',
  'amenity_requests',
  'dine_in_orders',
  'shop_orders',
  'dine_in_order_items',
  'shop_order_items'
)
ORDER BY table_name, privilege_type;

-- Check RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled,
  (
    SELECT count(*) 
    FROM pg_policies 
    WHERE pg_policies.tablename = c.tablename 
    AND cmd = 'SELECT'
  ) as select_policies
FROM pg_tables c
WHERE schemaname = 'public'
AND tablename IN (
  'emergency_contacts',
  'hotel_settings',
  'amenity_requests',
  'dine_in_orders',
  'shop_orders'
)
ORDER BY tablename;

-- List all SELECT policies for these tables
SELECT 
  tablename,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN (
  'emergency_contacts',
  'hotel_settings',
  'amenity_requests',
  'dine_in_orders',
  'shop_orders'
)
AND cmd = 'SELECT'
ORDER BY tablename, policyname;

-- ============================================================================
-- Expected Output
-- ============================================================================
-- After running this script, you should see:
-- 1. supabase_realtime_admin has SELECT on all tables
-- 2. RLS is enabled (true) for all tables
-- 3. Each table has at least 1 SELECT policy
-- 4. Policies include both 'authenticated' and 'anon' roles where needed
-- ============================================================================

-- ============================================================================
-- Testing Realtime After Fix
-- ============================================================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Refresh your application (hard refresh: Ctrl+Shift+R)
-- 3. Check browser console - errors should be replaced with success messages:
--    [Realtime] ✅ emergency_contacts connected
--    [Realtime] ✅ hotel_settings connected
-- 4. Make a change to test (e.g., update emergency contact)
-- 5. Should see: [Realtime] 🔔 emergency_contacts UPDATE
-- ============================================================================
