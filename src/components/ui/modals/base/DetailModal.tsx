import { ReactNode } from "react";
import { Modal, Button } from "../index";

interface DetailModalProps {
  // Modal props
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
  
  // Mode
  mode: "view" | "edit" | "create";
  
  // Header (for view mode)
  header?: ReactNode;
  
  // Content
  children: ReactNode;
  
  // Footer actions
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  
  // Loading states
  isSaving?: boolean;
  isDeleting?: boolean;
  
  // Button labels
  saveLabel?: string;
  cancelLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  closeLabel?: string;
  
  // Button variants
  deleteVariant?: "danger" | "outline";
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  size = "lg",
  mode,
  header,
  children,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  isSaving = false,
  isDeleting = false,
  saveLabel,
  cancelLabel = "Cancel",
  editLabel = "Edit",
  deleteLabel = "Delete",
  closeLabel = "Close",
  deleteVariant = "outline",
}: DetailModalProps) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  // Determine save button label
  const getSaveLabel = () => {
    if (saveLabel) return saveLabel;
    if (isSaving) return isEditMode ? "Updating..." : "Creating...";
    return isEditMode ? "Update" : "Create";
  };

  // Build footer content
  const footer = (
    <div className="flex justify-between w-full">
      {/* Left side - Delete button (view mode only) */}
      <div>
        {isViewMode && onDelete && (
          <Button
            type="button"
            variant={deleteVariant}
            onClick={onDelete}
            disabled={isDeleting}
            className={
              deleteVariant === "outline"
                ? "text-gray-700 hover:bg-gray-100 border-gray-300"
                : ""
            }
          >
            {isDeleting ? "Deleting..." : deleteLabel}
          </Button>
        )}
      </div>

      {/* Right side - Action buttons */}
      <div className="flex gap-3">
        {isViewMode && (
          <>
            <Button type="button" variant="outline" onClick={onClose}>
              {closeLabel}
            </Button>
            {onEdit && (
              <Button type="button" variant="primary" onClick={onEdit}>
                {editLabel}
              </Button>
            )}
          </>
        )}

        {(isEditMode || isCreateMode) && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel || onClose}
              disabled={isSaving}
            >
              {cancelLabel}
            </Button>
            {onSave && (
              <Button
                type="button"
                variant="primary"
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
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
                {getSaveLabel()}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={footer}
    >
      {/* Header Section (View Mode Only) */}
      {isViewMode && header && (
        <div className="pb-4 border-b mb-4">{header}</div>
      )}

      {/* Content */}
      {children}
    </Modal>
  );
}
