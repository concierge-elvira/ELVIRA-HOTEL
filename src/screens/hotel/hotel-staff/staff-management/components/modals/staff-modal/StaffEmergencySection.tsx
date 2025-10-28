import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../../components/ui/modalform";
import { Input } from "../../../../../../../components/ui";

interface StaffEmergencySectionProps {
  mode: "create" | "edit" | "view";
  formData?: {
    emergencyContactName: string;
    emergencyContactNumber: string;
  };
  onFieldChange?: (field: string, value: string) => void;
  disabled?: boolean;
}

export function StaffEmergencySection({
  mode,
  formData,
  onFieldChange,
  disabled = false,
}: StaffEmergencySectionProps) {
  const isViewMode = mode === "view";

  return (
    <ModalFormSection title="Emergency Contact">
      <ModalFormGrid columns={2}>
        <Input
          label="Emergency Contact Name"
          value={formData?.emergencyContactName || ""}
          onChange={(e) =>
            onFieldChange?.("emergencyContactName", e.target.value)
          }
          disabled={disabled || isViewMode}
          placeholder="Enter emergency contact name"
        />
        <Input
          label="Emergency Contact Number"
          type="tel"
          value={formData?.emergencyContactNumber || ""}
          onChange={(e) =>
            onFieldChange?.("emergencyContactNumber", e.target.value)
          }
          disabled={disabled || isViewMode}
          placeholder="Enter emergency contact number"
        />
      </ModalFormGrid>
    </ModalFormSection>
  );
}
