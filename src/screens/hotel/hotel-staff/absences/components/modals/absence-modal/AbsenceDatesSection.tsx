import {
  ModalFormSection,
  ModalFormGrid,
  Input,
} from "../../../../../../../components/ui";
import type { AbsenceSectionProps } from "./types";

/**
 * AbsenceDatesSection - Start and end date fields
 * Uses form inputs for all modes (create/edit/view)
 */
export function AbsenceDatesSection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
}: AbsenceSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Dates">
      <ModalFormGrid columns={2}>
        <Input
          label="Start Date"
          type="date"
          value={formData?.startDate || ""}
          onChange={(e) => onFieldChange?.("startDate", e.target.value)}
          error={errors.startDate}
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />

        <Input
          label="End Date"
          type="date"
          value={formData?.endDate || ""}
          onChange={(e) => onFieldChange?.("endDate", e.target.value)}
          error={errors.endDate}
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
      </ModalFormGrid>
    </ModalFormSection>
  );
}
