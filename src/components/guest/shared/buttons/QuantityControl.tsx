/**
 * Quantity Control Component
 *
 * Reusable increment/decrement buttons for detail bottom sheets
 * Shows quantity counter with - and + buttons
 */

import React from "react";
import { Plus, Minus } from "lucide-react";

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrement}
        className="w-12 h-12 flex items-center justify-center bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors shadow-lg"
        aria-label="Decrease quantity"
      >
        <Minus size={20} />
      </button>
      <div className="flex-1 text-center">
        <span className="text-2xl font-bold text-gray-900">{quantity}</span>
        <p className="text-sm text-gray-500">in cart</p>
      </div>
      <button
        onClick={onIncrement}
        disabled={disabled}
        className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors shadow-lg ${
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-700 text-white"
        }`}
        aria-label="Increase quantity"
      >
        <Plus size={20} />
      </button>
    </div>
  );
};
