# Staff Role-Based Permissions Implementation

## Overview

This document describes the role-based permission system implemented for the Hotel Staff Management page. The system restricts certain actions based on the staff member's position and department.

## Permission Rules

### Hotel Admin + Manager

Staff members with **Position: "Hotel Admin"** AND **Department: "Manager"** have full permissions:

- ✅ Can add new staff members (+ Add Member button visible)
- ✅ Can edit any staff member (including employment fields)
- ✅ Can delete any staff member (except themselves)
- ✅ Can view all staff members

### Other Positions (Hotel Staff, etc.)

All other staff members have restricted permissions:

- ❌ Cannot add new staff members (+ Add Member button hidden)
- ❌ Cannot edit other staff members
- ❌ Cannot delete any staff members
- ✅ Can view all staff members
- ✅ Can edit **only their own profile** with restrictions:
  - ✅ Can edit personal data fields (from `hotel_staff_personal_data`)
  - ❌ Cannot edit employment fields (position, department, status)

## Files Modified/Created

### New Hook: `useStaffPermissions`

**Location:** `src/hooks/hotel-staff/staff-management/useStaffPermissions.ts`

**Purpose:** Centralized hook to determine staff permissions based on current user's position and department.

**Returns:**

```typescript
{
  // Permission flags
  canAddStaff: boolean;
  canEditAnyStaff: boolean;
  canDeleteAnyStaff: boolean;

  // User info
  currentUserId: string | null;
  currentUserPosition: string | null;
  currentUserDepartment: string | null;

  // Loading state
  isLoading: boolean;

  // Helper functions
  canEditStaff: (staffId: string) => boolean;
  canDeleteStaff: (staffId: string) => boolean;
  canOnlyEditPersonalData: (staffId: string) => boolean;
}
```

### Updated: `StaffManagement.tsx`

**Location:** `src/screens/hotel/hotel-staff/staff-management/StaffManagement.tsx`

**Changes:**

1. Import and use `useStaffPermissions` hook
2. Conditionally render "+ Add Member" button based on `permissions.canAddStaff`
3. Pass permission props to `StaffModal`:
   - `canEdit` - Whether user can edit this specific staff member
   - `canDelete` - Whether user can delete this specific staff member
   - `canEditEmployment` - Whether employment fields should be editable
   - `isOwnProfile` - Whether viewing own profile

### Updated: `StaffModal.tsx`

**Location:** `src/screens/hotel/hotel-staff/staff-management/components/modals/staff-modal/StaffModal.tsx`

**Changes:**

1. Accept new permission props: `canEdit`, `canDelete`, `isOwnProfile`, `canEditEmployment`
2. Conditionally pass `onEdit` and `onDelete` handlers to `ModalFormActions` based on permissions
3. Conditionally show avatar upload section based on `canEdit`
4. Pass `canEditEmployment` to `StaffEmploymentSection` to disable employment fields for non-admins

### Updated: `types.ts`

**Location:** `src/screens/hotel/hotel-staff/staff-management/components/modals/staff-modal/types.ts`

**Changes:**

Added new optional props to `StaffModalProps`:

```typescript
{
  canEdit?: boolean;        // Can the current user edit this staff member?
  canDelete?: boolean;      // Can the current user delete this staff member?
  isOwnProfile?: boolean;   // Is this the current user's profile?
}
```

## Editable Fields by Role

### For Hotel Admin + Manager

All fields are editable when editing any staff member:

- ✅ Avatar
- ✅ First Name, Last Name, Email
- ✅ Position, Department, Status
- ✅ Phone Number, Date of Birth
- ✅ Address, City, Zip Code, Country
- ✅ Emergency Contact Name, Emergency Contact Number

### For Other Staff (Own Profile Only)

Only personal data fields are editable:

- ✅ Avatar
- ✅ First Name, Last Name
- ❌ Email (disabled in edit mode for all users)
- ❌ Position, Department, Status (disabled)
- ✅ Phone Number, Date of Birth
- ✅ Address, City, Zip Code, Country
- ✅ Emergency Contact Name, Emergency Contact Number

## UI Behavior

### Staff Management Page

**For Hotel Admin + Manager:**

- "+ Add Member" button is visible in the header
- Can click any staff member to view details
- Details modal shows "Edit" and "Delete" buttons

**For Other Staff:**

- "+ Add Member" button is hidden
- Can click any staff member to view details
- Details modal:
  - Shows "Edit" button only when viewing own profile
  - Never shows "Delete" button
  - When editing own profile, employment fields are disabled

### Staff Detail Modal (View Mode)

**For Hotel Admin + Manager:**

- Footer shows: `[Delete]` (left) `[Close] [Edit]` (right)

**For Own Profile (Non-Admin):**

- Footer shows: `[Close] [Edit]` (right)

**For Other Profiles (Non-Admin):**

- Footer shows: `[Close]` (right)

### Staff Edit Modal

**For Hotel Admin + Manager:**

- All fields are editable (except email)
- Can update position, department, status

**For Own Profile (Non-Admin):**

- Personal data fields are editable
- Employment fields (position, department, status) are disabled
- Cannot change avatar if editing restrictions apply

## Technical Implementation

The permission system uses a hook-based approach that:

1. **Fetches current user info** via `useCurrentUserHotel()`
2. **Determines admin status** by checking position === "Hotel Admin" AND department === "Manager"
3. **Provides permission flags** for UI rendering decisions
4. **Offers helper functions** for specific permission checks

This approach ensures:

- Centralized permission logic
- Easy to maintain and extend
- Type-safe with TypeScript
- Reactive to user changes
- Consistent across the application

## Security Note

⚠️ **Important:** These UI restrictions are for user experience only. Always implement corresponding Row Level Security (RLS) policies in Supabase to enforce permissions at the database level.

Recommended RLS policies should:

- Only allow Hotel Admin + Manager to INSERT new staff
- Only allow Hotel Admin + Manager to UPDATE any staff employment data
- Only allow staff to UPDATE their own personal data in `hotel_staff_personal_data`
- Only allow Hotel Admin + Manager to DELETE staff records

## Testing Checklist

- [ ] Hotel Admin + Manager can see "+ Add Member" button
- [ ] Hotel Admin + Manager can edit any staff member
- [ ] Hotel Admin + Manager can delete any staff member (except themselves)
- [ ] Hotel Admin + Manager can edit all fields including employment
- [ ] Non-admin staff cannot see "+ Add Member" button
- [ ] Non-admin staff can view other staff members
- [ ] Non-admin staff can edit their own profile
- [ ] Non-admin staff cannot edit employment fields in their profile
- [ ] Non-admin staff cannot see Edit button for other staff members
- [ ] Non-admin staff never see Delete button
- [ ] Email field is disabled in edit mode for all users

## Future Enhancements

Potential improvements:

1. Add more granular roles (e.g., Department Manager, HR Manager)
2. Allow custom permission sets per hotel
3. Add audit logging for permission-based actions
4. Implement feature flags for permission toggles
5. Add permission-based navigation filtering
