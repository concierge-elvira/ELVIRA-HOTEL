interface DistanceFilterProps {
  value: number;
  onChange: (distance: number) => void;
  onMapClick?: () => void;
}

const DISTANCE_OPTIONS = [
  { value: 1, label: "1 km" },
  { value: 2, label: "2 km" },
  { value: 5, label: "5 km" },
  { value: 10, label: "10 km" },
  { value: 20, label: "20 km" },
  { value: 50, label: "50 km" },
  { value: 100, label: "100 km" },
  { value: 999999, label: "Any distance" },
];

export function DistanceFilter({ value, onChange }: DistanceFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">
        Distance from hotel:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      >
        {DISTANCE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
