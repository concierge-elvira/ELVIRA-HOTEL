import { ModalFormSection, Textarea } from "../../../../../../../components/ui";
import type { ScheduleSectionProps } from "./types";

/**
 * ScheduleNotesSection - Notes field
 */
export function ScheduleNotesSection({
  mode,
  formData,
  onFieldChange,
  disabled = false,
}: ScheduleSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Additional Notes">
      <Textarea
        label="Notes"
        value={formData?.notes || ""}
        onChange={(e) => onFieldChange?.("notes", e.target.value)}
        placeholder="Add any additional notes about this schedule..."
        rows={3}
        disabled={isDisabled}
      />
    </ModalFormSection>
  );
}
