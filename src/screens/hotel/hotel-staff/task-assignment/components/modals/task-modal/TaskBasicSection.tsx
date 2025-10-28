import {
  ModalFormSection,
  Input,
  Textarea,
} from "../../../../../../../components/ui";
import type { TaskSectionProps } from "./types";

/**
 * TaskBasicSection - Title and description fields for tasks
 * Uses form inputs for all modes (create/edit/view)
 */
export function TaskBasicSection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
}: TaskSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Task Information">
      <Input
        label="Task Title"
        type="text"
        placeholder="Enter task title"
        value={formData?.title || ""}
        onChange={(e) => onFieldChange?.("title", e.target.value)}
        error={errors.title}
        required
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        }
      />

      <Textarea
        label="Description"
        placeholder="Enter task description (optional)"
        value={formData?.description || ""}
        onChange={(e) => onFieldChange?.("description", e.target.value)}
        disabled={isDisabled}
        rows={3}
      />
    </ModalFormSection>
  );
}
