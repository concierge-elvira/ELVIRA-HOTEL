import {
  ModalFormSection,
  ModalFormGrid,
  Select,
} from "../../../../../../../components/ui";
import type { TaskSectionProps } from "./types";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

/**
 * TaskAssignmentSection - Staff assignment and status fields
 * Uses form inputs for all modes (create/edit/view)
 */
export function TaskAssignmentSection({
  mode,
  formData,
  onFieldChange,
  disabled = false,
  staffOptions = [],
  isLoadingStaff = false,
  canOnlyEditStatus = false,
}: TaskSectionProps) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Assignment & Status">
      <ModalFormGrid columns={isEditMode ? 2 : 1}>
        <Select
          label="Assign To"
          value={formData?.staffId || ""}
          onChange={(e) => onFieldChange?.("staffId", e.target.value)}
          options={staffOptions}
          disabled={
            isDisabled || isLoadingStaff || (isEditMode && canOnlyEditStatus)
          }
        />

        {isEditMode && (
          <Select
            label="Status"
            value={formData?.status || "PENDING"}
            onChange={(e) => onFieldChange?.("status", e.target.value)}
            options={STATUS_OPTIONS}
            disabled={isDisabled}
          />
        )}
      </ModalFormGrid>
    </ModalFormSection>
  );
}
