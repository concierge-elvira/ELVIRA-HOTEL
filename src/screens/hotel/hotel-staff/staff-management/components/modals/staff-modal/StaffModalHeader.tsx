import type { StaffModalHeaderProps } from "./types";

/**
 * Staff badge component for status display
 */
function StatusBadge({ status }: { status: string }) {
  const colors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-yellow-100 text-yellow-800",
    on_leave: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colors[status as keyof typeof colors] || colors.active
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
    </span>
  );
}

/**
 * StaffModalHeader - Header section for staff detail view
 * Displays staff name, employee ID, and status badge
 */
export function StaffModalHeader({
  fullName,
  employeeId,
  status,
}: StaffModalHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{fullName}</h3>
        <p className="text-sm text-gray-500 mt-1">{employeeId || "N/A"}</p>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}
