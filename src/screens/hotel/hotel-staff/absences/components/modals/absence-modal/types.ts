import type { Database } from "../../../../../../../types/database";

type AbsenceRequestRow =
  Database["public"]["Tables"]["absence_requests"]["Row"];

export interface AbsenceWithStaff extends AbsenceRequestRow {
  staff?: {
    id: string;
    position: string;
    department: string;
    hotel_staff_personal_data?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export interface AbsenceFormData {
  staffId: string;
  requestType: string;
  startDate: string;
  endDate: string;
  status: string;
  notes: string;
}

export interface AbsenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  absence?: AbsenceWithStaff | null;
  mode?: "create" | "edit" | "view";
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface AbsenceSectionProps {
  mode: "create" | "edit" | "view";
  formData?: AbsenceFormData;
  absence?: AbsenceWithStaff | null;
  onFieldChange?: (field: string, value: string | boolean) => void;
  errors?: Record<string, string | undefined>;
  disabled?: boolean;
  staffOptions?: Array<{ value: string; label: string }>;
  isLoadingStaff?: boolean;
  isHotelStaff?: boolean; // Whether the current user is Hotel Staff
  currentUserName?: string; // Name to display for Hotel Staff
}

export type { AbsenceRequestRow };
