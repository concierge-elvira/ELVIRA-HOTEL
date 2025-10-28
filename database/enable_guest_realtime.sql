-- Enable Realtime for Guest-Facing Tables
-- Run this in Supabase SQL Editor to enable realtime subscriptions

-- 1. Add tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS amenities;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS products;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS hotel_thirdparty_places;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS thirdparty_places;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS hotel_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS emergency_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS guests;

-- 2. Verify tables are in the publication
SELECT 
  schemaname, 
  tablename,
  'Realtime enabled' as status
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename IN (
  'amenities', 
  'menu_items', 
  'products', 
  'hotel_thirdparty_places', 
  'announcements',
  'thirdparty_places',
  'hotel_settings',
  'emergency_contacts',
  'guests'
)
ORDER BY tablename;

-- 3. Check RLS policies for guest access
-- These queries help identify if guests can SELECT (required for realtime)

-- Check amenities policies
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'amenities'
AND cmd = 'SELECT';

-- Check menu_items policies
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'menu_items'
AND cmd = 'SELECT';

-- Check products policies  
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'products'
AND cmd = 'SELECT';

-- Check hotel_thirdparty_places policies
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'hotel_thirdparty_places'
AND cmd = 'SELECT';

-- 4. If SELECT policies are missing, create them
-- (Adjust based on your authentication setup)

-- Example: Allow guests to view active amenities for their hotel
CREATE POLICY IF NOT EXISTS "Guests can view active amenities" 
ON amenities FOR SELECT
TO authenticated, anon
USING (
  is_active = true
);

-- Example: Allow guests to view active menu items
CREATE POLICY IF NOT EXISTS "Guests can view active menu items"
ON menu_items FOR SELECT  
TO authenticated, anon
USING (
  is_active = true
);

-- Example: Allow guests to view active products
CREATE POLICY IF NOT EXISTS "Guests can view active products"
ON products FOR SELECT
TO authenticated, anon
USING (
  is_active = true
);

-- Example: Allow guests to view approved third-party places
CREATE POLICY IF NOT EXISTS "Guests can view approved hotel places"
ON hotel_thirdparty_places FOR SELECT
TO authenticated, anon
USING (
  hotel_approved = true
);

-- 5. Test realtime subscription (optional - for debugging)
-- This will show you what events are being broadcast
LISTEN pgrst;

-- 6. Summary query - shows realtime status for all tables
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
  'amenities',
  'menu_items', 
  'products',
  'hotel_thirdparty_places',
  'announcements',
  'thirdparty_places',
  'hotel_settings',
  'emergency_contacts',
  'guests'
)
ORDER BY t.tablename;
