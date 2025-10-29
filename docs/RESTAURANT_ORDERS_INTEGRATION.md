# Restaurant Orders Database Integration

## Overview

The restaurant checkout system has been integrated with the `dine_in_orders` and `dine_in_order_items` database tables, following the same pattern as the shop orders implementation.

## Database Schema

### `dine_in_orders` Table

- **Primary Key**: `id` (UUID)
- **Foreign Keys**:
  - `guest_id` → `guests(id)`
  - `hotel_id` → `hotels(id)`
  - `restaurant_id` → `restaurants(id)` (optional)
  - `processed_by` → `profiles(id)` (optional)

### Key Fields:

- `order_type`: Either `'room_service'` or `'restaurant_booking'`
- `status`: Default `'pending'`, can be: pending, confirmed, preparing, ready, delivered, completed, cancelled
- `total_price`: Calculated from order items

### Conditional Fields Based on Order Type:

**Restaurant Booking** (`order_type = 'restaurant_booking'`):

- `reservation_date` (required)
- `reservation_time` (required)
- `number_of_guests` (required)
- `table_preferences` (optional)
- `restaurant_id` (required - currently set to null, will be used when restaurant management is implemented)

**Room Service** (`order_type = 'room_service'`):

- `delivery_date` (required)
- `delivery_time` (optional)

### `dine_in_order_items` Table

- **Primary Key**: `id` (UUID)
- **Foreign Keys**:
  - `order_id` → `dine_in_orders(id)`
  - `menu_item_id` → `menu_items(id)`

## Service Type Mapping

| UI Service Type | Database order_type  |
| --------------- | -------------------- |
| "Restaurant"    | "restaurant_booking" |
| "Room Service"  | "room_service"       |

## Implementation Files

### Service Layer

**File**: `src/services/guest/restaurantOrders.ts`

- `createRestaurantOrder()` - Main function to create orders
- Includes guest_id and hotel_id for RLS bypass
- Handles conditional field insertion based on order type
- Includes debug logging for troubleshooting

### Component Integration

**File**: `src/screens/guest/cart/restaurant/RestaurantCartBottomSheet.tsx`

- Imports `createRestaurantOrder` from services
- Passes all order data including service type specific fields
- Handles success/error states
- Clears cart on successful submission

### Exports

**File**: `src/services/guest/index.ts`

- Exports `createRestaurantOrder` for use across the application

## RLS Policies

**File**: `database/rls_policies/dine_in_orders_rls.sql`

### Guest Policies:

1. **INSERT**: Guests can create orders with their own `guest_id`
2. **SELECT**: Guests can view their own orders
3. **No UPDATE/DELETE**: Guests cannot modify orders after creation

### Staff Policies:

1. **SELECT**: Staff can view all orders from their hotel
2. **UPDATE**: Staff can update orders from their hotel (status, processing, etc.)

### Order Items Policies:

- Follow the same pattern as orders
- Guests can INSERT/SELECT items for their orders
- Staff can SELECT/UPDATE items for their hotel's orders

## Data Flow

```
1. User adds items to cart (RestaurantCart context)
2. User selects service type in cart view (if multiple available)
3. User clicks "Continue to Checkout"
4. User fills out checkout form (conditional fields based on service type)
5. User submits order
6. RestaurantCartBottomSheet calls createRestaurantOrder()
7. Service:
   - Gets guest session (guest_id, hotel_id)
   - Calculates total_price
   - Maps service type to order_type
   - Builds order data with conditional fields
   - Inserts into dine_in_orders
   - Inserts items into dine_in_order_items
   - Returns success/error
8. On success:
   - Cart is cleared
   - Modal closes
   - Success notification (TODO)
9. On error:
   - Error message shown
   - Cart remains intact
   - User can retry
```

## Database Constraints

The schema includes several important constraints:

1. **Order Type Validation**: Only `'room_service'` or `'restaurant_booking'` allowed
2. **Restaurant Booking Requirements**: When `order_type = 'restaurant_booking'`, the following fields must be non-null:
   - restaurant_id
   - reservation_date
   - reservation_time
   - number_of_guests
3. **Room Service Requirements**: When `order_type = 'room_service'`, `delivery_date` must be non-null
4. **Status Validation**: Only valid status values allowed
5. **Price Validation**: total_price must be >= 0
6. **Guest Count Validation**: number_of_guests must be > 0 when provided

## Future Enhancements

1. **Restaurant Selection**: Currently `restaurant_id` is set to null. When restaurant management is implemented, this should be populated.
2. **Success Notifications**: Replace console.log with proper toast notifications
3. **Order Tracking**: Implement real-time order status updates
4. **Order History**: Create a view for guests to see past orders
5. **Staff Dashboard**: Interface for staff to manage incoming orders

## Testing Checklist

- [ ] Guest can create room service order
- [ ] Guest can create restaurant booking
- [ ] Service type selector works correctly
- [ ] Conditional fields display based on service type
- [ ] Orders are inserted with correct guest_id and hotel_id
- [ ] Order items are correctly linked to orders
- [ ] Cart clears after successful submission
- [ ] Error handling works correctly
- [ ] RLS policies prevent cross-hotel access
- [ ] Staff can view orders from their hotel
- [ ] Guests can only view their own orders

## Debug Mode

The service includes extensive console logging prefixed with emojis:

- 🍽️ Order data
- 👤 User information
- 🔑 JWT claims
- ✅ Success messages
- ❌ Error messages
- 📦 Order items

To disable debug logging in production, remove or comment out console.log statements.
