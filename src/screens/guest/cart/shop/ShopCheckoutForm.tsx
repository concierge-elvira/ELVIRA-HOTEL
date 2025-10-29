/**
 * Shop Checkout Form
 *
 * Form for ordering shop products with delivery date, time, and special instructions
 * Uses shared UI components for consistent styling
 */

import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Input, Textarea } from "../../../../components/ui";
import { GuestButton } from "../../../../components/guest/shared/buttons";
import { MenuItemCard } from "../../shared/cards/menu-item";
import type { ShopCartItem } from "../../../../contexts/guest/GuestCartContext";

interface ShopCheckoutFormProps {
  cartItems: ShopCartItem[];
  onSubmit: (data: ShopOrderData) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  onIncrement?: (id: string) => void;
  onDecrement?: (id: string) => void;
}

export interface ShopOrderData {
  items: Array<{ productId: string; quantity: number; priceAtOrder: number }>;
  deliveryDate: string;
  deliveryTime: string;
  specialInstructions: string;
}

export const ShopCheckoutForm: React.FC<ShopCheckoutFormProps> = ({
  cartItems,
  onSubmit,
  onCancel,
  isSubmitting = false,
  onIncrement,
  onDecrement,
}) => {
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [errors, setErrors] = useState<{
    deliveryDate?: string;
  }>({});

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { deliveryDate?: string } = {};

    if (!deliveryDate) {
      newErrors.deliveryDate = "Delivery date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the order
    onSubmit({
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        priceAtOrder: item.price,
      })),
      deliveryDate,
      deliveryTime,
      specialInstructions,
    });
  };

  return (
    <div className="px-6 pt-4 pb-6">
      {/* Cart Items */}
      <div className="space-y-3 mb-6">
        {cartItems.map((item) => (
          <MenuItemCard
            key={item.id}
            id={item.id}
            title={item.name}
            description={item.description || ""}
            price={item.price}
            imageUrl={item.imageUrl}
            quantity={item.quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onCardClick={() => {}} // Disable card click in checkout
          />
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Delivery Date */}
        <Input
          type="date"
          label="Delivery Date"
          value={deliveryDate}
          onChange={(e) => {
            setDeliveryDate(e.target.value);
            setErrors((prev) => ({ ...prev, deliveryDate: undefined }));
          }}
          error={errors.deliveryDate}
          leftIcon={<Calendar className="w-4 h-4" />}
          required
          min={new Date().toISOString().split("T")[0]}
          placeholder="dd/mm/aaaa"
        />

        {/* Delivery Time (Optional) */}
        <Input
          type="time"
          label="Delivery Time (Optional)"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
          leftIcon={<Clock className="w-4 h-4" />}
          placeholder="--:--"
        />

        {/* Special Instructions (Optional) */}
        <Textarea
          label="Special Instructions (Optional)"
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          placeholder="Any special requests or preferences..."
          rows={4}
        />

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <GuestButton
            variant="outline"
            size="md"
            onClick={onCancel}
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </GuestButton>
          <GuestButton
            variant="primary"
            size="md"
            type="submit"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : `Submit Order (${totalItems}) • $${totalPrice.toFixed(2)}`}
          </GuestButton>
        </div>
      </form>
    </div>
  );
};
