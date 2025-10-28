interface SortIconProps {
  isActive: boolean;
  direction: "asc" | "desc";
}

export function SortIcon({ isActive, direction }: SortIconProps) {
  return (
    <svg
      className={`w-4 h-4 ml-1 transition-colors ${
        isActive ? "text-emerald-600" : "text-gray-400"
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {direction === "asc" ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      )}
    </svg>
  );
}