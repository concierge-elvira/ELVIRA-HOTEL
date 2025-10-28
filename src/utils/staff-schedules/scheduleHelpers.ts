import type {
  StaffScheduleWithDetails,
  ScheduleCalendarEvent,
  ScheduleStatus,
} from "../../types/staff-schedules";

/**
 * Convert staff schedules to calendar events format
 */
export function schedulesToCalendarEvents(
  schedules: StaffScheduleWithDetails[]
): ScheduleCalendarEvent[] {
  return schedules.map((schedule) => {
    const startDate = new Date(schedule.schedule_start_date);
    const [startHours, startMinutes] = schedule.shift_start.split(":");
    const [endHours, endMinutes] = schedule.shift_end.split(":");

    const start = new Date(startDate);
    start.setHours(parseInt(startHours), parseInt(startMinutes), 0);

    const end = new Date(startDate);
    end.setHours(parseInt(endHours), parseInt(endMinutes), 0);

    // If shift ends before it starts, it means it ends the next day
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    return {
      id: schedule.id,
      title: schedule.staff?.hotel_staff_personal_data
        ? `${schedule.staff.hotel_staff_personal_data.first_name} ${schedule.staff.hotel_staff_personal_data.last_name}`
        : "Unknown Staff",
      start,
      end,
      status: schedule.status,
      staffName: schedule.staff?.hotel_staff_personal_data
        ? `${schedule.staff.hotel_staff_personal_data.first_name} ${schedule.staff.hotel_staff_personal_data.last_name}`
        : "Unknown",
      staffId: schedule.staff_id,
      notes: schedule.notes || undefined,
      isConfirmed: schedule.is_confirmed,
    };
  });
}

/**
 * Get status badge color
 */
export function getStatusColor(status: ScheduleStatus): string {
  const colors: Record<ScheduleStatus, string> = {
    SCHEDULED: "bg-blue-100 text-blue-800 border border-blue-200",
    CONFIRMED: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    COMPLETED: "bg-gray-100 text-gray-800 border border-gray-200",
    CANCELLED: "bg-red-100 text-red-800 border border-red-200",
  };
  return colors[status] || colors.SCHEDULED;
}

/**
 * Format time for display (HH:MM AM/PM)
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Format shift time range
 */
export function formatShiftTime(startTime: string, endTime: string): string {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

/**
 * Calculate shift duration in hours
 */
export function calculateShiftDuration(
  startTime: string,
  endTime: string
): number {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  let totalMinutes =
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

  // Handle overnight shifts
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }

  return totalMinutes / 60;
}

/**
 * Get date range for current month
 */
export function getCurrentMonthDateRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

/**
 * Get date range for current week
 */
export function getCurrentWeekDateRange(): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();

  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek);

  const end = new Date(now);
  end.setDate(now.getDate() + (6 - dayOfWeek));

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

/**
 * Validate schedule overlap
 */
export function hasScheduleOverlap(
  existingSchedules: StaffScheduleWithDetails[],
  newSchedule: {
    staff_id: string;
    schedule_start_date: string;
    shift_start: string;
    shift_end: string;
  }
): boolean {
  return existingSchedules.some((schedule) => {
    // Check if same staff and same date
    if (
      schedule.staff_id !== newSchedule.staff_id ||
      schedule.schedule_start_date !== newSchedule.schedule_start_date
    ) {
      return false;
    }

    // Check time overlap
    const existingStart = schedule.shift_start;
    const existingEnd = schedule.shift_end;
    const newStart = newSchedule.shift_start;
    const newEnd = newSchedule.shift_end;

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
}
