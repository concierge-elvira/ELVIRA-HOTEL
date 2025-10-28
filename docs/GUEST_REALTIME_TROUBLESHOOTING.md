# Guest Realtime Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Realtime subscriptions not triggering

**Symptoms:**

- Data doesn't update automatically when changed from hotel dashboard
- Console shows subscription status but no change events

**Possible Causes:**

1. **Realtime not enabled on tables**

   - Go to Supabase Dashboard → Database → Replication
   - Enable realtime for these tables:
     - `amenities`
     - `menu_items`
     - `products`
     - `hotel_thirdparty_places`
     - `announcements`

2. **RLS Policies blocking SELECT**

   - Realtime requires SELECT permission through RLS policies
   - Check that guest users can SELECT from these tables
   - The subscription will fail silently if SELECT is blocked

3. **Filter syntax incorrect**

   - Supabase uses PostgREST filter syntax: `column=eq.value`
   - Example: `hotel_id=eq.123e4567-e89b-12d3-a456-426614174000`

4. **Multiple client instances**
   - Fixed by using singleton pattern in `guestSupabase.ts`
   - Each subscription should reuse the same client

### Issue 2: Subscription connects but doesn't receive updates

**Possible Causes:**

1. **Table not in replication publication**

   ```sql
   -- Check which tables are published
   SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

   -- Add table to publication if missing
   ALTER PUBLICATION supabase_realtime ADD TABLE amenities;
   ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
   ALTER PUBLICATION supabase_realtime ADD TABLE products;
   ALTER PUBLICATION supabase_realtime ADD TABLE hotel_thirdparty_places;
   ```

2. **RLS policies too restrictive**
   - Guest must have SELECT permission for realtime to work
   - Check policies allow: `auth.jwt() ->> 'guest_id' = guest_id::text`

### Issue 3: "CHANNEL_ERROR" or "TIMED_OUT" status

**Possible Causes:**

1. **Network/WebSocket issues**

   - Check browser console for WebSocket errors
   - Verify Supabase project allows realtime connections

2. **Invalid filter**

   - Check filter syntax matches PostgREST format
   - Test filter in Supabase SQL editor first

3. **Too many subscriptions**
   - Limit: 100 concurrent channels per client
   - Current implementation creates 1 channel per table per component

## Debugging Steps

### Step 1: Check Console Logs

Look for these log messages:

```
[Guest Realtime] Effect triggered for table: amenities, enabled: true, filter: hotel_id=eq.xxx
[Guest Realtime] Creating channel: guest-amenities-changes-xxx
[Guest Realtime] 📡 amenities subscription status: SUBSCRIBED
```

If you see "SUBSCRIBED", the connection is working.

### Step 2: Enable Supabase Realtime on Tables

1. Go to: https://app.supabase.com/project/YOUR_PROJECT/database/replication
2. Find each table and toggle "Realtime" ON
3. Click "Save"

### Step 3: Verify RLS Policies

Run this SQL to check if guest can SELECT:

```sql
-- Test as guest user
SET LOCAL role TO 'anon';
SET LOCAL request.jwt.claims TO '{"guest_id": "your-guest-id"}';

SELECT * FROM amenities WHERE hotel_id = 'your-hotel-id' AND is_active = true;
```

If this fails, add/fix RLS policy:

```sql
CREATE POLICY "Guests can view active amenities"
ON amenities FOR SELECT
TO anon
USING (
  is_active = true
  AND hotel_id IN (
    SELECT hotel_id FROM guests
    WHERE id::text = auth.jwt() ->> 'guest_id'
  )
);
```

### Step 4: Test Manual Update

1. Open browser console on guest app
2. Open Supabase dashboard in another tab
3. Update a menu item/amenity that should be visible
4. Check console for:
   ```
   [Guest Realtime] 🔔 amenities change detected: {...}
   [Guest Realtime] Event type: UPDATE, Table: amenities
   [Guest Realtime] Invalidating query with key: ["guest-amenities", "hotel-id"]
   ```

## SQL Script to Enable Realtime

Run this in Supabase SQL Editor:

```sql
-- Enable realtime on all guest-facing tables
ALTER PUBLICATION supabase_realtime ADD TABLE amenities;
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE hotel_thirdparty_places;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;

-- Verify
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename IN ('amenities', 'menu_items', 'products', 'hotel_thirdparty_places', 'announcements');
```

## Expected Console Output (Working)

```
[Guest Supabase] Creating new client instance
[Guest Supabase] Has guest token: true
[Guest Supabase] Client created successfully
[Guest Realtime] Effect triggered for table: amenities, enabled: true, filter: hotel_id=eq.123...
[Guest Realtime] Creating channel: guest-amenities-changes-1730123456789
[Guest Realtime] 📡 amenities subscription status: SUBSCRIBED
[Guest Realtime] ✅ Successfully subscribed to amenities

// When hotel staff updates an amenity:
[Guest Realtime] 🔔 amenities change detected: {eventType: "UPDATE", table: "amenities", ...}
[Guest Realtime] Event type: UPDATE, Table: amenities
[Guest Realtime] Invalidating query with key: ["guest-amenities", "hotel-id"]
```

## Quick Fix Checklist

- [ ] Realtime enabled on tables in Supabase Dashboard
- [ ] RLS policies allow SELECT for guest users
- [ ] Tables added to `supabase_realtime` publication
- [ ] Guest has valid JWT token
- [ ] Filter syntax is correct (`column=eq.value`)
- [ ] Browser console shows "SUBSCRIBED" status
- [ ] No WebSocket errors in Network tab
