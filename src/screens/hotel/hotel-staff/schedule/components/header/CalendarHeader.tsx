import type { CalendarView } from "../types";
import { DateSection } from "./DateSection";
import { StatusFilter } from "./StatusFilter";
import { ViewToggle } from "./ViewToggle";
import { NavigationControls } from "./NavigationControls";
import { ActionButtons } from "./ActionButtons";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  statusFilter,
  onStatusFilterChange,
}: CalendarHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      {/* Single Row - All Elements */}
      <div className="flex items-center justify-between">
        {/* Left Side - Date, Today, Status */}
        <div className="flex items-center space-x-4">
          <DateSection currentDate={currentDate} onToday={onToday} />
          <StatusFilter
            statusFilter={statusFilter}
            onStatusFilterChange={onStatusFilterChange}
          />
        </div>

        {/* Right Side - View Controls and Action Buttons */}
        <div className="flex items-center space-x-3">
          <ViewToggle view={view} onViewChange={onViewChange} />
          <NavigationControls onPrevious={onPrevious} onNext={onNext} />
          <ActionButtons />
        </div>
      </div>
    </div>
  );
}
