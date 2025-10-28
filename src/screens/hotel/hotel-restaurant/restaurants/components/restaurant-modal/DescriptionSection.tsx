import { ModalFormSection } from "../../../../../../components/ui/modalform";
import { Textarea } from "../../../../../../components/ui";
import type { RestaurantFormData, FormErrors } from "./types";

interface DescriptionSectionProps {
  formData: RestaurantFormData;
  errors: FormErrors;
  disabled: boolean;
  onChange: (field: keyof RestaurantFormData, value: string) => void;
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
        placeholder="Enter restaurant description"
        disabled={disabled}
        error={errors.description}
        rows={3}
      />
    </ModalFormSection>
  );
}
