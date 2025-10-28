import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export function Textarea({
  label,
  error,
  hint,
  fullWidth = true,
  className = "",
  ...props
}: TextareaProps) {
  const hasError = !!error;

  const textareaStyles = `
    block w-full px-3 py-2 border rounded-xl shadow-sm
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    transition-colors duration-200 resize-vertical
    ${
      hasError
        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
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

      <textarea
        className={`${textareaStyles} ${className}`.trim()}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
