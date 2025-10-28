interface OrderItemRowProps {
  imageUrl: string | null;
  name: string;
  price: number;
  quantity: number;
}

export function OrderItemRow({
  imageUrl,
  name,
  price,
  quantity,
}: OrderItemRowProps) {
  const totalPrice = price * quantity;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      {/* Image */}
      <div className="shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
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

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate">{name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">
          ${price.toFixed(2)} × {quantity}
        </p>
      </div>

      {/* Total Price */}
      <div className="shrink-0">
        <p className="text-sm font-bold text-gray-900">
          ${totalPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
