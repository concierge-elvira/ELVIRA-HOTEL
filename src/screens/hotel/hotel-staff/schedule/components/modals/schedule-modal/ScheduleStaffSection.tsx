import { ModalFormSection, Select } from "../../../../../../../components/ui";
import type { ScheduleSectionProps } from "./types";

/**
 * ScheduleStaffSection - Staff selection field
 */
export function ScheduleStaffSection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
  staffOptions = [],
  isLoadingStaff = false,
}: ScheduleSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Staff Information">
      <Select
        label="Staff Member"
        value={formData?.staffId || ""}
        onChange={(e) => onFieldChange?.("staffId", e.target.value)}
        options={staffOptions}
        error={errors.staffId}
        required
        disabled={isDisabled || isLoadingStaff}
      />
    </ModalFormSection>
  );
}
