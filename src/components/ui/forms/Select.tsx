import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  fullWidth = true,
  className = "",
  ...props
}: SelectProps) {
  const hasError = !!error;

  const selectStyles = `
    block w-full px-3 py-2 border rounded-xl shadow-sm
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    transition-colors duration-200 bg-white
    ${
      hasError
        ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
    }
  `;

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <select className={`${selectStyles} ${className}`.trim()} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
