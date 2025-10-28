import type {
  StaffSchedule,
  ScheduleStatus,
} from "../../../../../../../types/staff-schedules";

export interface ScheduleFormData {
  staffId: string;
  scheduleStartDate: string;
  scheduleFinishDate: string;
  shiftStart: string;
  shiftEnd: string;
  status: ScheduleStatus;
  notes: string;
}

export type ScheduleModalMode = "create" | "edit" | "view";

export interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule?: StaffSchedule | null;
  mode?: ScheduleModalMode;
  onEdit?: () => void;
  onDelete?: () => void;
  prefilledDate?: Date | null;
  // Permission flags
  canEdit?: boolean; // Can the current user edit this schedule?
  canDelete?: boolean; // Can the current user delete this schedule?
  canOnlyEditStatus?: boolean; // Can only edit status field (non-admins)
}

export interface ScheduleSectionProps {
  mode: ScheduleModalMode;
  formData: ScheduleFormData;
  onFieldChange?: (field: string, value: string) => void;
  errors?: Record<string, string | undefined>;
  disabled?: boolean;
  staffOptions?: Array<{ value: string; label: string }>;
  isLoadingStaff?: boolean;
  canOnlyEditStatus?: boolean; // For restricting non-admins to status field only
}
