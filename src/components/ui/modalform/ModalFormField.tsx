import type { ReactNode } from "react";

interface ModalFormFieldProps {
  label: string;
  value: string | ReactNode;
  fullWidth?: boolean;
}

/**
 * ModalFormField - Display a read-only field in a detail view
 * Provides consistent label and value styling
 */
export function ModalFormField({
  label,
  value,
  fullWidth = false,
}: ModalFormFieldProps) {
  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
}
