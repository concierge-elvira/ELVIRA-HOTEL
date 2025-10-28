import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../components/ui/modalform";
import { Input } from "../../../../../../components/ui";
import type { ProductFormData, FormErrors, ModalMode } from "./types";

interface StockSectionProps {
  formData: ProductFormData;
  errors: FormErrors;
  mode: ModalMode;
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

export function StockSection({
  formData,
  errors,
  mode,
  onChange,
}: StockSectionProps) {
  const disabled = mode === "view";

  return (
    <ModalFormSection title="Stock Management">
      <ModalFormGrid>
        <div className="col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={formData.isUnlimitedStock}
              onChange={(e) => onChange("isUnlimitedStock", e.target.checked)}
              disabled={disabled}
              className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded disabled:opacity-50"
            />
            Unlimited Stock
          </label>
        </div>

        {!formData.isUnlimitedStock && (
          <Input
            label="Stock Quantity"
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => onChange("stockQuantity", e.target.value)}
            error={errors.stockQuantity}
            disabled={disabled}
            placeholder="Enter stock quantity"
            min="0"
          />
        )}
      </ModalFormGrid>
    </ModalFormSection>
  );
}
