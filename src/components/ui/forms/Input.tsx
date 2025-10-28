import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = "",
  ...props
}: InputProps) {
  const hasError = !!error;

  const inputStyles = `
    block w-full px-3 py-2 border rounded-full
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    transition-all duration-200
    placeholder:text-gray-400
    ${
      hasError
        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 shadow-sm"
        : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 shadow-md hover:shadow-lg focus:shadow-lg"
    }
    ${leftIcon ? "pl-10" : ""}
    ${rightIcon ? "pr-10" : ""}
  `;

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span
              className={`text-sm ${
                hasError ? "text-red-400" : "text-gray-400"
              }`}
            >
              {leftIcon}
            </span>
          </div>
        )}

        <input className={`${inputStyles} ${className}`.trim()} {...props} />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span
              className={`text-sm ${
                hasError ? "text-red-400" : "text-gray-400"
              }`}
            >
              {rightIcon}
            </span>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
