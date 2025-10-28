interface OrderFieldProps {
  label: string;
  value: string | number | null | undefined;
  className?: string;
}

export function OrderField({ label, value, className = "" }: OrderFieldProps) {
  return (
    <div className={`flex justify-between items-start ${className}`}>
      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-gray-900 font-medium text-right">
        {value || "N/A"}
      </span>
    </div>
  );
}
