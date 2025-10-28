/**
 * Staff Schedules Types
 * Type definitions for staff scheduling system
 */

export type ScheduleStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface StaffSchedule {
  id: string;
  staff_id: string;
  hotel_id: string;
  schedule_start_date: string; // ISO date string
  shift_start: string; // Time string (HH:MM:SS)
  shift_end: string; // Time string (HH:MM:SS)
  status: ScheduleStatus;
  notes: string | null;
  is_confirmed: boolean;
  confirmed_by: string | null;
  confirmed_at: string | null; // ISO timestamp
  created_at: string | null; // ISO timestamp
  updated_at: string | null; // ISO timestamp
  created_by: string | null;
  schedule_finish_date: string; // ISO date string
}

export interface CreateStaffScheduleInput {
  staff_id: string;
  hotel_id: string;
  schedule_start_date: string;
  shift_start: string;
  shift_end: string;
  status?: ScheduleStatus;
  notes?: string;
  schedule_finish_date: string;
}

export interface UpdateStaffScheduleInput {
  schedule_start_date?: string;
  shift_start?: string;
  shift_end?: string;
  status?: ScheduleStatus;
  notes?: string;
  is_confirmed?: boolean;
  schedule_finish_date?: string;
}

export interface ConfirmScheduleInput {
  confirmed_by: string;
  confirmed_at: string;
  is_confirmed: boolean;
}

// Extended type with staff details for display
export interface StaffScheduleWithDetails extends StaffSchedule {
  staff?: {
    id: string;
    hotel_staff_personal_data: {
      first_name: string;
      last_name: string;
      email: string;
    } | null;
  };
}

// Calendar event format
export interface ScheduleCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: ScheduleStatus;
  staffName: string;
  staffId: string;
  notes?: string;
  isConfirmed: boolean;
}
