import { Button } from "../../../../../../components/ui";
import type { CalendarView } from "../types";

interface ViewToggleProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={view === "month" ? "primary" : "secondary"}
        size="sm"
        onClick={() => onViewChange("month")}
      >
        Month
      </Button>
      <Button
        variant={view === "week" ? "primary" : "secondary"}
        size="sm"
        onClick={() => onViewChange("week")}
      >
        Week
      </Button>
    </div>
  );
}
