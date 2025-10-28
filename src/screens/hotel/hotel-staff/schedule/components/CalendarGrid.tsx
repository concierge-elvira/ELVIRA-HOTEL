import { CalendarCell } from "./CalendarCell";
import type { CalendarView } from "./types";
import type { StaffScheduleWithDetails } from "../../../../../types/staff-schedules";

interface CalendarGridProps {
  currentDate: Date;
  view: CalendarView;
  searchValue: string;
  statusFilter: string;
  schedules: StaffScheduleWithDetails[];
  onScheduleClick?: (schedule: StaffScheduleWithDetails) => void;
  onDayClick?: (date: Date, schedules: StaffScheduleWithDetails[]) => void;
  onCreateSchedule?: (date: Date) => void;
}

export function CalendarGrid({
  currentDate,
  view,
  searchValue,
  statusFilter,
  schedules,
  onScheduleClick,
  onDayClick,
  onCreateSchedule,
}: CalendarGridProps) {
  const today = new Date(2025, 9, 21); // October 21, 2025

  // Helper function to get schedules for a specific date
  const getSchedulesForDate = (date: Date) => {
    // Format date without timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    return schedules.filter((schedule) => {
      // Check if the date falls within the schedule range (start to finish)
      const scheduleStart = schedule.schedule_start_date;
      const scheduleFinish = schedule.schedule_finish_date;

      const matchesDateRange =
        dateString >= scheduleStart && dateString <= scheduleFinish;
      const matchesStatus =
        statusFilter === "All Statuses" ||
        schedule.status === statusFilter.toUpperCase();

      return matchesDateRange && matchesStatus;
    });
  };

  // Get the first day of the month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Get the first day of the calendar grid (might be from previous month)
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfWeek);

  // Generate calendar days
  const calendarDays: Date[] = [];
  const currentCalendarDate = new Date(startDate);

  // Generate 6 weeks (42 days) for month view
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(currentCalendarDate));
    currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
  }

  // Day headers
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (view === "week") {
    // For week view, show only 7 days starting from the current week
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const weekDays: Date[] = [];
    const currentWeekDate = new Date(startOfWeek);

    for (let i = 0; i < 7; i++) {
      weekDays.push(new Date(currentWeekDate));
      currentWeekDate.setDate(currentWeekDate.getDate() + 1);
    }

    return (
      <div className="p-4">
        {/* Week View Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayHeaders.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Week View Grid */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((date, index) => (
            <CalendarCell
              key={index}
              date={date}
              isCurrentMonth={true}
              isToday={date.toDateString() === today.toDateString()}
              searchValue={searchValue}
              statusFilter={statusFilter}
              view={view}
              schedules={getSchedulesForDate(date)}
              onScheduleClick={onScheduleClick}
              onDayClick={onDayClick}
              onCreateSchedule={onCreateSchedule}
            />
          ))}
        </div>
      </div>
    );
  }

  // Month view
  return (
    <div className="p-4">
      {/* Month View Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayHeaders.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Month View Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === today.toDateString();

          return (
            <CalendarCell
              key={index}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              searchValue={searchValue}
              statusFilter={statusFilter}
              view={view}
              schedules={getSchedulesForDate(date)}
              onScheduleClick={onScheduleClick}
              onDayClick={onDayClick}
              onCreateSchedule={onCreateSchedule}
            />
          );
        })}
      </div>
    </div>
  );
}
