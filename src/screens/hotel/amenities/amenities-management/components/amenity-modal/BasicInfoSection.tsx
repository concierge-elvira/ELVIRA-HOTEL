import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../components/ui/modalform";
import { Input, Select } from "../../../../../../components/ui";
import type { AmenityFormData, FormErrors, ModalMode } from "./types";

interface BasicInfoSectionProps {
  formData: AmenityFormData;
  errors: FormErrors;
  mode: ModalMode;
  onChange: (field: keyof AmenityFormData, value: string) => void;
  categories: string[];
}

export function BasicInfoSection({
  formData,
  errors,
  mode,
  onChange,
  categories,
}: BasicInfoSectionProps) {
  const disabled = mode === "view";

  return (
    <ModalFormSection title="Basic Information">
      <ModalFormGrid columns={2}>
        <Input
          label="Amenity Name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          error={errors.name}
          disabled={disabled}
          placeholder="Enter amenity name"
          required
        />

        <Input
          label="Price"
          type="number"
          value={formData.price}
          onChange={(e) => onChange("price", e.target.value)}
          error={errors.price}
          disabled={disabled}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />
      </ModalFormGrid>

      <Select
        label="Category"
        value={formData.category}
        onChange={(e) => onChange("category", e.target.value)}
        error={errors.category}
        disabled={disabled}
        required
        options={[
          { value: "", label: "Select a category" },
          ...categories.map((cat) => ({ value: cat, label: cat })),
        ]}
      />
    </ModalFormSection>
  );
}
