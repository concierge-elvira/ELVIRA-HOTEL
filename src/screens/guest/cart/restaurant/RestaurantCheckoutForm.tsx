/**
 * Restaurant Checkout Form
 *
 * Form for ordering menu items with different fields based on service type
 * - Restaurant: Reservation Date, Reservation Time, Number of Guests, Table Preferences, Special Instructions
 * - Room Service: Delivery Date, Delivery Time, Special Instructions
 * Uses shared UI components for consistent styling
 */

import React, { useState } from "react";
import { Textarea } from "../../../../components/ui";
import type { RestaurantCartItem } from "../../../../contexts/guest/GuestCartContext";
import {
  RestaurantReservationFields,
  RoomServiceDeliveryFields,
  RestaurantOrderItems,
  RestaurantCheckoutActions,
} from "./components";

interface RestaurantCheckoutFormProps {
  cartItems: RestaurantCartItem[];
  serviceType: string;
  restaurantId?: string | null;
  restaurantName?: string;
  onSubmit: (data: RestaurantOrderData) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  onIncrement?: (id: string) => void;
  onDecrement?: (id: string) => void;
}

export interface RestaurantOrderData {
  items: Array<{ menuItemId: string; quantity: number; priceAtOrder: number }>;
  serviceType: string;
  restaurantId?: string;
  // Restaurant fields
  reservationDate?: string;
  reservationTime?: string;
  numberOfGuests?: number;
  tablePreferences?: string;
  // Room Service fields
  deliveryDate?: string;
  deliveryTime?: string;
  // Common field
  specialInstructions?: string;
}

export const RestaurantCheckoutForm: React.FC<RestaurantCheckoutFormProps> = ({
  cartItems,
  serviceType,
  restaurantId,
  restaurantName,
  onSubmit,
  onCancel,
  isSubmitting = false,
  onIncrement,
  onDecrement,
}) => {
  const isRestaurant = serviceType === "Restaurant";
  const isRoomService = serviceType === "Room Service";

  // Restaurant fields
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("2");
  const [tablePreferences, setTablePreferences] = useState("");

  // Room Service fields
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  // Common field
  const [specialInstructions, setSpecialInstructions] = useState("");

  const [errors, setErrors] = useState<{
    reservationDate?: string;
    reservationTime?: string;
    numberOfGuests?: string;
    deliveryDate?: string;
    deliveryTime?: string;
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
    const newErrors: {
      reservationDate?: string;
      reservationTime?: string;
      numberOfGuests?: string;
      deliveryDate?: string;
      deliveryTime?: string;
    } = {};

    if (isRestaurant) {
      if (!reservationDate) {
        newErrors.reservationDate = "Reservation date is required";
      }
      if (!reservationTime) {
        newErrors.reservationTime = "Reservation time is required";
      }
      if (!numberOfGuests || parseInt(numberOfGuests) < 1) {
        newErrors.numberOfGuests = "Number of guests is required";
      }
    }

    if (isRoomService) {
      if (!deliveryDate) {
        newErrors.deliveryDate = "Delivery date is required";
      }
      if (!deliveryTime) {
        newErrors.deliveryTime = "Delivery time is required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the order
    const orderData: RestaurantOrderData = {
      items: cartItems.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
        priceAtOrder: item.price,
      })),
      serviceType: serviceType,
      restaurantId: restaurantId || undefined,
      specialInstructions: specialInstructions || undefined,
    };

    if (isRestaurant) {
      orderData.reservationDate = reservationDate;
      orderData.reservationTime = reservationTime;
      orderData.numberOfGuests = parseInt(numberOfGuests);
      orderData.tablePreferences = tablePreferences || undefined;
    }

    if (isRoomService) {
      orderData.deliveryDate = deliveryDate;
      orderData.deliveryTime = deliveryTime;
    }

    onSubmit(orderData);
  };

  const handleReservationDateChange = (value: string) => {
    setReservationDate(value);
    setErrors((prev) => ({ ...prev, reservationDate: undefined }));
  };

  const handleReservationTimeChange = (value: string) => {
    setReservationTime(value);
    setErrors((prev) => ({ ...prev, reservationTime: undefined }));
  };

  const handleNumberOfGuestsChange = (value: string) => {
    setNumberOfGuests(value);
    setErrors((prev) => ({ ...prev, numberOfGuests: undefined }));
  };

  const handleDeliveryDateChange = (value: string) => {
    setDeliveryDate(value);
    setErrors((prev) => ({ ...prev, deliveryDate: undefined }));
  };

  const handleDeliveryTimeChange = (value: string) => {
    setDeliveryTime(value);
    setErrors((prev) => ({ ...prev, deliveryTime: undefined }));
  };

  return (
    <div className="px-6 pt-4 pb-6">
      {/* Cart Items */}
      <RestaurantOrderItems
        items={cartItems}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selected Restaurant Display (for Restaurant service type) */}
        {isRestaurant && restaurantName && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-emerald-900">
              Restaurant: {restaurantName}
            </p>
          </div>
        )}

        {/* Restaurant Fields */}
        {isRestaurant && (
          <RestaurantReservationFields
            reservationDate={reservationDate}
            reservationTime={reservationTime}
            numberOfGuests={numberOfGuests}
            tablePreferences={tablePreferences}
            onReservationDateChange={handleReservationDateChange}
            onReservationTimeChange={handleReservationTimeChange}
            onNumberOfGuestsChange={handleNumberOfGuestsChange}
            onTablePreferencesChange={setTablePreferences}
            errors={errors}
          />
        )}

        {/* Room Service Fields */}
        {isRoomService && (
          <RoomServiceDeliveryFields
            deliveryDate={deliveryDate}
            deliveryTime={deliveryTime}
            onDeliveryDateChange={handleDeliveryDateChange}
            onDeliveryTimeChange={handleDeliveryTimeChange}
            errors={errors}
          />
        )}

        {/* Special Instructions (Optional) - Common for both */}
        <Textarea
          label="Special Instructions (Optional)"
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          placeholder="Dietary restrictions, allergies, special requests..."
          rows={4}
        />

        {/* Form Actions */}
        <RestaurantCheckoutActions
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          totalItems={totalItems}
          totalPrice={totalPrice}
        />
      </form>
    </div>
  );
};
