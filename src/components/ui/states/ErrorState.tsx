import type { ReactNode } from "react";
import { Button } from "../buttons";

interface ErrorStateProps {
  title?: string;
  message: string;
  actionText?: string;
  onRetry?: () => void;
  icon?: ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  actionText = "Try again",
  onRetry,
  icon,
}: ErrorStateProps) {
  const defaultIcon = (
    <svg
      className="w-12 h-12 text-red-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="mb-4">{icon || defaultIcon}</div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      <p className="text-gray-600 mb-6 max-w-sm">{message}</p>

      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
