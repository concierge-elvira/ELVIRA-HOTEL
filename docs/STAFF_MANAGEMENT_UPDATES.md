# Staff Management Modal Updates

This document describes the enhancements made to the Staff Management modal.

## New Features

### 1. Avatar Display & Upload

- **Display Location**: Top of modal in all modes
- **Field**: `avatar_url` from `hotel_staff_personal_data` table
- **View Mode**:
  - Displays circular avatar (96x96) if exists
  - Shows initials in emerald circle if no avatar
  - Read-only display
- **Create/Edit Mode**:
  - Upload button to add profile picture
  - Change/Remove buttons if avatar exists
  - Shows initials placeholder before upload
  - Drag & drop or click to upload
- **Storage**:
  - Bucket: `hotel-assets`
  - Folder: `users-avatar`
  - Format: Stores filename only in database
  - Max size: 5MB
  - Supported: JPG, PNG, GIF
- **Fallback**: Automatically shows initials if image fails to load

### 2. Emergency Contact Information

- **New Section**: "Emergency Contact"
- **Fields**:
  - `emergency_contact_name` - Name of emergency contact
  - `emergency_contact_number` - Phone number of emergency contact
- **Layout**: 2-column grid in the modal

### 3. GDPR Consent

- **New Section**: "Data Protection"
- **Field**: `gdpr_consent` (boolean)
- **Requirement**: Mandatory checkbox for creating/editing staff members
- **Purpose**: Ensures legal compliance with GDPR regulations
- **Note**: Displayed with informative text about data retention (7 years)

## Database Changes

### New Column Added

A new migration file has been created: `database/migrations/004_add_gdpr_consent_to_staff.sql`

```sql
ALTER TABLE public.hotel_staff_personal_data
ADD COLUMN IF NOT EXISTS gdpr_consent boolean DEFAULT false;
```

### Existing Columns Used

- `avatar_url` - Already exists in the table
- `emergency_contact_name` - Already exists in the table
- `emergency_contact_number` - Already exists in the table

## File Structure

```
src/screens/hotel/hotel-staff/staff-management/components/modals/staff-modal/
├── StaffModal.tsx                 # Main modal component (updated)
├── StaffAvatarSection.tsx         # NEW: Avatar display (view mode)
├── StaffAvatarUploadSection.tsx   # NEW: Avatar upload (create/edit mode)
├── StaffEmergencySection.tsx      # NEW: Emergency contacts form
├── StaffGDPRSection.tsx           # NEW: GDPR consent checkbox
├── StaffBasicSection.tsx          # Existing: Basic info
├── StaffEmploymentSection.tsx     # Existing: Employment info
├── StaffContactSection.tsx        # Existing: Contact info
├── StaffAddressSection.tsx        # Existing: Address info
└── types.ts                       # Updated with new fields

src/screens/hotel/hotel-staff/staff-management/components/modals/
├── hooks/
│   └── useStaffForm.ts         # Updated with new fields
└── services/
    └── staffService.ts         # Updated to handle new fields

database/migrations/
└── 004_add_gdpr_consent_to_staff.sql  # NEW: Migration file
```

## Updated Types

### StaffFormData

```typescript
export interface StaffFormData {
  // ... existing fields
  avatarUrl: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  gdprConsent: boolean;
}
```

### StaffData

```typescript
interface StaffData {
  // ... existing fields
  hotel_staff_personal_data?: {
    // ... existing fields
    avatar_url?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_number?: string | null;
    gdpr_consent?: boolean | null;
  };
}
```

## Validation

The GDPR consent checkbox is **required** for creating or editing staff members. Users must accept responsibility for data processing before submitting the form.

## Usage

1. **Run the migration** first to add the `gdpr_consent` column to your database
2. **Adding/Editing Avatar**:
   - Click "Upload Photo" button in create/edit mode
   - Select an image file (max 5MB)
   - Image is uploaded to Supabase Storage
   - Filename is stored in `avatar_url` column
   - Click "Change Photo" to replace existing avatar
   - Click X button to remove avatar
3. **Emergency Contacts**: Add/edit in the dedicated section
4. **GDPR Consent**: Must be checked before creating/updating staff members

## Technical Details

### Avatar URL Construction

The system uses a smart URL construction approach:

- **Database stores**: Just the filename (e.g., `avatar-uuid-timestamp.jpg`)
- **Component constructs**: Full Supabase Storage URL dynamically
- **Path resolution**: Automatically prepends `users-avatar/` if not present
- **Full URL support**: Also handles already-constructed URLs

Example:

```typescript
// Stored in DB: "avatar-d8ac950b-aa18-4dc7-a8b8.jpg"
// Constructed URL: "https://[project].supabase.co/storage/v1/object/public/hotel-assets/users-avatar/avatar-d8ac950b-aa18-4dc7-a8b8.jpg"
```

### File Upload Process

1. User selects file via file input
2. File is validated (size, type)
3. Unique filename generated: `avatar-{uuid}-{timestamp}.{ext}`
4. File uploaded to `hotel-assets/users-avatar/` in Supabase Storage
5. Only filename saved to database (not full path)
6. Component retrieves public URL when displaying

## Notes

- **Avatar Display**: Different components for view vs create/edit modes
  - `StaffAvatarSection`: Read-only display for view mode
  - `StaffAvatarUploadSection`: Interactive upload for create/edit modes
- **GDPR Section**: Hidden in view mode (consent already given)
- **Avatar Storage**: Uses Supabase Storage with automatic URL construction
- **File Validation**: Client-side validation for size and file type
- **Error Handling**: Graceful fallback to initials if image fails to load
- **Accessibility**: Proper alt text and ARIA labels on all interactive elements
- **All new fields** are properly validated and included in create/update operations
- **Project structure** maintained with clean component organization
