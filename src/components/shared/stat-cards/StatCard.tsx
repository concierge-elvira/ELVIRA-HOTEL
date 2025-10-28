interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  icon,
  variant = "default",
  loading = false,
}: StatCardProps) {
  const variantStyles = {
    default: "text-gray-900",
    primary: "text-emerald-600",
    success: "text-green-600",
    warning: "text-orange-600",
    danger: "text-red-600",
    info: "text-blue-600",
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            {title}
          </div>
          <div className={`text-3xl font-bold ${variantStyles[variant]}`}>
            {value}
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
