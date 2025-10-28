import { ModalFormSection, Select } from "../../../../../../../components/ui";
import type { AbsenceSectionProps } from "./types";

/**
 * AbsenceBasicSection - Staff selection field
 * For Hotel Staff users: Shows their name (read-only)
 * For Managers/Admins: Shows dropdown to select any staff member
 */
export function AbsenceBasicSection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
  staffOptions = [],
  isLoadingStaff = false,
  isHotelStaff = false,
  currentUserName,
}: AbsenceSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  console.log("[AbsenceBasicSection] Props:", {
    isHotelStaff,
    currentUserName,
    mode,
    staffId: formData?.staffId,
  });

  // Hotel Staff should not see the dropdown in create or edit mode
  if (isHotelStaff && (mode === "create" || mode === "edit")) {
    return (
      <ModalFormSection title="Staff Information">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Staff Member
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-700">
            {currentUserName || "Current User"}
          </div>
          {mode === "create" && (
            <p className="text-xs text-gray-500">
              You can only create absence requests for yourself
            </p>
          )}
        </div>
      </ModalFormSection>
    );
  }

  return (
    <ModalFormSection title="Staff Information">
      <Select
        label="Staff Member"
        value={formData?.staffId || ""}
        onChange={(e) => onFieldChange?.("staffId", e.target.value)}
        options={staffOptions}
        error={errors.staffId}
        required
        disabled={isDisabled || isLoadingStaff}
      />
    </ModalFormSection>
  );
}
