import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../components/ui/modalform";
import { Input, Select } from "../../../../../../components/ui";
import type { MenuItemFormData, FormErrors } from "./types";

interface BasicInfoSectionProps {
  formData: MenuItemFormData;
  errors: FormErrors;
  disabled: boolean;
  onChange: (field: keyof MenuItemFormData, value: string) => void;
  categories: string[];
}

export function BasicInfoSection({
  formData,
  errors,
  disabled,
  onChange,
  categories,
}: BasicInfoSectionProps) {
  return (
    <ModalFormSection title="Basic Information">
      <ModalFormGrid columns={2}>
        <Input
          label="Item Name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Enter item name"
          disabled={disabled}
          error={errors.name}
          required
          leftIcon={
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />

        <Input
          label="Price"
          type="number"
          value={formData.price}
          onChange={(e) => onChange("price", e.target.value)}
          placeholder="0.00"
          disabled={disabled}
          error={errors.price}
          required
          leftIcon={
            <span className="text-gray-400 text-sm font-medium">$</span>
          }
        />
      </ModalFormGrid>

      <Select
        label="Category"
        value={formData.category}
        onChange={(e) => onChange("category", e.target.value)}
        disabled={disabled}
        error={errors.category}
        required
        options={[
          { value: "", label: "Select a category" },
          ...categories.map((cat) => ({ value: cat, label: cat })),
        ]}
      />
    </ModalFormSection>
  );
}
