import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../components/ui/modalform";
import { Input } from "../../../../../components/ui";
import type { EmergencyContactFormData, FormErrors, ModalMode } from "./types";

interface ContactInfoSectionProps {
  formData: EmergencyContactFormData;
  errors: FormErrors;
  mode: ModalMode;
  onChange: (field: keyof EmergencyContactFormData, value: string) => void;
}

export function ContactInfoSection({
  formData,
  errors,
  mode,
  onChange,
}: ContactInfoSectionProps) {
  const disabled = mode === "view";

  return (
    <ModalFormSection title="Contact Information">
      <ModalFormGrid columns={2}>
        <Input
          label="Contact Name"
          value={formData.contactName}
          onChange={(e) => onChange("contactName", e.target.value)}
          error={errors.contactName}
          disabled={disabled}
          placeholder="Enter contact name"
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => onChange("phoneNumber", e.target.value)}
          error={errors.phoneNumber}
          disabled={disabled}
          placeholder="+1 (555) 123-4567"
          required
        />
      </ModalFormGrid>
    </ModalFormSection>
  );
}
