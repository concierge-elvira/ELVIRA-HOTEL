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
      className="relative flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors"
      aria-label={`View cart (${itemCount} items)`}
    >
      <ShoppingCart className="w-5 h-5 text-gray-700" />

      {/* Badge with item count */}
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center shadow-sm">
        {itemCount}
      </span>
    </button>
  );
};
