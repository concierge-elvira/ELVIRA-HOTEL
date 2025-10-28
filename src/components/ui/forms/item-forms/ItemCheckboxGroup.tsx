interface CheckboxOption {
  value: string;
  label: string;
}

interface ItemCheckboxGroupProps {
  label: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  hint?: string;
}

export function ItemCheckboxGroup({
  label,
  options,
  selectedValues,
  onChange,
  disabled = false,
  hint,
}: ItemCheckboxGroupProps) {
  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {hint && <span className="text-gray-400">({hint})</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              disabled={disabled}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 disabled:cursor-not-allowed"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
