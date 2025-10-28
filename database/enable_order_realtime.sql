-- Enable Realtime for Order Tables
-- Run this in Supabase SQL Editor to enable realtime subscriptions for order history

-- 1. Add order tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS amenity_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS dine_in_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS shop_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS dine_in_order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS shop_order_items;

-- 2. Verify tables are in the publication
SELECT 
  schemaname, 
  tablename,
  'Realtime enabled' as status
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename IN (
  'amenity_requests',
  'dine_in_orders',
  'shop_orders',
  'dine_in_order_items',
  'shop_order_items'
)
ORDER BY tablename;

-- 3. Summary query - shows realtime status for all order tables
SELECT 
  t.tablename,
  CASE 
    WHEN p.tablename IS NOT NULL THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as realtime_status,
  (
    SELECT count(*) 
    FROM pg_policies pol 
    WHERE pol.tablename = t.tablename 
    AND pol.cmd = 'SELECT'
  ) as select_policies_count
FROM information_schema.tables t
LEFT JOIN pg_publication_tables p 
  ON p.tablename = t.tablename 
  AND p.pubname = 'supabase_realtime'
WHERE t.table_schema = 'public'
AND t.tablename IN (
  'amenity_requests',
  'dine_in_orders',
  'shop_orders',
  'dine_in_order_items',
  'shop_order_items'
)
ORDER BY t.tablename;
