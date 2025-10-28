interface ActionFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const ACTION_OPTIONS = [
  { value: "all", label: "All Places" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending Review" },
  { value: "recommended", label: "Recommended" },
];

export function ActionFilter({ value, onChange }: ActionFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">Status</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      >
        {ACTION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
