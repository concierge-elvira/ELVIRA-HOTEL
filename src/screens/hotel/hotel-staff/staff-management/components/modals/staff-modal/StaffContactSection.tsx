import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../../components/ui";
import { Input } from "../../../../../../../components/ui";
import type { StaffContactSectionProps } from "./types";

/**
 * StaffContactSection - Contact information section for staff
 * Uses form inputs for all modes (create/edit/view)
 */
export function StaffContactSection({
  mode,
  formData,
  onFieldChange,
  disabled = false,
}: StaffContactSectionProps) {
  const isViewMode = mode === "view";

  // For view mode, disable all inputs
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Contact Information">
      <ModalFormGrid columns={2}>
        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter phone number"
          value={formData?.phone || ""}
          onChange={(e) => onFieldChange?.("phone", e.target.value)}
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          }
        />
        <Input
          label="Date of Birth"
          type="date"
          value={formData?.dateOfBirth || ""}
          onChange={(e) => onFieldChange?.("dateOfBirth", e.target.value)}
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
