/**
 * Amenity Checkout Form
 *
 * Form for requesting a single amenity with date, time, and special instructions
 * Uses shared UI components for consistent styling
 */

import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Input, Textarea } from "../../../../components/ui";
import { GuestButton } from "../../../../components/guest/shared/buttons";
import { MenuItemCard } from "../../shared/cards/menu-item";
import type { AmenityCartItem } from "../../../../contexts/guest/GuestCartContext";

interface AmenityCheckoutFormProps {
  amenity: AmenityCartItem;
  onSubmit: (data: AmenityRequestData) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface AmenityRequestData {
  amenityId: string;
  requestDate: string;
  preferredTime: string;
  specialInstructions: string;
}

export const AmenityCheckoutForm: React.FC<AmenityCheckoutFormProps> = ({
  amenity,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [requestDate, setRequestDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [errors, setErrors] = useState<{
    requestDate?: string;
    preferredTime?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { requestDate?: string; preferredTime?: string } = {};

    if (!requestDate) {
      newErrors.requestDate = "Request date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the request
    onSubmit({
      amenityId: amenity.id,
      requestDate,
      preferredTime,
      specialInstructions,
    });
  };

  return (
    <div className="px-6 pt-4 pb-6">
      {/* Amenity Summary */}
      <div className="mb-6">
        <MenuItemCard
          id={amenity.id}
          title={amenity.name}
          description={amenity.description || ""}
          price={amenity.price}
          imageUrl={amenity.imageUrl}
          isAdded={false}
          onCardClick={() => {}} // Disable card click in checkout
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Request Date */}
        <Input
          type="date"
          label="Request Date"
          value={requestDate}
          onChange={(e) => {
            setRequestDate(e.target.value);
            setErrors((prev) => ({ ...prev, requestDate: undefined }));
          }}
          error={errors.requestDate}
          leftIcon={<Calendar className="w-4 h-4" />}
          required
          min={new Date().toISOString().split("T")[0]}
          placeholder="dd/mm/aaaa"
        />

        {/* Preferred Time (Optional) */}
        <Input
          type="time"
          label="Preferred Time (Optional)"
          value={preferredTime}
          onChange={(e) => setPreferredTime(e.target.value)}
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
            {isSubmitting ? "Submitting..." : "Submit Request (1)"}
          </GuestButton>
        </div>
      </form>
    </div>
  );
};
