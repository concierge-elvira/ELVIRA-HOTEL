import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../components/ui/modalform";
import { Textarea } from "../../../../../../components/ui";
import type { AmenityFormData, FormErrors, ModalMode } from "./types";

interface DescriptionSectionProps {
  formData: AmenityFormData;
  errors: FormErrors;
  mode: ModalMode;
  onChange: (field: keyof AmenityFormData, value: string) => void;
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
          label="Description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          error={errors.description}
          disabled={disabled}
          placeholder="Enter amenity description"
          rows={4}
        />
      </ModalFormGrid>
    </ModalFormSection>
  );
}
