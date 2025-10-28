import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../components/ui/modalform";
import { ItemRecommendedToggle } from "../../../../../../components/ui/forms";
import type { ProductFormData, ModalMode } from "./types";

interface OptionsSectionProps {
  formData: ProductFormData;
  mode: ModalMode;
  onChange: (field: keyof ProductFormData, value: boolean) => void;
}

export function OptionsSection({
  formData,
  mode,
  onChange,
}: OptionsSectionProps) {
  const disabled = mode === "view";

  return (
    <ModalFormSection title="Product Options">
      <ModalFormGrid>
        <div className="col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={formData.miniBar}
              onChange={(e) => onChange("miniBar", e.target.checked)}
              disabled={disabled}
              className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded disabled:opacity-50"
            />
            Mini Bar Item
          </label>
        </div>

        <div className="col-span-2">
          <ItemRecommendedToggle
            checked={formData.recommended}
            disabled={disabled}
            onChange={(value) => onChange("recommended", value)}
          />
        </div>
      </ModalFormGrid>
    </ModalFormSection>
  );
}
