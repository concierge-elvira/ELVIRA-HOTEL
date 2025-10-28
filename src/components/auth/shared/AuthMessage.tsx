interface AuthMessageProps {
  message: string;
  type?: "error" | "success" | "info";
}

export function AuthMessage({ message, type = "error" }: AuthMessageProps) {
  const styles = {
    error: "bg-red-50 text-red-700 border border-red-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
  };

  return (
    <div className={`p-3 rounded-lg text-sm ${styles[type]}`}>{message}</div>
  );
}
