# User Tracking for Third-Party Places

## Overview

The `thirdparty_places` table now tracks:

1. **Who fetched** each place from the Google Places API (`fetched_by`)
2. **Who approved** each place for hotels to see (`approved_by`)

## Database Changes

### New Columns

```sql
ALTER TABLE thirdparty_places
ADD COLUMN fetched_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
```

**`fetched_by`**:

- **Type**: UUID (foreign key to auth.users)
- **Nullable**: Yes
- **On Delete**: SET NULL
- **Purpose**: Track which Elvira admin/staff member fetched/added the place from Google Places API

**`approved_by`**:

- **Type**: UUID (foreign key to auth.users)
- **Nullable**: Yes
- **On Delete**: SET NULL
- **Purpose**: Track which Elvira admin/staff member approved the place for hotels to see

### Migration

Run the migration file:

```sql
database/migrations/005_add_fetched_by_to_thirdparty_places.sql
```

## Code Changes

### 1. Fetch Hook: `useFetchAndStoreGooglePlaces`

**File**: `src/hooks/third-party-management/google-places/useFetchGooglePlaces.ts`

When fetching places from Google:

1. Gets the current authenticated user ID
2. Passes it to the transformation function
3. Stores it in the `fetched_by` column

```typescript
// Get current user ID
const {
  data: { user },
} = await supabase.auth.getUser();
const userId = user?.id;

// Pass userId to transformation function
const placeData = transformGooglePlaceToSupabase(
  detailedPlace,
  category,
  { basic: place, detailed: detailedPlace },
  userId // <-- User ID stored in fetched_by
);
```

### 2. Approval Hooks

**File**: `src/hooks/third-party-management/thirdparty-places/actions/useApprovePlace.ts`

When approving a place:

1. Gets the current authenticated user ID
2. Sets `elvira_approved = true`
3. Sets `approved_by` to current user ID

```typescript
const {
  data: { user },
} = await supabase.auth.getUser();

await supabase
  .from("thirdparty_places")
  .update({
    elvira_approved: true,
    approved_by: user?.id || null,
  })
  .eq("id", placeId);
```

**File**: `src/hooks/third-party-management/thirdparty-places/actions/useRejectPlace.ts`

When rejecting/unapproving a place:

1. Sets `elvira_approved = false`
2. Clears `approved_by` (sets to NULL)

```typescript
await supabase
  .from("thirdparty_places")
  .update({
    elvira_approved: false,
    hotel_recommended: false,
    approved_by: null, // Clear when rejecting
  })
  .eq("id", placeId);
```

### 3. Bulk Operations

**File**: `src/hooks/third-party-management/thirdparty-places/useElviraPlacesManagement.ts`

Both `useTogglePlaceApproval` and `useBulkApprovePlaces` now:

- Set `approved_by` when approving
- Clear `approved_by` when unapproving

## Usage

### Automatic Tracking

**When Fetching Places:**

- User clicks "Fetch from Google" in Elvira dashboard
- System automatically captures their user ID
- All places fetched are tagged with `fetched_by`

**When Approving Places:**

- User clicks "Approve" on a place
- System automatically captures their user ID
- Place is marked as `elvira_approved = true`
- `approved_by` is set to the user's ID

**When Rejecting Places:**

- User clicks "Reject" or "Unapprove" on a place
- Place is marked as `elvira_approved = false`
- `approved_by` is cleared (set to NULL)

### Querying User Information

To see who fetched and approved a place:

```typescript
const { data } = await supabase
  .from("thirdparty_places")
  .select(
    `
    *,
    fetcher:fetched_by (
      email,
      raw_user_meta_data
    ),
    approver:approved_by (
      email,
      raw_user_meta_data
    )
  `
  )
  .eq("id", placeId);
```

### Displaying in UI

Show both fetcher and approver:

```tsx
<div className="space-y-1 text-xs text-gray-500">
  {place.fetched_by && <div>Fetched by: {place.fetcher?.email}</div>}
  {place.approved_by && <div>Approved by: {place.approver?.email}</div>}
</div>
```

## Benefits

1. **Complete Accountability**: Know who fetched AND who approved each place
2. **Quality Control**: Track which users are adding/approving high-quality places
3. **Audit Trail**: Full history of place lifecycle (fetch → approval)
4. **User Performance**: Measure team member contributions and approval accuracy
5. **Support & Debugging**: Identify who to contact about problematic places
6. **Approval Workflow**: Clear visibility into approval process

