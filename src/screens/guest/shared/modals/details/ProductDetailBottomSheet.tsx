/**
 * Product Detail Bottom Sheet
 *
 * Displays full details of a shop product
 * with quantity counter and add to cart functionality
 */

import React from "react";
import { GuestBottomSheet } from "../base/GuestBottomSheet";
import { Package, Plus } from "lucide-react";
import { useGuestCart } from "../../../../../contexts/guest/GuestCartContext";
import { GuestButton } from "../../../../../components/guest/shared/buttons/GuestButton";
import { QuantityControl } from "../../../../../components/guest/shared/buttons/QuantityControl";

export interface ProductDetailData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  stock_quantity: number | null;
  is_unlimited_stock: boolean;
  mini_bar: boolean;
  recommended: boolean;
}

interface ProductDetailBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetailData | null;
}

export const ProductDetailBottomSheet: React.FC<
  ProductDetailBottomSheetProps
> = ({ isOpen, onClose, product }) => {
  const {
    addToShopCart,
    incrementShopItem,
    decrementShopItem,
    getShopItemQuantity,
  } = useGuestCart();

  if (!product) return null;

  const quantity = getShopItemQuantity(product.id);

  const isOutOfStock =
    !product.is_unlimited_stock &&
    (product.stock_quantity === null || product.stock_quantity === 0);

  const handleAdd = () => {
    addToShopCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image_url || undefined,
    });
  };

  const handleIncrement = () => {
    incrementShopItem(product.id);
  };

  const handleDecrement = () => {
    decrementShopItem(product.id);
  };

  return (
    <GuestBottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="pb-24">
        {/* Image */}
        {product.image_url ? (
          <div className="relative w-full h-64 bg-gray-200">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.recommended && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Recommended
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-linear-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
            <Package className="w-16 h-16 text-emerald-300" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Price */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h2>
              <span className="text-2xl font-bold text-emerald-600">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500">{product.category}</p>
              {product.mini_bar && (
                <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                  Mini Bar
                </span>
              )}
            </div>
            <div className="mt-2">
              {product.is_unlimited_stock ? (
                <span className="text-sm font-medium text-emerald-600">
                  Always Available
                </span>
              ) : product.stock_quantity !== null ? (
                <span
                  className={`text-sm font-medium ${
                    product.stock_quantity > 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} in stock`
                    : "Out of stock"}
                </span>
              ) : null}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>

        {/* Fixed Bottom Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
          {quantity > 0 ? (
            <QuantityControl
              quantity={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              disabled={isOutOfStock}
            />
          ) : (
            <GuestButton
              fullWidth
              size="md"
              onClick={handleAdd}
              disabled={isOutOfStock}
            >
              <Plus className="w-5 h-5" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </GuestButton>
          )}
        </div>
      </div>
    </GuestBottomSheet>
  );
};
