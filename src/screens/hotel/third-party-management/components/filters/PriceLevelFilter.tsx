interface PriceLevelFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const PRICE_LEVEL_OPTIONS = [
  { value: "all", label: "All Price Levels" },
  { value: "1", label: "$ - Inexpensive" },
  { value: "2", label: "$$ - Moderate" },
  { value: "3", label: "$$$ - Expensive" },
  { value: "4", label: "$$$$ - Very Expensive" },
];

export function PriceLevelFilter({ value, onChange }: PriceLevelFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">Price Level</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      >
        {PRICE_LEVEL_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
