/**
 * Restaurant Checkout Form Actions
 *
 * Submit and Cancel buttons for the checkout form
 */

import React from "react";
import { GuestButton } from "../../../../../components/guest/shared/buttons";

interface RestaurantCheckoutActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  totalItems: number;
  totalPrice: number;
}

export const RestaurantCheckoutActions: React.FC<
  RestaurantCheckoutActionsProps
> = ({ onCancel, isSubmitting, totalItems, totalPrice }) => {
  return (
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
  );
};
