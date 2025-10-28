import { ModalFormSection, Input } from "../../../../../../../components/ui";
import type { ScheduleSectionProps } from "./types";

/**
 * ScheduleDatesSection - Date range selection
 */
export function ScheduleDatesSection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
}: ScheduleSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Schedule Dates">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Start Date"
          value={formData?.scheduleStartDate || ""}
          onChange={(e) => onFieldChange?.("scheduleStartDate", e.target.value)}
          error={errors.scheduleStartDate}
          required
          disabled={isDisabled}
        />
        <Input
          type="date"
          label="Finish Date"
          value={formData?.scheduleFinishDate || ""}
          onChange={(e) =>
            onFieldChange?.("scheduleFinishDate", e.target.value)
          }
          error={errors.scheduleFinishDate}
          required
          disabled={isDisabled}
        />
      </div>
    </ModalFormSection>
  );
}
