/**
 * Guest Button Component
 *
 * Reusable button component for guest interface
 * Clean, modern design with emerald green theme
 */

import React from "react";

interface GuestButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const GuestButton: React.FC<GuestButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
  type = "button",
}) => {
  // Base styles
  const baseStyles =
    "font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  // Variant styles
  const variantStyles = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800",
    outline:
      "bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50 active:bg-emerald-100",
  };

  // Size styles
  const sizeStyles = {
    sm: "py-2 px-4 text-sm rounded-full",
    md: "py-2.5 px-6 text-base rounded-full",
    lg: "py-3 px-8 text-lg rounded-full",
  };

  // Width styles
  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
    >
      {children}
    </button>
  );
};
