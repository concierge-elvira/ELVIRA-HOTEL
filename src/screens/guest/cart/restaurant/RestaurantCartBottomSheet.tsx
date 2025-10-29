/**
 * Restaurant Cart Bottom Sheet
 *
 * Displays menu items in the cart with quantity controls
 */

import React, { useState, useMemo, useEffect } from "react";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { GuestBottomSheet } from "../../shared/modals/GuestBottomSheet";
import { useGuestCart, useGuestAuth } from "../../../../contexts/guest";
import { MenuItemCard } from "../../shared/cards/menu-item";
import { GuestButton } from "../../../../components/guest/shared/buttons";
import {
  RestaurantCheckoutForm,
  type RestaurantOrderData,
} from "./RestaurantCheckoutForm";
import { ServiceTypeSelector, RestaurantSelector } from "./components";
import { createRestaurantOrder } from "../../../../services/guest";
import { useGuestRestaurants } from "../../../../hooks/guest-management/restaurant";

interface RestaurantCartBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RestaurantCartBottomSheet: React.FC<
  RestaurantCartBottomSheetProps
> = ({ isOpen, onClose }) => {
  const { guestSession } = useGuestAuth();
  const {
    restaurantCart,
    incrementRestaurantItem,
    decrementRestaurantItem,
    clearRestaurantCart,
  } = useGuestCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available restaurants
  const { data: restaurants = [] } = useGuestRestaurants(
    guestSession?.guestData?.hotel_id
  );

  // Determine available service types from cart items
  const availableServiceTypes = useMemo(() => {
    const typesSet = new Set<string>();

    restaurantCart.forEach((item) => {
      if (item.serviceType && item.serviceType.length > 0) {
        item.serviceType.forEach((type) => typesSet.add(type));
      } else {
        // Default to Restaurant if no service type specified
        typesSet.add("Restaurant");
      }
    });

    return Array.from(typesSet);
  }, [restaurantCart]);

  // Check if there are items with single service type that conflict
  const hasConflict = useMemo(() => {
    if (availableServiceTypes.length <= 1) return false;

    // Check if any item has only one service type (locked)
    return restaurantCart.some(
      (item) => item.serviceType && item.serviceType.length === 1
    );
  }, [restaurantCart, availableServiceTypes]);

  // Selected service type (user can choose if multiple available)
  const [selectedServiceType, setSelectedServiceType] = useState<string>(
    availableServiceTypes[0] || "Restaurant"
  );

  // Get available restaurants from cart items (for Restaurant service type only)
  const availableRestaurantIds = useMemo(() => {
    if (selectedServiceType !== "Restaurant") return [];

    const restaurantIdsSet = new Set<string>();

    restaurantCart.forEach((item) => {
      if (item.restaurantIds && item.restaurantIds.length > 0) {
        item.restaurantIds.forEach((id) => restaurantIdsSet.add(id));
      }
    });

    return Array.from(restaurantIdsSet);
  }, [restaurantCart, selectedServiceType]);

  // Filter restaurants that are in the cart
  const availableRestaurants = useMemo(() => {
    if (selectedServiceType !== "Restaurant") return [];
    return restaurants.filter((r) => availableRestaurantIds.includes(r.id));
  }, [restaurants, availableRestaurantIds, selectedServiceType]);

  // Selected restaurant (for Restaurant service type)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);

  // Auto-select restaurant if only one is available
  useEffect(() => {
    if (
      availableRestaurants.length === 1 &&
      selectedRestaurantId !== availableRestaurants[0].id
    ) {
      setSelectedRestaurantId(availableRestaurants[0].id);
    }
  }, [availableRestaurants, selectedRestaurantId]);

  // Calculate totals
  const totalItems = restaurantCart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalPrice = restaurantCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setShowCheckoutForm(true);
  };

  const handleSubmitOrder = async (data: RestaurantOrderData) => {
    setIsSubmitting(true);

    try {
      const result = await createRestaurantOrder({
        items: data.items,
        serviceType: data.serviceType,
        restaurantId: data.restaurantId,
        reservationDate: data.reservationDate,
        reservationTime: data.reservationTime,
        numberOfGuests: data.numberOfGuests,
        tablePreferences: data.tablePreferences,
        deliveryDate: data.deliveryDate,
        deliveryTime: data.deliveryTime,
        specialInstructions: data.specialInstructions,
      });

      if (result.success) {
        // Clear cart and close
        clearRestaurantCart();
        setShowCheckoutForm(false);
        setSelectedServiceType(availableServiceTypes[0] || "Restaurant");
        onClose();

        // TODO: Show success notification
        console.log("✅ Restaurant order submitted successfully");
      } else {
        // Show error notification
        console.error("❌ Failed to submit order:", result.error);
        alert(`Failed to submit order: ${result.error}`);
      }
    } catch (error) {
      console.error("❌ Error submitting order:", error);
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
    onClose();
  };

  // Show checkout form if user clicked checkout
  if (showCheckoutForm && restaurantCart.length > 0) {
    return (
      <GuestBottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title="Checkout"
        maxHeight="90vh"
      >
        <RestaurantCheckoutForm
          cartItems={restaurantCart}
          serviceType={selectedServiceType}
          restaurantId={selectedRestaurantId}
          restaurantName={
            selectedRestaurantId
              ? availableRestaurants.find((r) => r.id === selectedRestaurantId)
                  ?.name
              : undefined
          }
          onSubmit={handleSubmitOrder}
          onCancel={handleCancelCheckout}
          isSubmitting={isSubmitting}
          onIncrement={incrementRestaurantItem}
          onDecrement={decrementRestaurantItem}
        />
      </GuestBottomSheet>
    );
  }

  return (
    <GuestBottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="Restaurant Cart"
      maxHeight="90vh"
    >
      <div className="px-6 pt-4 pb-6">
        {/* Cart Summary Header */}
        {restaurantCart.length > 0 && (
          <div className="mb-4 pb-3 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              {totalItems} item{totalItems !== 1 ? "s" : ""} • $
              {totalPrice.toFixed(2)} total
            </p>
          </div>
        )}

        {/* Empty State */}
        {restaurantCart.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500">
              Browse our menu and add items to get started!
            </p>
          </div>
        )}

        {/* Cart Items */}
        {restaurantCart.length > 0 && (
          <div className="space-y-3 mb-6">
            {restaurantCart.map((item) => (
              <MenuItemCard
                key={item.id}
                id={item.id}
                title={item.name}
                description={item.description || ""}
                price={item.price}
                imageUrl={item.imageUrl}
                quantity={item.quantity}
                onIncrement={incrementRestaurantItem}
                onDecrement={decrementRestaurantItem}
                onCardClick={() => {}} // Disable card click in cart
              />
            ))}
          </div>
        )}

        {/* Service Type Selector */}
        {restaurantCart.length > 0 && availableServiceTypes.length > 1 && (
          <div className="mb-4">
            <ServiceTypeSelector
              selectedType={selectedServiceType}
              onTypeChange={setSelectedServiceType}
              availableTypes={availableServiceTypes}
            />

            {/* Warning if items have conflicting service types */}
            {hasConflict && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">
                    Service Type Notice
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Some items in your cart support both service types, while
                    others are limited to <strong>{selectedServiceType}</strong>{" "}
                    only. Your order will proceed as{" "}
                    <strong>{selectedServiceType}</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Restaurant Selector (only for Restaurant service type) */}
        {restaurantCart.length > 0 &&
          selectedServiceType === "Restaurant" &&
          availableRestaurants.length > 0 && (
            <div className="mb-4">
              <RestaurantSelector
                selectedRestaurantId={selectedRestaurantId}
                onRestaurantChange={setSelectedRestaurantId}
                availableRestaurants={availableRestaurants.map((r) => ({
                  id: r.id,
                  name: r.name,
                }))}
              />
            </div>
          )}

        {/* Checkout Button */}
        {restaurantCart.length > 0 && (
          <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
            <GuestButton
              fullWidth
              size="md"
              onClick={handleCheckout}
              disabled={
                selectedServiceType === "Restaurant" &&
                availableRestaurants.length > 1 &&
                !selectedRestaurantId
              }
            >
              {selectedServiceType === "Restaurant" &&
              availableRestaurants.length > 1 &&
              !selectedRestaurantId
                ? "Select a Restaurant to Continue"
                : `Continue to Checkout • $${totalPrice.toFixed(2)}`}
            </GuestButton>
          </div>
        )}
      </div>
    </GuestBottomSheet>
  );
};
