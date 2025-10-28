/**
 * Menu Category Section Component
 *
 * Groups menu items by category with count badge
 */

import React from "react";
import { MenuItemCard } from "./MenuItemCard";
import type { MenuItemCardProps } from "./MenuItemCard";

interface MenuCategorySectionProps {
  categoryName: string;
  items: MenuItemCardProps[];
  onAddClick?: (id: string) => void;
}

export const MenuCategorySection: React.FC<MenuCategorySectionProps> = ({
  categoryName,
  items,
  onAddClick,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Category Header */}
      <div className="flex items-center gap-2 mb-3 px-4">
        <h2 className="text-lg font-bold text-gray-900">{categoryName}</h2>
        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      {/* Items Grid */}
      <div className="space-y-3 px-4">
        {items.map((item) => (
          <MenuItemCard key={item.id} {...item} onAddClick={onAddClick} />
        ))}
      </div>
    </div>
  );
};
