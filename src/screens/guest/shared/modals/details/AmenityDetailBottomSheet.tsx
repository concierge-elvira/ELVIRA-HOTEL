/**
 * Amenity Detail Bottom Sheet
 *
 * Displays full details of an amenity
 * with add to cart functionality
 */

import React from "react";
import { GuestBottomSheet } from "../base/GuestBottomSheet";
import { MapPin, Plus, Check } from "lucide-react";
import { useGuestCart } from "../../../../../contexts/guest/GuestCartContext";
import { GuestButton } from "../../../../../components/guest/shared/buttons/GuestButton";

export interface AmenityDetailData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  recommended: boolean;
}

interface AmenityDetailBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  amenity: AmenityDetailData | null;
}

export const AmenityDetailBottomSheet: React.FC<
  AmenityDetailBottomSheetProps
> = ({ isOpen, onClose, amenity }) => {
  const { addToAmenityCart, removeFromAmenityCart, isAmenityInCart } =
    useGuestCart();

  if (!amenity) return null;

  const isAdded = isAmenityInCart(amenity.id);

  const handleToggle = () => {
    if (isAdded) {
      removeFromAmenityCart(amenity.id);
    } else {
      addToAmenityCart({
        ...amenity,
        description: amenity.description || undefined,
      });
    }
  };

  return (
    <GuestBottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="pb-24">
        {/* Image */}
        {amenity.image_url ? (
          <div className="relative w-full h-64 bg-gray-200">
            <img
              src={amenity.image_url}
              alt={amenity.name}
              className="w-full h-full object-cover"
            />
            {amenity.recommended && (
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
            <MapPin className="w-16 h-16 text-emerald-300" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Price */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {amenity.name}
              </h2>
              <span className="text-2xl font-bold text-emerald-600">
                ${amenity.price.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-500">{amenity.category}</p>
          </div>

          {/* Description */}
          {amenity.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {amenity.description}
              </p>
            </div>
          )}
        </div>

        {/* Fixed Bottom Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
          <GuestButton
            fullWidth
            size="md"
            onClick={handleToggle}
            variant={isAdded ? "secondary" : "primary"}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" />
                Added to Cart
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </GuestButton>
        </div>
      </div>
    </GuestBottomSheet>
  );
};
