/**
 * Menu Item Detail Bottom Sheet
 *
 * Displays full details of a menu item (restaurant/room service)
 * with quantity counter and add to cart functionality
 */

import React from "react";
import { GuestBottomSheet } from "../base/GuestBottomSheet";
import { Utensils, Plus } from "lucide-react";
import { useGuestCart } from "../../../../../contexts/guest/GuestCartContext";
import { GuestButton } from "../../../../../components/guest/shared/buttons/GuestButton";
import { QuantityControl } from "../../../../../components/guest/shared/buttons/QuantityControl";

export interface MenuItemDetailData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  hotel_recommended: boolean | null;
  service_type: string[] | null;
  special_type: string[] | null;
  restaurant_ids: string[] | null;
}

interface MenuItemDetailBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItemDetailData | null;
}

export const MenuItemDetailBottomSheet: React.FC<
  MenuItemDetailBottomSheetProps
> = ({ isOpen, onClose, item }) => {
  const {
    addToRestaurantCart,
    incrementRestaurantItem,
    decrementRestaurantItem,
    getRestaurantItemQuantity,
  } = useGuestCart();

  if (!item) return null;

  const quantity = getRestaurantItemQuantity(item.id);

  const handleAdd = () => {
    addToRestaurantCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.image_url || undefined,
    });
  };

  const handleIncrement = () => {
    incrementRestaurantItem(item.id);
  };

  const handleDecrement = () => {
    decrementRestaurantItem(item.id);
  };

  return (
    <GuestBottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="pb-24">
        {/* Image */}
        {item.image_url ? (
          <div className="relative w-full h-64 bg-gray-200">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {item.hotel_recommended && (
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
            <Utensils className="w-16 h-16 text-emerald-300" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Price */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
              <span className="text-2xl font-bold text-emerald-600">
                ${item.price.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>

          {/* Service Type & Special Type Tags */}
          {(item.service_type || item.special_type) && (
            <div className="flex flex-wrap gap-2">
              {item.service_type?.map((type, index) => (
                <span
                  key={`service-${index}`}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                >
                  {type}
                </span>
              ))}
              {item.special_type?.map((type, index) => (
                <span
                  key={`special-${index}`}
                  className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200"
                >
                  {type}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {item.description}
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
            />
          ) : (
            <GuestButton fullWidth size="md" onClick={handleAdd}>
              <Plus className="w-5 h-5" />
              Add to Cart
            </GuestButton>
          )}
        </div>
      </div>
    </GuestBottomSheet>
  );
};
