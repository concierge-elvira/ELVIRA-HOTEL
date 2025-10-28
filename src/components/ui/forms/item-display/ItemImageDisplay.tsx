import { StatusBadge } from "../../badges";

interface ItemImageDisplayProps {
  imageUrl: string | null;
  itemName: string;
  price: number;
  isActive: boolean;
  onStatusToggle?: (newStatus: boolean) => void;
  priceLabel?: string;
}

export function ItemImageDisplay({
  imageUrl,
  itemName,
  price,
  isActive,
  onStatusToggle,
  priceLabel = "Price",
}: ItemImageDisplayProps) {
  return (
    <div className="relative h-48 w-full rounded-lg overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={itemName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400"
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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Price Badge - Bottom Left */}
      <div className="absolute bottom-3 left-3">
        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
          <p className="text-xs text-gray-600 font-medium">{priceLabel}</p>
          <p className="text-lg font-bold text-gray-900">${price.toFixed(2)}</p>
        </div>
      </div>

      {/* Status Badge - Top Right */}
      {onStatusToggle && (
        <div className="absolute top-3 right-3">
          <StatusBadge
            status={isActive ? "active" : "inactive"}
            onToggle={async (newStatus: boolean) => {
              onStatusToggle(newStatus);
            }}
          />
        </div>
      )}
    </div>
  );
}
