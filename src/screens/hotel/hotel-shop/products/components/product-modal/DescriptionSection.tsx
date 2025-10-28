import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../components/ui/modalform";
import { Textarea } from "../../../../../../components/ui";
import type { ProductFormData, FormErrors, ModalMode } from "./types";

interface DescriptionSectionProps {
  formData: ProductFormData;
  errors: FormErrors;
  mode: ModalMode;
  onChange: (field: keyof ProductFormData, value: string) => void;
}

export function DescriptionSection({
  formData,
  errors,
  mode,
  onChange,
}: DescriptionSectionProps) {
  const disabled = mode === "view";

  return (
    <ModalFormSection title="Description">
      <ModalFormGrid columns={1}>
        <Textarea
          label="Product Description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          error={errors.description}
          disabled={disabled}
          placeholder="Enter product description"
          rows={4}
        />
      </ModalFormGrid>
    </ModalFormSection>
  );
}
