import { Button } from "../buttons";

interface ModalFormActionsProps {
  mode: "create" | "edit" | "view";
  onCancel: () => void;
  onSubmit?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isPending?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
}

/**
 * ModalFormActions - Standardized action buttons for modal forms
 * Handles different button layouts based on mode (create/edit/view)
 */
export function ModalFormActions({
  mode,
  onCancel,
  onSubmit,
  onEdit,
  onDelete,
  isPending = false,
  submitLabel,
  cancelLabel = "Cancel",
  editLabel = "Edit",
  deleteLabel = "Delete",
}: ModalFormActionsProps) {
  // Default submit labels based on mode
  const defaultSubmitLabel =
    mode === "edit" ? "Update" : mode === "create" ? "Create" : "Save";
  const finalSubmitLabel = submitLabel || defaultSubmitLabel;

  if (mode === "view") {
    // View mode: Delete (left), Close and Edit (right)
    return (
      <>
        {onDelete && (
          <Button variant="secondary" onClick={onDelete} disabled={isPending}>
            {deleteLabel}
          </Button>
        )}
        <div className="flex gap-3 ml-auto">
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            Close
          </Button>
          {onEdit && (
            <Button variant="primary" onClick={onEdit} disabled={isPending}>
              {editLabel}
            </Button>
          )}
        </div>
      </>
    );
  }

  // Create/Edit mode: Cancel and Submit (right aligned)
  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={isPending}
        onClick={onSubmit}
      >
        {isPending ? (
          <>
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
            {mode === "edit" ? "Updating..." : "Creating..."}
          </>
        ) : (
          finalSubmitLabel
        )}
      </Button>
    </>
  );
}
