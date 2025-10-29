/**
 * Restaurant Order Items Display
 *
 * Shows the list of items in the order
 */

import React from "react";
import { MenuItemCard } from "../../../shared/cards/menu-item";
import type { RestaurantCartItem } from "../../../../../contexts/guest/GuestCartContext";

interface RestaurantOrderItemsProps {
  items: RestaurantCartItem[];
  onIncrement?: (id: string) => void;
  onDecrement?: (id: string) => void;
}

export const RestaurantOrderItems: React.FC<RestaurantOrderItemsProps> = ({
  items,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="space-y-3 mb-6">
      {items.map((item) => (
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
  );
};
