import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../../components/ui";
import { Input } from "../../../../../../../components/ui";
import type { StaffAddressSectionProps } from "./types";

/**
 * StaffAddressSection - Address information section for staff
 * Uses form inputs for all modes (create/edit/view)
 */
export function StaffAddressSection({
  mode,
  formData,
  onFieldChange,
  disabled = false,
}: StaffAddressSectionProps) {
  const isViewMode = mode === "view";

  // For view mode, disable all inputs
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Address Information">
      <Input
        label="Address"
        type="text"
        placeholder="Enter street address"
        value={formData?.address || ""}
        onChange={(e) => onFieldChange?.("address", e.target.value)}
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        }
      />
      <ModalFormGrid columns={3}>
        <Input
          label="City"
          type="text"
          placeholder="City"
          value={formData?.city || ""}
          onChange={(e) => onFieldChange?.("city", e.target.value)}
          disabled={isDisabled}
        />
        <Input
          label="Zip Code"
          type="text"
          placeholder="Zip code"
          value={formData?.zipCode || ""}
          onChange={(e) => onFieldChange?.("zipCode", e.target.value)}
          disabled={isDisabled}
        />
        <Input
          label="Country"
          type="text"
          placeholder="Country"
          value={formData?.country || ""}
          onChange={(e) => onFieldChange?.("country", e.target.value)}
          disabled={isDisabled}
        />
      </ModalFormGrid>
    </ModalFormSection>
  );
}
