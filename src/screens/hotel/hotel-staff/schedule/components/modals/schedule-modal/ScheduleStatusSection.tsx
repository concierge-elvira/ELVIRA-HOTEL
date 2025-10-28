import { ModalFormSection, Select } from "../../../../../../../components/ui";
import type { ScheduleSectionProps } from "./types";

/**
 * ScheduleStatusSection - Status selection
 */
export function ScheduleStatusSection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
}: ScheduleSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  const statusOptions = [
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <ModalFormSection title="Status">
      <Select
        label="Schedule Status"
        value={formData?.status || "SCHEDULED"}
        onChange={(e) => onFieldChange?.("status", e.target.value)}
        options={statusOptions}
        error={errors.status}
        required
        disabled={isDisabled}
      />
    </ModalFormSection>
  );
}
