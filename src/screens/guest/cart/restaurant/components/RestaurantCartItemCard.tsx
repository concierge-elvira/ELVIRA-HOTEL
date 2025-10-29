/**
 * Restaurant Cart Item Card
 *
 * Card for menu items with quantity controls
 */

import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

interface RestaurantCartItemCardProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}

export const RestaurantCartItemCard: React.FC<RestaurantCartItemCardProps> = ({
  id,
  name,
  price,
  quantity,
  imageUrl,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const itemTotal = price * quantity;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Item Image */}
        <div className="shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {name}
              </h3>
              <p className="text-xs text-gray-500">Menu Item</p>
            </div>
            <button
              onClick={() => onRemove(id)}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* Quantity Controls */}
              <button
                onClick={() => onDecrement(id)}
                className="w-6 h-6 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3 text-gray-600" />
              </button>

              <span className="text-sm font-medium text-gray-900 min-w-6 text-center">
                {quantity}
              </span>

              <button
                onClick={() => onIncrement(id)}
                className="w-6 h-6 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="text-sm font-semibold text-emerald-600">
                ${itemTotal.toFixed(2)}
              </p>
              {quantity > 1 && (
                <p className="text-xs text-gray-500">
                  ${price.toFixed(2)} each
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
