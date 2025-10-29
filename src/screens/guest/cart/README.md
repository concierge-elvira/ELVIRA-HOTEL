# Cart Module

Shopping cart system for guests - organized by cart type (amenities, restaurant, shop).

## Structure

```
cart/
├── amenities/                    # Amenity cart (simple selection)
│   ├── AmenityCartBottomSheet.tsx
│   ├── components/
│   │   ├── AmenityCartItemCard.tsx
│   │   └── index.ts
│   └── index.ts
├── restaurant/                   # Restaurant cart (with quantities)
│   ├── RestaurantCartBottomSheet.tsx
│   ├── components/
│   │   ├── RestaurantCartItemCard.tsx
│   │   └── index.ts
│   └── index.ts
├── shop/                         # Shop cart (with quantities)
│   ├── ShopCartBottomSheet.tsx
│   ├── components/
│   │   ├── ShopCartItemCard.tsx
│   │   └── index.ts
│   └── index.ts
├── index.ts                      # Main exports
└── README.md
```

## Features

### Amenity Cart

- ✅ Simple item selection (no quantity controls)
- ✅ Remove items
- ✅ Show total price
- ✅ Empty state

### Restaurant Cart

- ✅ Quantity controls (+/-)
- ✅ Update quantities
- ✅ Remove items
- ✅ Show item totals and cart total
- ✅ Empty state

### Shop Cart

- ✅ Quantity controls (+/-)
- ✅ Update quantities
- ✅ Remove items
- ✅ Show item totals and cart total
- ✅ Empty state

## Usage

### In Amenities Page

```tsx
import { AmenityCartBottomSheet } from "../cart";

<AmenityCartBottomSheet
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
/>;
```

### In Restaurant Page

```tsx
import { RestaurantCartBottomSheet } from "../cart";

<RestaurantCartBottomSheet
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
/>;
```

### In Shop Page

```tsx
import { ShopCartBottomSheet } from "../cart";

<ShopCartBottomSheet
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
/>;
```

## Design Pattern

- Each cart type has its own subfolder
- Follows the same pattern as `request-history`
- Uses `GuestBottomSheet` component
- Integrates with `useGuestCart` context
- Small, focused components (~100-120 lines each)
- Clean separation of concerns
