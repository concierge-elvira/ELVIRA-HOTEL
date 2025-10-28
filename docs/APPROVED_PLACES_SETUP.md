# Approved Third-Party Places Setup

## Overview

This document describes the setup for filtering third-party places by Elvira approval status (`elvira_approved = true`).

## Structure

### Database Schema

The `thirdparty_places` table contains all Google Places data cached from the Google Places API. It includes an `elvira_approved` boolean field that determines which places are visible to hotels.

**Important**: The database schema needs to be updated to include the `elvira_approved` field:

```sql
-- Add elvira_approved column to thirdparty_places table
ALTER TABLE thirdparty_places
ADD COLUMN IF NOT EXISTS elvira_approved BOOLEAN DEFAULT false;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_elvira_approved
ON thirdparty_places(elvira_approved);

-- Create index for category + elvira_approved queries
CREATE INDEX IF NOT EXISTS idx_thirdparty_places_category_approved
ON thirdparty_places(category, elvira_approved);
```

### Hooks Organization

The hooks are organized in the following structure:

```
src/hooks/third-party-management/
├── index.ts (main exports)
├── third-party-places/ (hotel-specific approved places)
├── google-places/ (Google Places API integration)
└── thirdparty-places/ (cached Google Places data)
    ├── index.ts
    ├── useThirdPartyPlacesData.ts (ALL places - for Elvira admin)
    ├── useApprovedPlaces.ts (APPROVED places only - for hotels)
    └── useElviraPlacesManagement.ts (Elvira admin management)
```

### New Hooks Created

#### `useApprovedPlaces.ts`

Contains hooks for hotels to fetch only Elvira-approved places:

- **`useApprovedThirdPartyPlaces(category?)`**: Fetch all approved places, optionally filtered by category
- **`useApprovedPlaceByGoogleId(googlePlaceId)`**: Fetch a single approved place by Google Place ID
- **`useSearchApprovedPlaces(searchTerm, category?)`**: Search approved places by name or address
- **`useNearbyApprovedPlaces(lat, lng, radius, category?)`**: Get approved places near a location
- **`useApprovedPlacesStats()`**: Get statistics about approved places

All these hooks automatically filter by `elvira_approved = true`.

### Updated Components

The following hotel management screens were updated to use the new approved hooks:

1. **`src/screens/hotel/third-party-management/gastronomy/Gastronomy.tsx`**

   - Changed from `useThirdPartyPlaces` to `useApprovedThirdPartyPlaces`
   - Now only displays Elvira-approved gastronomy places

2. **`src/screens/hotel/third-party-management/tours/Tours.tsx`**

   - Implemented full table display with approved places
   - Uses `useApprovedThirdPartyPlaces("tours")`

3. **`src/screens/hotel/third-party-management/wellness/Wellness.tsx`**
   - Implemented full table display with approved places
   - Uses `useApprovedThirdPartyPlaces("wellness")`

## Usage

### For Hotel Views (Approved Places Only)

```typescript
import { useApprovedThirdPartyPlaces } from "../../../../hooks/third-party-management";

function MyComponent() {
  const { data: places, isLoading } = useApprovedThirdPartyPlaces("gastronomy");

  // places will only contain items where elvira_approved = true
  return <div>...</div>;
}
```

### For Elvira Admin Views (All Places)

```typescript
import {
  useAllThirdPartyPlaces,
  useTogglePlaceApproval,
} from "../../../../hooks/third-party-management/thirdparty-places";

function ElviraAdmin() {
  const { data: allPlaces } = useAllThirdPartyPlaces({
    category: "gastronomy",
    approved: false, // Can filter by approval status
  });

  const { mutate: toggleApproval } = useTogglePlaceApproval();

  // Admin can see all places and toggle approval
  return <div>...</div>;
}
```

## Migration Steps

### 1. Database Migration

Run the SQL migrations to add the `elvira_approved` field:

```bash
# Connect to your Supabase project and run the SQL above
```

### 2. Update Existing Data

Decide which existing places should be approved by default:

```sql
-- Option 1: Approve all existing places
UPDATE thirdparty_places SET elvira_approved = true;

-- Option 2: Keep all unapproved (requires manual approval)
UPDATE thirdparty_places SET elvira_approved = false;

-- Option 3: Approve based on rating (example: 4+ stars)
UPDATE thirdparty_places
SET elvira_approved = true
WHERE rating >= 4.0;
```

### 3. Test the Implementation

1. Verify hotels can only see approved places
2. Verify Elvira admin can see all places
3. Verify approval/unapproval works correctly
4. Test search and filter functionality

## Benefits

1. **Centralized Control**: Elvira can control which third-party places are visible to all hotels
2. **Quality Assurance**: Only vetted places are shown to hotel guests
3. **Performance**: Filtered queries with proper indexes
4. **Flexibility**: Easy to approve/unapprove places as needed
5. **Clean Separation**: Clear distinction between admin and hotel views

## Future Enhancements

- Add approval reasons/notes
- Add approval workflow (pending → approved → rejected)
- Add automatic approval based on criteria (rating, reviews, etc.)
- Add approval history tracking
- Add bulk approval/unapproval actions