## Future Enhancements

Potential features to build on this:

### 1. User Statistics Dashboard

- Places fetched per user
- Places approved per user
- Approval rate (approved places / total places fetched)
- Most active contributors
- Track activity over time

### 2. Place Attribution

- Show fetcher and approver names on place cards
- Filter places by fetcher or approver
- Search by user
- User profile pages with their contributions

### 3. Quality Metrics

- Track approval rates per user
- Identify users with high-quality selections
- Flag users who need training
- Reward top contributors

### 4. Workflow & Notifications

- Notify users when their fetched places are approved/rejected
- Alert approvers when new places need review
- Show pending approvals per user
- Track time from fetch to approval

### 5. Reports & Analytics

- Weekly/monthly contribution reports
- Approval workflow bottlenecks
- User performance reviews
- Team productivity metrics

## Example Queries

### Get all places fetched by a specific user

```sql
SELECT * FROM thirdparty_places
WHERE fetched_by = 'user-uuid-here'
ORDER BY created_at DESC;
```

### Get all places approved by a specific user

```sql
SELECT * FROM thirdparty_places
WHERE approved_by = 'user-uuid-here'
ORDER BY updated_at DESC;
```

### Get places with both fetcher and approver info

```sql
SELECT
  tp.name,
  tp.category,
  tp.rating,
  tp.elvira_approved,
  f.email as fetched_by_email,
  a.email as approved_by_email,
  tp.created_at as fetched_at,
  tp.updated_at as approved_at
FROM thirdparty_places tp
LEFT JOIN auth.users f ON tp.fetched_by = f.id
LEFT JOIN auth.users a ON tp.approved_by = a.id
ORDER BY tp.created_at DESC;
```

### User contribution statistics

```sql
SELECT
  u.email,
  COUNT(*) as total_places_fetched,
  SUM(CASE WHEN tp.elvira_approved THEN 1 ELSE 0 END) as approved_places,
  ROUND(
    SUM(CASE WHEN tp.elvira_approved THEN 1 ELSE 0 END)::numeric /
    COUNT(*)::numeric * 100,
    2
  ) as approval_rate_percentage,
  AVG(tp.rating) as avg_rating
FROM thirdparty_places tp
LEFT JOIN auth.users u ON tp.fetched_by = u.id
WHERE tp.fetched_by IS NOT NULL
GROUP BY u.email
ORDER BY total_places_fetched DESC;
```

### Approver activity statistics

```sql
SELECT
  u.email,
  COUNT(*) as total_approvals,
  AVG(tp.rating) as avg_rating_of_approved_places,
  MIN(tp.updated_at) as first_approval,
  MAX(tp.updated_at) as last_approval
FROM thirdparty_places tp
LEFT JOIN auth.users u ON tp.approved_by = u.id
WHERE tp.approved_by IS NOT NULL
GROUP BY u.email
ORDER BY total_approvals DESC;
```

### Places pending approval (fetched but not yet approved)

```sql
SELECT
  tp.name,
  tp.category,
  tp.rating,
  u.email as fetched_by,
  tp.created_at,
  EXTRACT(DAY FROM (NOW() - tp.created_at)) as days_waiting
FROM thirdparty_places tp
LEFT JOIN auth.users u ON tp.fetched_by = u.id
WHERE tp.elvira_approved = false
  AND tp.fetched_by IS NOT NULL
ORDER BY tp.created_at ASC;
```

### Approval workflow timeline

```sql
SELECT
  tp.name,
  f.email as fetched_by,
  a.email as approved_by,
  tp.created_at as fetched_at,
  tp.updated_at as approved_at,
  EXTRACT(EPOCH FROM (tp.updated_at - tp.created_at))/3600 as hours_to_approval
FROM thirdparty_places tp
LEFT JOIN auth.users f ON tp.fetched_by = f.id
LEFT JOIN auth.users a ON tp.approved_by = a.id
WHERE tp.elvira_approved = true
  AND tp.approved_by IS NOT NULL
ORDER BY hours_to_approval ASC;
```

## Notes

- If a user is deleted, both `fetched_by` and `approved_by` will be set to NULL (data is preserved)
- Both columns are indexed for performance when filtering
- This only tracks new operations, existing rows will have NULL values
- When a place is rejected/unapproved, `approved_by` is cleared
- Bulk operations also track the approver correctly
