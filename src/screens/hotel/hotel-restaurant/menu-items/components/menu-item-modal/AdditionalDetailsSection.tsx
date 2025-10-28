import { ModalFormSection } from "../../../../../../components/ui/modalform";
import {
  ItemRecommendedToggle,
  ItemCheckboxGroup,
  ItemMultiSelect,
} from "../../../../../../components/ui/forms";
import type { MenuItemFormData } from "./types";

interface AdditionalDetailsSectionProps {
  formData: MenuItemFormData;
  disabled: boolean;
  onChange: (field: keyof MenuItemFormData, value: string[] | boolean) => void;
  restaurants: Array<{ value: string; label: string }>;
  serviceTypeOptions: Array<{ value: string; label: string }>;
  dietaryOptions: string[];
}

export function AdditionalDetailsSection({
  formData,
  disabled,
  onChange,
  restaurants,
  serviceTypeOptions,
  dietaryOptions,
}: AdditionalDetailsSectionProps) {
  return (
    <ModalFormSection title="Additional Details">
      <div className="space-y-4">
        {/* Hotel Recommended Toggle */}
        <ItemRecommendedToggle
          value={formData.hotelRecommended}
          onChange={(value) => onChange("hotelRecommended", value)}
          disabled={disabled}
        />

        {/* Restaurants Multi-Select */}
        <ItemMultiSelect
          label="Available at Restaurants"
          value={formData.restaurantIds}
          onChange={(value) => onChange("restaurantIds", value)}
          options={restaurants}
          disabled={disabled}
          placeholder="Select restaurants"
        />

        {/* Service Types */}
        <ItemCheckboxGroup
          label="Service Types"
          options={serviceTypeOptions}
          selectedValues={formData.serviceTypes}
          onChange={(value) => onChange("serviceTypes", value)}
          disabled={disabled}
        />

        {/* Dietary Info */}
        <ItemCheckboxGroup
          label="Dietary Information"
          options={dietaryOptions.map((opt) => ({ value: opt, label: opt }))}
          selectedValues={formData.dietaryInfo}
          onChange={(value) => onChange("dietaryInfo", value)}
          disabled={disabled}
        />
      </div>
    </ModalFormSection>
  );
}
