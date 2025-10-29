/**
 * Shop Cart Bottom Sheet
 *
 * Displays shop products in the cart with quantity controls
 */

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { GuestBottomSheet } from "../../shared/modals/GuestBottomSheet";
import { useGuestCart } from "../../../../contexts/guest";
import { MenuItemCard } from "../../shared/cards/menu-item";
import { GuestButton } from "../../../../components/guest/shared/buttons";
import { ShopCheckoutForm, type ShopOrderData } from "./ShopCheckoutForm";
import { createShopOrder } from "../../../../services/guest";

interface ShopCartBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopCartBottomSheet: React.FC<ShopCartBottomSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const { shopCart, incrementShopItem, decrementShopItem, clearShopCart } =
    useGuestCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate totals
  const totalItems = shopCart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = shopCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setShowCheckoutForm(true);
  };

  const handleSubmitOrder = async (data: ShopOrderData) => {
    setIsSubmitting(true);

    try {
      const result = await createShopOrder({
        items: data.items,
        deliveryDate: data.deliveryDate,
        deliveryTime: data.deliveryTime || undefined,
        specialInstructions: data.specialInstructions || undefined,
      });

      if (result.success) {
        // Clear cart and close
        clearShopCart();
        setShowCheckoutForm(false);
        onClose();

        // TODO: Show success notification
        console.log("✅ Shop order submitted successfully");
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
  if (showCheckoutForm && shopCart.length > 0) {
    return (
      <GuestBottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title="Checkout"
        maxHeight="90vh"
      >
        <ShopCheckoutForm
          cartItems={shopCart}
          onSubmit={handleSubmitOrder}
          onCancel={handleCancelCheckout}
          isSubmitting={isSubmitting}
          onIncrement={incrementShopItem}
          onDecrement={decrementShopItem}
        />
      </GuestBottomSheet>
    );
  }

  return (
    <GuestBottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="Shop Cart"
      maxHeight="90vh"
    >
      <div className="px-6 pt-4 pb-6">
        {/* Cart Summary Header */}
        {shopCart.length > 0 && (
          <div className="mb-4 pb-3 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              {totalItems} item{totalItems !== 1 ? "s" : ""} • $
              {totalPrice.toFixed(2)} total
            </p>
          </div>
        )}

        {/* Empty State */}
        {shopCart.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500">
              Browse our shop and add products to get started!
            </p>
          </div>
        )}

        {/* Cart Items */}
        {shopCart.length > 0 && (
          <div className="space-y-3 mb-6">
            {shopCart.map((item) => (
              <MenuItemCard
                key={item.id}
                id={item.id}
                title={item.name}
                description={item.description || ""}
                price={item.price}
                imageUrl={item.imageUrl}
                quantity={item.quantity}
                onIncrement={incrementShopItem}
                onDecrement={decrementShopItem}
                onCardClick={() => {}} // Disable card click in cart
              />
            ))}
          </div>
        )}

        {/* Checkout Button */}
        {shopCart.length > 0 && (
          <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
            <GuestButton fullWidth size="md" onClick={handleCheckout}>
              Continue to Checkout • ${totalPrice.toFixed(2)}
            </GuestButton>
          </div>
        )}
      </div>
    </GuestBottomSheet>
  );
};
