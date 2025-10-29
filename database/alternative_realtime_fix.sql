-- ============================================================================
-- Alternative Fix: Make RLS Policies Realtime-Compatible
-- ============================================================================
-- Instead of creating policies for supabase_realtime_admin, we'll ensure
-- existing policies don't block realtime by using REPLICA IDENTITY and
-- proper grants.
-- ============================================================================

-- ============================================================================
-- Step 1: Ensure tables have REPLICA IDENTITY FULL
-- ============================================================================
-- This tells PostgreSQL to include all column data in the replication stream

ALTER TABLE emergency_contacts REPLICA IDENTITY FULL;
ALTER TABLE hotel_settings REPLICA IDENTITY FULL;
ALTER TABLE amenity_requests REPLICA IDENTITY FULL;
ALTER TABLE dine_in_orders REPLICA IDENTITY FULL;
ALTER TABLE shop_orders REPLICA IDENTITY FULL;
ALTER TABLE dine_in_order_items REPLICA IDENTITY FULL;
ALTER TABLE shop_order_items REPLICA IDENTITY FULL;

-- ============================================================================
-- Step 2: Grant necessary permissions to authenticated role
-- ============================================================================
-- Ensure authenticated users can receive realtime broadcasts

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- ============================================================================
-- Step 3: Verify Replica Identity
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  CASE relreplident
    WHEN 'd' THEN 'DEFAULT'
    WHEN 'n' THEN 'NOTHING'
    WHEN 'f' THEN 'FULL'
    WHEN 'i' THEN 'INDEX'
  END as replica_identity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_tables t ON t.tablename = c.relname AND t.schemaname = n.nspname
WHERE schemaname = 'public'
AND tablename IN (
  'emergency_contacts',
  'hotel_settings',
  'amenity_requests',
  'dine_in_orders',
  'shop_orders',
  'dine_in_order_items',
  'shop_order_items'
)
ORDER BY tablename;

-- ============================================================================
-- Expected Output
-- ============================================================================
-- All tables should show replica_identity = 'FULL'
-- This allows realtime to broadcast complete row data
-- ============================================================================

-- ============================================================================
-- Step 4: Check if realtime is properly configured
-- ============================================================================

-- Verify tables are in realtime publication
SELECT 
  schemaname, 
  tablename
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename IN (
  'emergency_contacts',
  'hotel_settings',
  'amenity_requests',
  'dine_in_orders',
  'shop_orders'
)
ORDER BY tablename;

-- ============================================================================
-- If the above approach doesn't work, the issue is that your client-side
-- RLS policies are filtering out the changes. The solution is to ensure
-- your guest JWT includes the correct hotel_id claim.
-- ============================================================================
