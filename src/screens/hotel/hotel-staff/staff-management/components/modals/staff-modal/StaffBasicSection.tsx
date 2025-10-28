import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../../components/ui";
import { Input } from "../../../../../../../components/ui";
import type { StaffBasicSectionProps } from "./types";

/**
 * StaffBasicSection - Basic information section for staff
 * Uses form inputs for all modes (create/edit/view)
 */
export function StaffBasicSection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
}: StaffBasicSectionProps) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  // For view mode, disable all inputs
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Basic Information">
      <ModalFormGrid columns={2}>
        <Input
          label="First Name"
          type="text"
          placeholder="Enter first name"
          value={formData?.firstName || ""}
          onChange={(e) => onFieldChange?.("firstName", e.target.value)}
          error={errors.firstName}
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />
        <Input
          label="Last Name"
          type="text"
          placeholder="Enter last name"
          value={formData?.lastName || ""}
          onChange={(e) => onFieldChange?.("lastName", e.target.value)}
          error={errors.lastName}
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />
      </ModalFormGrid>
      <Input
        label="Email"
        type="email"
        placeholder="Enter email address"
        value={formData?.email || ""}
        onChange={(e) => onFieldChange?.("email", e.target.value)}
        error={errors.email}
        required
        disabled={isDisabled || isEditMode}
        hint={isEditMode ? "Email cannot be changed after creation" : undefined}
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        }
      />
    </ModalFormSection>
  );
}
