# Realtime Subscription Errors - Diagnosis & Fix

## Problem Summary

You're seeing "channel error - undefined" for the following tables:

- ❌ `hotel_settings`
- ❌ `emergency_contacts`
- ❌ `amenity_requests`
- ❌ `dine_in_orders`
- ❌ `shop_orders`

## Root Cause

These errors occur when:

1. **Tables are not added to the Supabase realtime publication**
2. **RLS (Row Level Security) policies don't allow SELECT access for the authenticated user**
3. **Realtime is not enabled in Supabase project settings**

## Solution

### Step 1: Enable Realtime in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Database** → **Replication**
3. Find the table `supabase_realtime` in the publications list
4. Ensure all these tables are checked:
   - `hotel_settings`
   - `emergency_contacts`
   - `amenity_requests`
   - `dine_in_orders`
   - `shop_orders`
   - `dine_in_order_items`
   - `shop_order_items`

### Step 2: Run SQL Scripts

Run these SQL scripts in order in your Supabase SQL Editor:

#### Script 1: Enable Guest Realtime Tables

```sql
-- File: database/enable_guest_realtime.sql
-- This enables realtime for hotel_settings and emergency_contacts
```

Run the entire `database/enable_guest_realtime.sql` file in Supabase SQL Editor.

#### Script 2: Enable Order Realtime Tables

```sql
-- File: database/enable_order_realtime.sql
-- This enables realtime for amenity_requests, dine_in_orders, shop_orders
```

Run the entire `database/enable_order_realtime.sql` file in Supabase SQL Editor.

### Step 3: Verify Realtime is Enabled

Run this query in Supabase SQL Editor to verify:

```sql
SELECT
  schemaname,
  tablename,
  'Realtime enabled' as status
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename IN (
  'hotel_settings',
  'emergency_contacts',
  'amenity_requests',
  'dine_in_orders',
  'shop_orders'
)
ORDER BY tablename;
```

You should see all 5 tables listed. If any are missing, run:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS hotel_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS emergency_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS amenity_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS dine_in_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS shop_orders;
```

### Step 4: Verify RLS Policies for Guest Access

Check that guests have SELECT permissions on these tables:

```sql
-- Check RLS policies for each table
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
```

### Step 5: Check Supabase Project Settings

1. Go to **Settings** → **API** in Supabase Dashboard
2. Scroll to **Realtime** section
3. Ensure **Realtime** is enabled for your project
4. Check if there are any rate limits or restrictions

### Step 6: Test in Browser

After applying the fixes:

1. Clear browser cache and reload the application
2. Open Browser DevTools Console
3. Look for log messages like:
   ```
   [Realtime] 🔔 hotel_settings UPDATE
   [Realtime] 🔔 emergency_contacts INSERT
   ```
4. Errors should be gone!

## Alternative Quick Fix (If Issue Persists)

If the errors continue, you can disable realtime for guest tables temporarily by modifying the hooks:

### Disable Realtime for Specific Tables

Edit each hook file and set `enabled: false`:

**File: `src/hooks/guest-management/settings/useGuestHotelSettings.ts`**

```typescript
useGuestRealtimeSubscription({
  table: "hotel_settings",
  filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
  queryKey: [GUEST_HOTEL_SETTINGS_QUERY_KEY, hotelId],
  enabled: false, // ← Disable realtime temporarily
});
```

**File: `src/hooks/guest-management/emergency-contacts/useGuestEmergencyContacts.ts`**

```typescript
useGuestRealtimeSubscription({
  table: "emergency_contacts",
  filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
  queryKey: [GUEST_EMERGENCY_CONTACTS_QUERY_KEY, hotelId],
  enabled: false, // ← Disable realtime temporarily
});
```

**File: `src/hooks/guest-management/request-history/useGuestRequestHistory.ts`**

```typescript
// Disable all three subscriptions
useGuestRealtimeSubscription({
  table: "amenity_requests",
  filter: guestId && hotelId ? `guest_id=eq.${guestId}` : undefined,
  queryKey,
  enabled: false, // ← Disable
  // ...
});

useGuestRealtimeSubscription({
  table: "dine_in_orders",
  filter: guestId && hotelId ? `guest_id=eq.${guestId}` : undefined,
  queryKey,
  enabled: false, // ← Disable
  // ...
});

useGuestRealtimeSubscription({
  table: "shop_orders",
  filter: guestId && hotelId ? `guest_id=eq.${guestId}` : undefined,
  queryKey,
  enabled: false, // ← Disable
  // ...
});
```

> **Note**: Disabling realtime means data won't update automatically - users will need to refresh the page manually.

## Recommended Action

**Option 1 (Preferred)**: Run the SQL scripts to properly enable realtime

- Better user experience
- Real-time updates work as designed
- No code changes needed

**Option 2 (Quick Fix)**: Disable realtime subscriptions

- Faster to implement
- Loses real-time functionality
- Users must refresh manually

## Files Involved

- `database/enable_guest_realtime.sql` - Enables realtime for hotel_settings, emergency_contacts
- `database/enable_order_realtime.sql` - Enables realtime for order tables
- `src/hooks/realtime/useGuestRealtimeSubscription.ts` - Core realtime subscription hook
- `src/hooks/guest-management/settings/useGuestHotelSettings.ts` - Uses hotel_settings subscription
- `src/hooks/guest-management/emergency-contacts/useGuestEmergencyContacts.ts` - Uses emergency_contacts subscription
- `src/hooks/guest-management/request-history/useGuestRequestHistory.ts` - Uses order table subscriptions

## Next Steps

1. ✅ Run `database/enable_guest_realtime.sql` in Supabase SQL Editor
2. ✅ Run `database/enable_order_realtime.sql` in Supabase SQL Editor
3. ✅ Verify tables in realtime publication
4. ✅ Refresh your application
5. ✅ Check console - errors should be gone!
