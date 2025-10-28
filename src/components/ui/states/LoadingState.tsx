import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({
  message = "Loading...",
  size = "md",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <LoadingSpinner size={size} />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}
