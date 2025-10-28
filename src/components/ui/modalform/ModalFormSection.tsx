import type { ReactNode } from "react";

interface ModalFormSectionProps {
  title: string;
  children: ReactNode;
}

/**
 * ModalFormSection - A section container with consistent title styling
 * Used to group related fields in a modal form or detail view
 */
export function ModalFormSection({ title, children }: ModalFormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2 pt-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
