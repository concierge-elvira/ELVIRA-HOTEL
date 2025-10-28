import { Select } from "../../../../../../components/ui";

interface StatusFilterProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export function StatusFilter({
  statusFilter,
  onStatusFilterChange,
}: StatusFilterProps) {
  const statusOptions = [
    { value: "All Statuses", label: "All Statuses" },
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Status:</span>
      <Select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        options={statusOptions}
        className="w-32"
      />
    </div>
  );
}
