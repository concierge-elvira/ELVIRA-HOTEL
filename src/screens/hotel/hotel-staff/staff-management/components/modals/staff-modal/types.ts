interface StaffData {
  id: string;
  position: string;
  department: string;
  status: string;
  employee_id?: string;
  hire_date?: string;
  hotel_staff_personal_data?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string | null;
    date_of_birth?: string | null;
    address?: string | null;
    city?: string | null;
    zip_code?: string | null;
    country?: string | null;
    avatar_url?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_number?: string | null;
    gdpr_consent?: boolean | null;
  };
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  status: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  avatarUrl: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  gdprConsent: boolean;
}

export interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffData | null;
  mode?: "create" | "edit" | "view";
  onEdit?: () => void;
  onDelete?: () => void;
  canEditEmployment?: boolean; // If false, user can only edit personal data
  // Permission flags
  canEdit?: boolean; // Can the current user edit this staff member?
  canDelete?: boolean; // Can the current user delete this staff member?
  isOwnProfile?: boolean; // Is this the current user's profile?
}

export interface StaffModalHeaderProps {
  fullName: string;
  employeeId?: string;
  status: string;
}

export interface StaffFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  position?: string;
  department?: string;
  gdprConsent?: string;
}

export interface StaffBasicSectionProps {
  mode: "create" | "edit" | "view";
  formData?: StaffFormData;
  onFieldChange?: (field: string, value: string) => void;
  errors?: StaffFormErrors;
  disabled?: boolean;
}

export interface StaffEmploymentSectionProps {
  mode: "create" | "edit" | "view";
  formData?: StaffFormData;
  onFieldChange?: (field: string, value: string) => void;
  errors?: StaffFormErrors;
  disabled?: boolean;
}

export interface StaffContactSectionProps {
  mode: "create" | "edit" | "view";
  formData?: StaffFormData;
  onFieldChange?: (field: string, value: string) => void;
  disabled?: boolean;
}

export interface StaffAddressSectionProps {
  mode: "create" | "edit" | "view";
  formData?: StaffFormData;
  onFieldChange?: (field: string, value: string) => void;
  disabled?: boolean;
}

export interface StaffModalFooterProps {
  mode: "create" | "edit" | "view";
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSubmit?: () => void;
  isPending?: boolean;
}

export type { StaffData };
