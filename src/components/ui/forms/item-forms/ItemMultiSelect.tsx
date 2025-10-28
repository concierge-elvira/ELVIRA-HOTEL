interface SelectOption {
  value: string;
  label: string;
}

interface ItemMultiSelectProps {
  label: string;
  options: SelectOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
  hint?: string;
  placeholder?: string;
}

export function ItemMultiSelect({
  label,
  options,
  selectedIds,
  onChange,
  disabled = false,
  hint,
  placeholder = "Select options",
}: ItemMultiSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    onChange(selectedOptions);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {hint && <span className="text-gray-400">({hint})</span>}
      </label>
      <select
        multiple
        value={selectedIds}
        onChange={handleChange}
        disabled={disabled}
        className="block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200 bg-white"
        size={4}
      >
        {options.length === 0 ? (
          <option disabled>{placeholder}</option>
        ) : (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
      {hint && (
        <p className="mt-1 text-xs text-gray-500">
          Hold Ctrl/Cmd to select multiple
        </p>
      )}
    </div>
  );
}
