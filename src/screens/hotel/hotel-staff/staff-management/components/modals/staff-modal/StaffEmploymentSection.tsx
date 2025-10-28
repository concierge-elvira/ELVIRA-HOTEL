import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../../components/ui";
import { Select } from "../../../../../../../components/ui";
import type { StaffEmploymentSectionProps } from "./types";

const POSITION_OPTIONS = [
  { value: "Hotel Admin", label: "Hotel Admin" },
  { value: "Hotel Staff", label: "Hotel Staff" },
];

const ADMIN_DEPARTMENT_OPTIONS = [{ value: "Manager", label: "Manager" }];

const STAFF_DEPARTMENT_OPTIONS = [
  { value: "Receptionist", label: "Receptionist" },
  { value: "Housekeeping", label: "Housekeeping" },
  { value: "Security", label: "Security" },
  { value: "Kitchen", label: "Kitchen" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Food & Beverage", label: "Food & Beverage" },
  { value: "Concierge", label: "Concierge" },
  { value: "Guest Services", label: "Guest Services" },
  { value: "Other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_leave", label: "On Leave" },
];

/**
 * StaffEmploymentSection - Employment information section for staff
 * Uses form inputs for all modes (create/edit/view)
 */
export function StaffEmploymentSection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
}: StaffEmploymentSectionProps) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  // For view mode, disable all inputs
  const isDisabled = disabled || isViewMode;

  // Get department options based on selected position
  const departmentOptions =
    formData?.position === "Hotel Admin"
      ? ADMIN_DEPARTMENT_OPTIONS
      : STAFF_DEPARTMENT_OPTIONS;

  return (
    <ModalFormSection title="Employment Information">
      <ModalFormGrid columns={2}>
        <Select
          label="Position"
          value={formData?.position || ""}
          onChange={(e) => onFieldChange?.("position", e.target.value)}
          options={POSITION_OPTIONS}
          placeholder="Select position"
          error={errors.position}
          required
          disabled={isDisabled}
        />
        <Select
          label="Department"
          value={formData?.department || ""}
          onChange={(e) => onFieldChange?.("department", e.target.value)}
          options={departmentOptions}
          placeholder="Select department"
          error={errors.department}
          required
          disabled={isDisabled}
        />
      </ModalFormGrid>
      {isEditMode && (
        <Select
          label="Status"
          value={formData?.status || ""}
          onChange={(e) => onFieldChange?.("status", e.target.value)}
          options={STATUS_OPTIONS}
          disabled={isDisabled}
        />
      )}
    </ModalFormSection>
  );
}
