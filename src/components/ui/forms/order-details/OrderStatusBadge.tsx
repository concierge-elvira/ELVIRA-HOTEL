interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":
      case "preparing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "ready":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex px-3 py-1 text-xs font-semibold uppercase tracking-wide border rounded-full ${getStatusStyles(
        status
      )}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
