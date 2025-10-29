/**
 * Amenity Cart Bottom Sheet
 *
 * Displays amenities in the cart
 * Simple selection (no quantity controls)
 * Only one amenity can be checked out at a time
 */

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { GuestBottomSheet } from "../../shared/modals/GuestBottomSheet";
import { useGuestCart } from "../../../../contexts/guest";
import { MenuItemCard } from "../../shared/cards/menu-item";
import { GuestButton } from "../../../../components/guest/shared/buttons";
import {
  AmenityCheckoutForm,
  type AmenityRequestData,
} from "./AmenityCheckoutForm";
import { createAmenityRequest } from "../../../../services/guest";

interface AmenityCartBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmenityCartBottomSheet: React.FC<AmenityCartBottomSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const { amenityCart, removeFromAmenityCart, clearAmenityCart } =
    useGuestCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [selectedAmenityId, setSelectedAmenityId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total
  const totalPrice = amenityCart.reduce((sum, item) => sum + item.price, 0);

  // Get the selected amenity for checkout
  const selectedAmenity = selectedAmenityId
    ? amenityCart.find((item) => item.id === selectedAmenityId) || null
    : amenityCart.length === 1
    ? amenityCart[0]
    : null;

  const handleSelectAmenity = (amenityId: string) => {
    setSelectedAmenityId(amenityId);
  };

  const handleCheckout = () => {
    if (amenityCart.length === 1) {
      setShowCheckoutForm(true);
    } else if (selectedAmenityId) {
      setShowCheckoutForm(true);
    }
  };

  const handleSubmitRequest = async (data: AmenityRequestData) => {
    setIsSubmitting(true);

    try {
      const result = await createAmenityRequest({
        amenityId: data.amenityId,
        requestDate: data.requestDate,
        preferredTime: data.preferredTime || undefined,
        specialInstructions: data.specialInstructions || undefined,
      });

      if (result.success) {
        // Clear cart and close
        clearAmenityCart();
        setShowCheckoutForm(false);
        setSelectedAmenityId(null);
        onClose();

        // TODO: Show success notification
        console.log("✅ Amenity request submitted successfully");
      } else {
        // Show error notification
        console.error("❌ Failed to submit request:", result.error);
        alert(`Failed to submit request: ${result.error}`);
      }
    } catch (error) {
      console.error("❌ Error submitting request:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelCheckout = () => {
    setShowCheckoutForm(false);
  };

  const handleClose = () => {
    setShowCheckoutForm(false);
    setSelectedAmenityId(null);
    onClose();
  };

  // Show checkout form if user clicked checkout
  if (showCheckoutForm && selectedAmenity) {
    return (
      <GuestBottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title="Request Service"
        maxHeight="90vh"
      >
        <AmenityCheckoutForm
          amenity={selectedAmenity}
          onSubmit={handleSubmitRequest}
          onCancel={handleCancelCheckout}
          isSubmitting={isSubmitting}
        />
      </GuestBottomSheet>
    );
  }

  return (
    <GuestBottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="Services Cart"
      maxHeight="90vh"
    >
      <div className="px-6 pt-4 pb-6">
        {/* Cart Summary Header */}
        {amenityCart.length > 0 && (
          <div className="mb-4 pb-3 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              {amenityCart.length} item{amenityCart.length !== 1 ? "s" : ""} • $
              {totalPrice.toFixed(2)} total
            </p>
            {amenityCart.length > 1 && (
              <p className="text-xs text-amber-600 mt-1">
                Please pick one service to proceed to checkout.
              </p>
            )}
          </div>
        )}

        {/* Empty State */}
        {amenityCart.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No amenities selected
            </h3>
            <p className="text-gray-500">
              Browse amenities and add items to get started!
            </p>
          </div>
        )}

        {/* Cart Items */}
        {amenityCart.length > 0 && (
          <div className="space-y-3 mb-6">
            {amenityCart.map((item) => (
              <div
                key={item.id}
                className={`relative transition-all ${
                  amenityCart.length > 1
                    ? "cursor-pointer hover:ring-2 hover:ring-emerald-500 rounded-r-2xl"
                    : ""
                } ${
                  selectedAmenityId === item.id
                    ? "ring-2 ring-emerald-500 rounded-r-2xl"
                    : ""
                }`}
                onClick={() => {
                  if (amenityCart.length > 1) {
                    handleSelectAmenity(item.id);
                  }
                }}
              >
                {/* Selection Indicator */}
                {amenityCart.length > 1 && selectedAmenityId === item.id && (
                  <div className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                <MenuItemCard
                  id={item.id}
                  title={item.name}
                  description={item.description || ""}
                  price={item.price}
                  imageUrl={item.imageUrl}
                  isAdded={true}
                  onRemoveClick={removeFromAmenityCart}
                  onCardClick={() => {}} // Disable card click in cart
                />
              </div>
            ))}
          </div>
        )}

        {/* Checkout Button */}
        {amenityCart.length > 0 && (
          <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
            <GuestButton
              fullWidth
              size="md"
              onClick={handleCheckout}
              disabled={amenityCart.length > 1 && !selectedAmenityId}
            >
              {amenityCart.length === 1
                ? `Continue to Checkout • $${totalPrice.toFixed(2)}`
                : selectedAmenityId
                ? `Continue with selected • $${selectedAmenity?.price.toFixed(
                    2
                  )}`
                : "Pick one service to continue"}
            </GuestButton>
          </div>
        )}
      </div>
    </GuestBottomSheet>
  );
};
