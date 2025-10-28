# Request History Real-time Updates & Shake Animations

## Overview

The Request History feature now includes:

- ✅ Real-time subscription to order status changes
- ✅ Shake animations on bell and clock widgets when status updates
- ✅ Clean, minimal logging for debugging

## Features Implemented

### 1. Real-time Subscriptions

The system subscribes to three tables for instant updates:

- `amenity_requests` - Amenity/service requests
- `dine_in_orders` - Restaurant and room service orders
- `shop_orders` - Hotel shop purchases

**Location:** `src/hooks/guest-management/request-history/useGuestRequestHistory.ts`

### 2. Shake Animations

When an order status changes, both the bell and clock icons shake to alert the guest.

**Components Updated:**

- `FloatingBellButton` - Main bell widget with shake animation
- `FloatingActionButton` - Clock and other action buttons with shake
- `FloatingWidgetMenu` - Manages shake state via context

**Animation:** Uses Tailwind's `swing` keyframe (600ms duration)

### 3. Notification Context

**Location:** `src/contexts/guest/GuestNotificationContext.tsx`

Manages shake state globally:

- `shouldShakeBell` - Triggers bell shake
- `shouldShakeClock` - Triggers clock shake
- Auto-resets after 2 seconds

## How It Works

1. **Guest places order** → Data inserted into database
2. **Real-time subscription** → Detects INSERT event
3. **Callback triggered** → `onStatusChange()` called
4. **Context updated** → `triggerBellShake()` & `triggerClockShake()`
5. **Components react** → useEffect detects prop change
6. **Animation plays** → Icons shake for 600ms
7. **Auto-reset** → Context clears shake state after 2s
8. **Query invalidated** → Request history refetches with new data

## Testing Real-time Updates

### From Supabase Dashboard:

1. Open Supabase SQL Editor
2. Run this query to update an order status:

```sql
-- Update an amenity request status
UPDATE amenity_requests
SET status = 'confirmed'
WHERE guest_id = 'YOUR_GUEST_ID'
AND status = 'pending'
LIMIT 1;

-- Update a restaurant order status
UPDATE dine_in_orders
SET status = 'preparing'
WHERE guest_id = 'YOUR_GUEST_ID'
AND status = 'pending'
LIMIT 1;

-- Update a shop order status
UPDATE shop_orders
SET status = 'ready'
WHERE guest_id = 'YOUR_GUEST_ID'
AND status = 'pending'
LIMIT 1;
```

3. **Expected Behavior:**
   - Console shows: `[Realtime] 🔔 amenity_requests UPDATE`
   - Console shows: `[Request History] ⚡ Status changed`
   - Bell icon shakes
   - Clock icon shakes
   - Request history updates automatically

### From Hotel Dashboard:

1. Log in as hotel staff
2. Go to Order Management
3. Change status of any guest order
4. Guest screen should:
   - Show shake animation on bell & clock
   - Update order status in Request History
   - Display new status without refresh

## Troubleshooting

### Shake Animation Not Working

**Check Console for:**

```
[Realtime] ✅ Subscribed to amenity_requests
[Realtime] ✅ Subscribed to dine_in_orders
[Realtime] ✅ Subscribed to shop_orders
```

If not subscribed, verify:

1. Real-time is enabled in Supabase (see next section)
2. Guest is authenticated
3. `guestId` and `hotelId` are valid

### Real-time Not Updating

**Verify Database Setup:**

Run this in Supabase SQL Editor:

```sql
-- Check if tables are in realtime publication
SELECT tablename, 'Enabled' as status
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename IN (
  'amenity_requests',
  'dine_in_orders',
  'shop_orders'
);
```

**If tables missing, run:**

```sql
-- File: database/enable_order_realtime.sql
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS amenity_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS dine_in_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS shop_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS dine_in_order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS shop_order_items;
```

### No Shake on Status Change

**Check:**

1. GuestNotificationProvider wraps GuestRouter ✅
2. Console shows: `[Request History] ⚡ Status changed`
3. Browser console errors
4. Component is receiving `shouldShake` prop

**Debug in Console:**

```javascript
// Check context state (React DevTools)
GuestNotificationContext._currentValue;
// Should show: { shouldShakeBell: true, shouldShakeClock: true }
```

## Console Logs Reference

### Normal Operation:

```
[Realtime] ✅ Subscribed to amenity_requests
[Realtime] ✅ Subscribed to dine_in_orders
[Realtime] ✅ Subscribed to shop_orders
```

### On Status Change:

```
[Realtime] 🔔 amenity_requests UPDATE
[Request History] ⚡ Status changed
```

### On New Order:

```
[Realtime] 🔔 shop_orders INSERT
[Request History] ⚡ New order
```

### Errors:

```
[Realtime] ❌ amenity_requests error: <error details>
[Realtime] ⏱️ dine_in_orders timeout
```

## Performance Notes

- **Auto-reset:** Shake animations auto-reset after 2 seconds
- **Debouncing:** Multiple rapid updates will trigger single shake
- **Query invalidation:** Efficient - only refetches affected queries
- **Subscription cleanup:** Properly cleaned on unmount

## Files Modified

1. `src/hooks/guest-management/request-history/useGuestRequestHistory.ts`

   - Added `onStatusChange` callback parameter
   - Real-time subscriptions with onUpdate/onInsert handlers
   - Fixed filter syntax (removed hotel_id from filter)

2. `src/contexts/guest/GuestNotificationContext.tsx`

   - New context for managing shake animations
   - Auto-reset timers
   - Global notification state

3. `src/screens/guest/request-history/RequestHistoryBottomSheet.tsx`

   - Uses notification context
   - Passes onStatusChange callback to hook

4. `src/components/guest/floating-widget/FloatingBellButton.tsx`

   - Added `shouldShake` prop
   - useEffect to trigger animation on prop change

5. `src/components/guest/floating-widget/FloatingActionButton.tsx`

   - Added `shouldShake` prop
   - Shake animation on icon

6. `src/components/guest/floating-widget/FloatingWidgetMenu.tsx`

   - Uses notification context
   - Passes shake state to child components

7. `src/screens/guest/GuestRouter.tsx`

   - Wrapped with GuestNotificationProvider

8. `src/hooks/realtime/useGuestRealtimeSubscription.ts`

   - Cleaned up excessive logging
   - Improved error handling
   - Fixed TypeScript types

9. `database/enable_order_realtime.sql`
   - SQL script to enable realtime for order tables

## Database Requirements

Tables must be in `supabase_realtime` publication:

- ✅ `amenity_requests`
- ✅ `dine_in_orders`
- ✅ `shop_orders`
- ✅ `dine_in_order_items` (for nested updates)
- ✅ `shop_order_items` (for nested updates)

Run `database/enable_order_realtime.sql` if not already enabled.
