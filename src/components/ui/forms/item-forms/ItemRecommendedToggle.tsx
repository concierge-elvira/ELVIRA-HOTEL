interface ItemRecommendedToggleProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export function ItemRecommendedToggle({
  checked,
  disabled = false,
  onChange,
  label = "Hotel Recommended",
  description = "Feature this item as recommended",
}: ItemRecommendedToggleProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 disabled:cursor-not-allowed"
        />
        <div>
          <span className="text-sm text-gray-700">{description}</span>
        </div>
      </label>
    </div>
  );
}
