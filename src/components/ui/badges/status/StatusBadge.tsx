interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  colorMap?: Record<string, string>;
  showDot?: boolean;
  // Interactive props
  statusOptions?: string[];
  onStatusChange?: (newStatus: string) => Promise<void>;
  // Toggle props (for active/inactive)
  onToggle?: (newStatus: boolean) => Promise<void>;
  disabled?: boolean;
}

const defaultColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-gray-100 text-gray-800",
  on_leave: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
  completed: "bg-blue-100 text-blue-800",
  "in-progress": "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
  preparing: "bg-yellow-100 text-yellow-800",
  operational: "bg-emerald-100 text-emerald-800",
  closed_temporarily: "bg-yellow-100 text-yellow-800",
  unknown: "bg-gray-100 text-gray-800",
};

const dotColors: Record<string, string> = {
  active: "bg-emerald-600",
  inactive: "bg-gray-600",
  on_leave: "bg-red-600",
  pending: "bg-yellow-600",
  approved: "bg-emerald-600",
  rejected: "bg-red-600",
  cancelled: "bg-gray-600",
  completed: "bg-blue-600",
  "in-progress": "bg-blue-600",
  delivered: "bg-emerald-600",
  preparing: "bg-yellow-600",
  operational: "bg-emerald-600",
  closed_temporarily: "bg-yellow-600",
  unknown: "bg-gray-600",
};

export function StatusBadge({
  status,
  variant,
  colorMap = defaultColors,
  showDot = true,
  statusOptions,
  onStatusChange,
  onToggle,
  disabled = false,
}: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, "_");

  // Determine interaction type
  const isToggle = onToggle && (status === "active" || status === "inactive");
  const isCycle = statusOptions && statusOptions.length > 0 && onStatusChange;
  const isInteractive = isToggle || isCycle;

  // Handle toggle (active/inactive)
  const handleToggleClick = (e: React.MouseEvent) => {
    if (disabled || !onToggle) return;
    e.stopPropagation();

    const newStatus = status === "inactive";
    onToggle(newStatus).catch((error) => {
      console.error("Failed to toggle status:", error);
    });
  };

  // Handle cycle through statuses
  const handleCycleClick = (e: React.MouseEvent) => {
    if (disabled || !onStatusChange || !statusOptions) return;
    e.stopPropagation();

    const currentIndex = statusOptions.findIndex(
      (opt) =>
        opt.toLowerCase() === status.toLowerCase() ||
        opt.toLowerCase().replace(/\s+/g, "_") === normalizedStatus
    );

    const nextIndex = (currentIndex + 1) % statusOptions.length;
    const nextStatus = statusOptions[nextIndex];

    onStatusChange(nextStatus).catch((error) => {
      console.error("Failed to update status:", error);
    });
  };

  const getColorClass = () => {
    if (variant) {
      const variantColors = {
        default: "bg-gray-100 text-gray-800",
        success: "bg-emerald-100 text-emerald-800",
        warning: "bg-yellow-100 text-yellow-800",
        danger: "bg-red-100 text-red-800",
        info: "bg-blue-100 text-blue-800",
      };
      return variantColors[variant];
    }
    return colorMap[normalizedStatus] || defaultColors.active;
  };

  const getDotColor = () => {
    if (variant) {
      const variantDotColors = {
        default: "bg-gray-600",
        success: "bg-emerald-600",
        warning: "bg-yellow-600",
        danger: "bg-red-600",
        info: "bg-blue-600",
      };
      return variantDotColors[variant];
    }
    return dotColors[normalizedStatus] || dotColors.active;
  };

  const formatStatus = (str: string) => {
    return str.replace(/_/g, " ").replace(/-/g, " ").toUpperCase();
  };

  // Render interactive button
  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={isToggle ? handleToggleClick : handleCycleClick}
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${getColorClass()} ${
          !disabled
            ? "cursor-pointer hover:opacity-80"
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        {showDot && (
          <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
        )}
        {formatStatus(status)}
      </button>
    );
  }

  // Render read-only span
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass()}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
      )}
      {formatStatus(status)}
    </span>
  );
}
