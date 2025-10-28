import {
  ModalFormSection,
  ModalFormGrid,
  Input,
} from "../../../../../../../components/ui";
import type { TaskSectionProps } from "./types";

/**
 * TaskScheduleSection - Due date and time fields
 * Uses form inputs for all modes (create/edit/view)
 */
export function TaskScheduleSection({
  mode,
  formData,
  onFieldChange,
  disabled = false,
}: TaskSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Schedule">
      <ModalFormGrid columns={2}>
        <Input
          label="Due Date"
          type="date"
          value={formData?.dueDate || ""}
          onChange={(e) => onFieldChange?.("dueDate", e.target.value)}
          disabled={isDisabled}
          leftIcon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />

        <Input
          label="Due Time"
          type="time"
          value={formData?.dueTime || ""}
          onChange={(e) => onFieldChange?.("dueTime", e.target.value)}
          disabled={isDisabled}
          leftIcon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </ModalFormGrid>
    </ModalFormSection>
  );
}
