import {
  ModalFormSection,
  ModalFormGrid,
  Select,
} from "../../../../../../../components/ui";
import type { AbsenceSectionProps } from "./types";

const REQUEST_TYPE_OPTIONS = [
  { value: "", label: "Select request type" },
  { value: "vacation", label: "Vacation" },
  { value: "sick", label: "Sick Leave" },
  { value: "personal", label: "Personal" },
  { value: "training", label: "Training" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

/**
 * AbsenceTypeSection - Request type and status fields
 * Uses form inputs for all modes (create/edit/view)
 * Hotel Staff cannot edit status field
 */
export function AbsenceTypeSection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
  isHotelStaff = false,
}: AbsenceSectionProps) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isDisabled = disabled || isViewMode;

  console.log("[AbsenceTypeSection] Props:", {
    mode,
    isHotelStaff,
    status: formData?.status,
  });

  // Hotel Staff cannot edit status - show it as read-only text
  const shouldShowStatusDropdown = isEditMode && !isHotelStaff;
  const shouldShowStatusReadOnly = isEditMode && isHotelStaff;

  // Get status label
  const getStatusLabel = (status: string) => {
    const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
    return statusOption?.label || status;
  };

  return (
    <ModalFormSection title="Request Type">
      <ModalFormGrid columns={isEditMode ? 2 : 1}>
        <Select
          label="Request Type"
          value={formData?.requestType || ""}
          onChange={(e) => onFieldChange?.("requestType", e.target.value)}
          options={REQUEST_TYPE_OPTIONS}
          error={errors.requestType}
          required
          disabled={isDisabled}
        />

        {shouldShowStatusDropdown && (
          <Select
            label="Status"
            value={formData?.status || "pending"}
            onChange={(e) => onFieldChange?.("status", e.target.value)}
            options={STATUS_OPTIONS}
            disabled={isDisabled}
          />
        )}

        {shouldShowStatusReadOnly && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-700">
              {getStatusLabel(formData?.status || "pending")}
            </div>
            <p className="text-xs text-gray-500">
              Only managers can change the status
            </p>
          </div>
        )}
      </ModalFormGrid>
    </ModalFormSection>
  );
}
