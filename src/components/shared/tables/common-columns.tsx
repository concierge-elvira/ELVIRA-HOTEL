import { StatusBadge } from "../../ui";
import type { TableColumn } from "../../ui";

/**
 * Creates a reusable status column with toggle functionality
 */
export function createStatusColumn<T extends Record<string, unknown>>(
  onStatusUpdate: (id: string, newStatus: boolean) => Promise<void>
): TableColumn<T> {
  return {
    key: "status",
    label: "Status",
    sortable: true,
    render: (_value, row) => (
      <StatusBadge
        status={(row as any).isActive ? "active" : "inactive"}
        onToggle={async (newStatus) => {
          await onStatusUpdate((row as any).id, newStatus);
        }}
      />
    ),
  };
}

/**
 * Creates a reusable image column
 */
export function createImageColumn<T extends Record<string, unknown>>(
  altText: string = "Item"
): TableColumn<T> {
  return {
    key: "imageUrl",
    label: "Image",
    sortable: false,
    render: (value) => (
      <div className="flex items-center justify-center">
        {value ? (
          <img
            src={value as string}
            alt={altText}
            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
    ),
  };
}

/**
 * Creates a reusable name column with star/recommended toggle
 */
export function createNameWithStarColumn<T extends Record<string, unknown>>(
  nameKey: string,
  label: string,
  onRecommendedToggle: (id: string, currentValue: boolean) => void
): TableColumn<T> {
  return {
    key: nameKey,
    label,
    sortable: true,
    render: (_value, row) => (
      <div className="flex items-center gap-2">
        <span>{String((row as any)[nameKey])}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRecommendedToggle(
              (row as any).id,
              !!(row as any).hotelRecommended
            );
          }}
          className="text-base hover:scale-110 transition-transform cursor-pointer"
          title={
            (row as any).hotelRecommended
              ? "Remove from recommended"
              : "Mark as recommended"
          }
        >
          {(row as any).hotelRecommended ? "⭐" : "☆"}
        </button>
      </div>
    ),
  };
}
