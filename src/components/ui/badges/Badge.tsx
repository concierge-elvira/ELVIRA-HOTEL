interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "outline";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-emerald-100 text-emerald-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-orange-100 text-orange-800",
    danger: "bg-red-100 text-red-800",
    outline: "bg-white text-gray-700 border border-gray-300",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
