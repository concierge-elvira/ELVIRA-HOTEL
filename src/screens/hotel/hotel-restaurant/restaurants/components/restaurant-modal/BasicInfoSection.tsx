import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../components/ui/modalform";
import { Input } from "../../../../../../components/ui";
import type { RestaurantFormData, FormErrors } from "./types";

interface BasicInfoSectionProps {
  formData: RestaurantFormData;
  errors: FormErrors;
  disabled: boolean;
  onChange: (field: keyof RestaurantFormData, value: string) => void;
}

export function BasicInfoSection({
  formData,
  errors,
  disabled,
  onChange,
}: BasicInfoSectionProps) {
  return (
    <ModalFormSection title="Basic Information">
      <ModalFormGrid columns={2}>
        <Input
          label="Restaurant Name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Enter restaurant name"
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />

        <Input
          label="Cuisine Type"
          value={formData.cuisine}
          onChange={(e) => onChange("cuisine", e.target.value)}
          placeholder="e.g., Italian, Chinese"
          disabled={disabled}
          error={errors.cuisine}
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
        />
      </ModalFormGrid>
    </ModalFormSection>
  );
}
