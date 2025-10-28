import type { ReactNode } from "react";
import { Modal } from "../modals";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * ModalForm - A consistent modal wrapper for forms and detail views
 * Provides consistent spacing and layout for all modal content
 */
export function ModalForm({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "lg",
}: ModalFormProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        footer ? (
          <div className="flex justify-between items-center gap-3">
            {footer}
          </div>
        ) : undefined
      }
    >
      <div className="space-y-4">{children}</div>
    </Modal>
  );
}
