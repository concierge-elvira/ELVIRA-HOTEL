import { Input } from "./Input";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  disabled = false,
  fullWidth = true,
}: SearchBoxProps) {
  const searchIcon = (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  const clearIcon =
    value && onClear ? (
      <button
        type="button"
        onClick={onClear}
        className="hover:text-gray-600 focus:outline-none"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    ) : null;

  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      fullWidth={fullWidth}
      leftIcon={searchIcon}
      rightIcon={clearIcon}
    />
  );
}
