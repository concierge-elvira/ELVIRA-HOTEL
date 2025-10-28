import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 hover:border-emerald-600 focus:ring-emerald-300 shadow-md hover:shadow-lg",
  secondary:
    "bg-gray-200 hover:bg-gray-300 text-gray-700 border-gray-200 hover:border-gray-300 focus:ring-gray-400 shadow-sm hover:shadow-md",
  danger:
    "bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 focus:ring-red-300 shadow-md hover:shadow-lg",
  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-700 border-transparent hover:border-gray-300 focus:ring-gray-300",
  outline:
    "bg-transparent hover:bg-emerald-50 text-emerald-600 border-emerald-300 hover:border-emerald-400 focus:ring-emerald-300 shadow-sm hover:shadow-md",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-3xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

  const widthStyle = fullWidth ? "w-full" : "";

  const combinedClassName =
    `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();

  return (
    <button
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
