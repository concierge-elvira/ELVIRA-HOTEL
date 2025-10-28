# Request History Feature

## Overview

This feature displays a comprehensive history of all guest orders and requests in a bottom sheet modal, accessible via the clock icon in the floating widget menu.

## Structure

### Hooks (`src/hooks/guest-management/request-history/`)

- **`useGuestRequestHistory.ts`**: Fetches and combines data from:
  - Amenity requests (`amenity_requests` table)
  - Dine-in orders (`dine_in_orders` table with menu items)
  - Shop orders (`shop_orders` table with products)

### Components (`src/screens/guest/request-history/`)

#### Main Component

- **`RequestHistoryBottomSheet.tsx`**:
  - Displays all orders grouped by date
  - Shows summary stats (total orders and total spent)
  - Handles loading and empty states
  - Uses the reusable `GuestBottomSheet` component

#### Sub-components (`components/`)

- **`RequestHistoryItemCard.tsx`**:
  - Renders individual order cards
  - Different icons for amenities, restaurant, and shop orders
  - Shows status badges with color coding
  - Displays item previews and totals

#### Types (`types.ts`)

- `RequestHistoryItem`: Unified structure for all order types
- `GroupedRequest`: Orders grouped by date
- `AmenityRequestHistory`, `DineInOrderHistory`, `ShopOrderHistory`: Type-safe order data

## Integration

The clock icon click handler is implemented in `GuestRouter.tsx`:

1. Click on clock icon → Opens `RequestHistoryBottomSheet`
2. The sheet fetches data for the current guest
3. Orders are grouped by date (newest first)
4. Each order type has distinct styling and icons

## Features

### Summary Stats

- Total number of orders across all types
- Total amount spent

### Order Cards

- **Amenity Requests**: Purple MapPin icon
- **Restaurant/Room Service**: Green Utensils icon
- **Shop Orders**: Blue Shopping Bag icon

### Order Details

- Order type and subtitle
- Item preview (up to 3 items with images)
- Status badge (color-coded)
- Delivery/schedule information
- Total price

### Status Colors

- ✅ Completed/Delivered: Green
- ⏳ Pending/Confirmed: Yellow
- 🔵 Preparing/Ready: Blue
- ❌ Cancelled/Rejected: Red

## Usage

```tsx
import { RequestHistoryBottomSheet } from "./screens/guest/request-history";

<RequestHistoryBottomSheet
  isOpen={isOpen}
  onClose={onClose}
  guestId={guestId}
  hotelId={hotelId}
/>;
```

## Database Tables Used

- `amenity_requests` (with `amenities` join)
- `dine_in_orders` (with `dine_in_order_items` and `menu_items` join)
- `shop_orders` (with `shop_order_items` and `products` join)

## Guest Supabase Client

Uses `getGuestSupabaseClient()` for secure, guest-scoped database access with RLS policies.
