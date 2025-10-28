import {
  ModalFormSection,
  ModalFormGrid,
  Select,
} from "../../../../../../../components/ui";
import type { TaskSectionProps } from "./types";

const TASK_TYPE_OPTIONS = [
  { value: "", label: "Select task type" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Housekeeping", label: "Housekeeping" },
  { value: "Inspection", label: "Inspection" },
  { value: "Delivery", label: "Delivery" },
  { value: "Guest Request", label: "Guest Request" },
  { value: "Administrative", label: "Administrative" },
  { value: "Other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

/**
 * TaskCategorySection - Task type and priority fields
 * Uses form inputs for all modes (create/edit/view)
 */
export function TaskCategorySection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
}: TaskSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Task Category">
      <ModalFormGrid columns={2}>
        <Select
          label="Task Type"
          value={formData?.type || ""}
          onChange={(e) => onFieldChange?.("type", e.target.value)}
          options={TASK_TYPE_OPTIONS}
          error={errors.type}
          disabled={isDisabled}
        />

        <Select
          label="Priority"
          value={formData?.priority || "Medium"}
          onChange={(e) => onFieldChange?.("priority", e.target.value)}
          options={PRIORITY_OPTIONS}
          disabled={isDisabled}
        />
      </ModalFormGrid>
    </ModalFormSection>
  );
}
