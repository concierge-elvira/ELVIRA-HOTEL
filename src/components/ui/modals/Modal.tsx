import type { ReactNode } from "react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  closeOnOverlayClick?: boolean;
  zIndex?: string;
}

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  "2xl": "max-w-6xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  zIndex = "z-50",
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 ${zIndex} overflow-y-auto`}>
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />

        {/* Modal */}
        <div
          className={`relative bg-white rounded-3xl shadow-xl w-full ${sizeStyles[size]} max-h-[90vh] flex flex-col transform transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          {/* Content - Scrollable */}
          <div className="p-6 overflow-y-auto flex-1 min-h-0">{children}</div>

          {/* Footer - Fixed at bottom */}
          {footer && (
            <div className="shrink-0 border-t border-gray-200 px-6 py-4 bg-white rounded-b-3xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
