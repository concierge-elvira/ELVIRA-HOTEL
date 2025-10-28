import type { CalendarView } from "./types";
import type { StaffScheduleWithDetails } from "../../../../../types/staff-schedules";
import {
  getStatusColor,
  formatShiftTime,
} from "../../../../../utils/staff-schedules";

interface CalendarCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  searchValue: string;
  statusFilter: string;
  view: CalendarView;
  schedules: StaffScheduleWithDetails[];
  onScheduleClick?: (schedule: StaffScheduleWithDetails) => void;
  onDayClick?: (date: Date, schedules: StaffScheduleWithDetails[]) => void;
  onCreateSchedule?: (date: Date) => void;
}

export function CalendarCell({
  date,
  isCurrentMonth,
  isToday,
  searchValue,
  view,
  schedules,
  onScheduleClick,
  onDayClick,
  onCreateSchedule,
}: CalendarCellProps) {
  const dayNumber = date.getDate();

  // Cell height differs between month and week view
  const cellHeight = view === "week" ? "h-28" : "h-20";

  // Limit displayed events based on view
  const maxEvents = view === "week" ? 3 : 2;
  const displaySchedules = schedules.slice(0, maxEvents);
  const hasMore = schedules.length > maxEvents;

  const handleCellClick = () => {
    if (schedules.length > 0) {
      // If there are schedules, show the list
      onDayClick?.(date, schedules);
    } else if (isCurrentMonth) {
      // If no schedules and it's current month, open create modal
      onCreateSchedule?.(date);
    }
  };

  const handleScheduleItemClick = (
    e: React.MouseEvent,
    schedule: StaffScheduleWithDetails
  ) => {
    e.stopPropagation();
    if (schedules.length === 1) {
      // If only one schedule, open detail modal directly
      onScheduleClick?.(schedule);
    } else {
      // If multiple schedules, let the day click handler show the list
      onDayClick?.(date, schedules);
    }
  };

  return (
    <div
      className={`
        ${cellHeight} border border-gray-200 bg-white rounded-md p-1.5 cursor-pointer hover:bg-gray-50 relative
        ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
        ${isToday ? "bg-blue-50 border-blue-300" : ""}
      `}
      onClick={handleCellClick}
    >
      {/* Day Number */}
      <div className="flex items-center justify-between mb-0.5">
        <span
          className={`
            text-xs font-medium
            ${
              isToday
                ? "bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                : ""
            }
            ${!isCurrentMonth ? "text-gray-400" : "text-gray-900"}
          `}
        >
          {dayNumber}
        </span>
        {/* +More badge in top right corner */}
        {hasMore && (
          <span className="text-xs text-gray-500 font-medium">
            +{schedules.length - maxEvents}
          </span>
        )}
      </div>

      {/* Schedule Events */}
      {isCurrentMonth && displaySchedules.length > 0 && (
        <div className="space-y-0.5">
          {displaySchedules.map((schedule) => {
            const staffName = schedule.staff?.hotel_staff_personal_data
              ? `${schedule.staff.hotel_staff_personal_data.first_name} ${schedule.staff.hotel_staff_personal_data.last_name}`
              : "Unknown";

            return (
              <div
                key={schedule.id}
                className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${getStatusColor(
                  schedule.status
                )}`}
                title={`${staffName} - ${formatShiftTime(
                  schedule.shift_start,
                  schedule.shift_end
                )}${schedule.notes ? "\n" + schedule.notes : ""}`}
                onClick={(e) => handleScheduleItemClick(e, schedule)}
              >
                {view === "week" ? (
                  <>
                    <div className="font-medium truncate">{staffName}</div>
                    <div className="text-xs opacity-90">
                      {formatShiftTime(
                        schedule.shift_start,
                        schedule.shift_end
                      )}
                    </div>
                  </>
                ) : (
                  <div className="truncate">{staffName}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Show search indicator if search is active and has results */}
      {searchValue && schedules.length > 0 && (
        <div className="absolute bottom-1 right-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        </div>
      )}
    </div>
  );
}
