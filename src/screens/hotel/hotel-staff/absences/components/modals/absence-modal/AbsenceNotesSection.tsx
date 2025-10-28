import { ModalFormSection, Textarea } from "../../../../../../../components/ui";
import type { AbsenceSectionProps } from "./types";

/**
 * AbsenceNotesSection - Notes field
 * Uses form inputs for all modes (create/edit/view)
 */
export function AbsenceNotesSection({
  mode,
  formData,
  onFieldChange,
  disabled = false,
}: AbsenceSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Additional Information">
      <Textarea
        label="Notes"
        placeholder="Add any additional notes or details (optional)"
        value={formData?.notes || ""}
        onChange={(e) => onFieldChange?.("notes", e.target.value)}
        disabled={isDisabled}
        rows={3}
      />
    </ModalFormSection>
  );
}
