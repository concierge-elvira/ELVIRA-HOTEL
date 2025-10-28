import type { ReactNode } from "react";

interface ModalFormGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}

/**
 * ModalFormGrid - A responsive grid layout for form fields
 * Automatically adjusts from 1 column on mobile to specified columns on desktop
 */
export function ModalFormGrid({ children, columns = 2 }: ModalFormGridProps) {
  const gridClass =
    columns === 1
      ? "grid grid-cols-1 gap-4"
      : columns === 3
      ? "grid grid-cols-1 md:grid-cols-3 gap-4"
      : "grid grid-cols-1 md:grid-cols-2 gap-4";

  return <div className={gridClass}>{children}</div>;
}
