import { Button } from "./Button";

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  title?: string;
}

export function IconButton({
  onClick,
  icon,
  variant = "ghost",
  size = "md",
  disabled = false,
  className = "",
  title,
}: IconButtonProps) {
  const sizeClass = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClass[size]} p-0 ${className}`}
      title={title}
    >
      {icon}
    </Button>
  );
}
