interface RecommendedToggleProps {
  isRecommended: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Reusable recommended star toggle button
 * Used across third-party places, amenities, restaurants, and hotel shop
 */
export function RecommendedToggle({
  isRecommended,
  onToggle,
  disabled = false,
  size = "md",
}: RecommendedToggleProps) {
  const sizeClasses = {
    sm: "w-5 h-5 p-1",
    md: "w-6 h-6 p-1.5",
    lg: "w-7 h-7 p-2",
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onToggle();
        }
      }}
      disabled={disabled}
      className={`rounded-md transition-colors ${sizeClasses[size]} ${
        isRecommended
          ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
          : "text-gray-400 bg-gray-50 hover:bg-gray-100"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      title={
        disabled
          ? "Cannot toggle recommendation"
          : isRecommended
          ? "Remove recommendation"
          : "Mark as recommended"
      }
    >
      <svg
        className="w-full h-full"
        fill={isRecommended ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </button>
  );
}
