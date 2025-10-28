import { ModalFormSection, Input } from "../../../../../../../components/ui";
import type { ScheduleSectionProps } from "./types";

/**
 * ScheduleShiftSection - Shift time selection
 */
export function ScheduleShiftSection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
}: ScheduleSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Shift Times">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="time"
          label="Shift Start"
          value={formData?.shiftStart || ""}
          onChange={(e) => onFieldChange?.("shiftStart", e.target.value)}
          error={errors.shiftStart}
          required
          disabled={isDisabled}
        />
        <Input
          type="time"
          label="Shift End"
          value={formData?.shiftEnd || ""}
          onChange={(e) => onFieldChange?.("shiftEnd", e.target.value)}
          error={errors.shiftEnd}
          required
          disabled={isDisabled}
        />
      </div>
    </ModalFormSection>
  );
}
