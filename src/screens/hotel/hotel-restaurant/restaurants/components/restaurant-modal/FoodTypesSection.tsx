import { ModalFormSection } from "../../../../../../components/ui/modalform";
import { Button } from "../../../../../../components/ui";
import type { RestaurantFormData } from "./types";

interface FoodTypesSectionProps {
  formData: RestaurantFormData;
  disabled: boolean;
  onChange: (field: keyof RestaurantFormData, value: string | string[]) => void;
}

export function FoodTypesSection({
  formData,
  disabled,
  onChange,
}: FoodTypesSectionProps) {
  const handleAddFoodType = () => {
    const foodType = formData.foodTypesInput.trim();
    if (foodType && !formData.foodTypes.includes(foodType)) {
      onChange("foodTypes", [...formData.foodTypes, foodType]);
      onChange("foodTypesInput", "");
    }
  };

  const handleRemoveFoodType = (foodType: string) => {
    onChange(
      "foodTypes",
      formData.foodTypes.filter((ft) => ft !== foodType)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFoodType();
    }
  };

  return (
    <ModalFormSection title="Food Types (Optional)">
      {!disabled && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={formData.foodTypesInput}
            onChange={(e) => onChange("foodTypesInput", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Pasta, Pizza, Sushi"
            disabled={disabled}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-gray-400 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
          />
          <Button
            variant="outline"
            onClick={handleAddFoodType}
            disabled={disabled || !formData.foodTypesInput.trim()}
          >
            Add
          </Button>
        </div>
      )}

      {formData.foodTypes.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {formData.foodTypes.map((foodType) => (
            <span
              key={foodType}
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
            >
              {foodType}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveFoodType(foodType)}
                  className="hover:text-emerald-900 focus:outline-none"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No food types added</p>
      )}

      {!disabled && (
        <p className="mt-2 text-xs text-gray-500">
          Press Enter or click Add to add food types
        </p>
      )}
    </ModalFormSection>
  );
}
