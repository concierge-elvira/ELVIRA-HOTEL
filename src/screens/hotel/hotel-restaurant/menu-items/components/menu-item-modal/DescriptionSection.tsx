import { ModalFormSection } from "../../../../../../components/ui/modalform";
import { Textarea } from "../../../../../../components/ui";
import type { MenuItemFormData, FormErrors } from "./types";

interface DescriptionSectionProps {
  formData: MenuItemFormData;
  errors: FormErrors;
  disabled: boolean;
  onChange: (field: keyof MenuItemFormData, value: string) => void;
}

export function DescriptionSection({
  formData,
  errors,
  disabled,
  onChange,
}: DescriptionSectionProps) {
  return (
    <ModalFormSection title="Description">
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Enter menu item description"
        disabled={disabled}
        error={errors.description}
        rows={3}
      />
    </ModalFormSection>
  );
}
