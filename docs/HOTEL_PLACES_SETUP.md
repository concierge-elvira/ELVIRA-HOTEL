# Hotel-Specific Third-Party Places Setup

## Overview

This implements a **multi-tenant approval system** where:

- **Elvira admins** approve places that become available to all hotels (`thirdparty_places.elvira_approved = true`)
- **Each hotel** can independently approve/reject and recommend places (`hotel_thirdparty_places` junction table)

## Database Setup

### Step 1: Run the Migration

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the migration file: `database/migrations/002_add_hotel_thirdparty_places.sql`

This creates:

- `hotel_thirdparty_places` junction table
- Indexes for performance
- RLS policies for security
- Triggers for automatic timestamps

### Step 2: Regenerate TypeScript Types

After running the migration, regenerate the database types:

```bash
# If you have Supabase CLI installed
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts

# Or manually copy types from Supabase Dashboard > API Docs > TypeScript
```

## How It Works

### 1. Data Flow

```
Google Places API
      ↓
thirdparty_places (all fetched places)
      ↓
elvira_approved = true (Elvira admin approves)
      ↓
hotel_thirdparty_places (each hotel approves/recommends independently)
```

### 2. Tables

#### `thirdparty_places`

- Stores all places fetched from Google Places API
- `elvira_approved`: Boolean flag set by Elvira admins
- Shared across all hotels

#### `hotel_thirdparty_places` (Junction Table)

- Links a hotel to a third-party place
- `hotel_approved`: This hotel wants to show this place
- `hotel_recommended`: This hotel recommends this place (★ star)
- `display_order`: Custom ordering per hotel
- `custom_notes`: Hotel-specific notes

### 3. User Interface

#### Gastronomy Tab (same for Tours, Wellness)

**Top Table**: Elvira-Approved Places

- Shows all places where `elvira_approved = true`
- Actions column:
  - **Approve** button: Hotel hasn't approved yet
  - **Reject** button: Hotel has approved (removes approval)
  - **★ Star**: Toggle recommendation (only if approved)

**Bottom Table**: Hotel's Recommended Places

- Shows only places where:
  - `elvira_approved = true`
  - `hotel_approved = true`
  - `hotel_recommended = true`
- These are the places guests will see as "recommended"

## Usage

### For Elvira Admins

1. Fetch places from Google using "Fetch from Google" button
2. Review places in the management panel
3. Approve places to make them available to hotels

### For Hotel Staff

1. View Elvira-approved places in each category tab
2. Click **Approve** to add a place to your hotel's offerings
3. Click **★** star to recommend it to guests (highlights it)
4. Click **Reject** to remove from your hotel's offerings

## Code Structure

```
src/
├── database/
│   ├── thirdparty_places.sql
│   ├── hotel_thirdparty_places.sql
│   └── migrations/
│       └── 002_add_hotel_thirdparty_places.sql
├── hooks/
│   └── third-party-management/
│       ├── thirdparty-places/          # Raw Google Places data
│       │   ├── useApprovedPlaces.ts    # Elvira-approved places
│       │   └── index.ts
│       └── hotel-places/                # Hotel-specific relationships
│           ├── useHotelPlaces.ts        # All hotel place hooks
│           └── index.ts
└── screens/
    └── hotel/
        └── third-party-management/
            ├── gastronomy/
            │   ├── Gastronomy.tsx               # Main tab component
            │   └── components/
            │       ├── RecommendedPlacesTable.tsx  # Recommended places table
            │       └── index.ts
            ├── tours/
            └── wellness/
```

## API Hooks

### Query Hooks

- `useApprovedThirdPartyPlaces(category)` - Fetch Elvira-approved places
- `useHotelPlaces(hotelId, category)` - Fetch hotel's place relationships
- `useHotelApprovedPlaces(hotelId, category)` - Fetch hotel-approved places
- `useHotelRecommendedPlaces(hotelId, category)` - Fetch hotel-recommended places

### Mutation Hooks

- `useApproveHotelPlace()` - Hotel approves a place
- `useRejectHotelPlace()` - Hotel rejects/removes a place
- `useToggleHotelRecommended()` - Toggle recommendation star

## Benefits of This Approach

1. **Multi-Tenant**: Each hotel has independent control
2. **Scalable**: No conflicts between hotels' preferences
3. **Flexible**: Hotels can customize which places to show
4. **Curated**: Elvira ensures quality before hotels see places
5. **Performance**: Indexed queries, efficient joins
6. **Secure**: RLS policies ensure hotels only see their own data

## Next Steps

1. ✅ Run the migration in Supabase
2. ✅ Regenerate TypeScript types
3. ✅ Test the Gastronomy tab
4. ⏳ Apply the same pattern to Tours and Wellness tabs
5. ⏳ Add guest-facing views to show recommended places
