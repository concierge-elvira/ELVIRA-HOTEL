import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const shadowStyles = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

export function Card({
  children,
  className = "",
  padding = "md",
  shadow = "sm",
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-3xl border border-gray-200 ${paddingStyles[padding]} ${shadowStyles[shadow]} ${className}`}
    >
      {children}
    </div>
  );
}
