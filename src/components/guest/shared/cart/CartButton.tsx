/**
 * Cart Button Component
 *
 * Floating cart button that appears when items are added
 * Shows cart icon with item count badge
 */

import React from "react";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
  visible?: boolean;
}

export const CartButton: React.FC<CartButtonProps> = ({
  itemCount,
  onClick,
  visible = true,
}) => {
  if (!visible || itemCount === 0) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-11 h-11 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
      aria-label={`View cart (${itemCount} items)`}
    >
      <ShoppingCart className="w-5 h-5 text-gray-700" />

      {/* Badge with item count */}
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">
        {itemCount}
      </span>
    </button>
  );
};
