import React, { useState, useMemo } from "react";
import { useGuestAuth, useGuestCart } from "../../../contexts/guest";
import { MenuCategorySection } from "../shared/cards/menu-item";
import { useGuestMenuItems } from "../../../hooks/guest-management/restaurant";
import {
  MenuItemDetailBottomSheet,
  type MenuItemDetailData,
} from "../shared/modals";
import { GuestRestaurantHeader } from "./GuestRestaurantHeader";
import { RestaurantCartBottomSheet } from "../cart";

interface GuestRestaurantProps {
  onNavigate?: (path: string) => void;
}

export const GuestRestaurant: React.FC<GuestRestaurantProps> = ({
  onNavigate,
}) => {
  const { guestSession } = useGuestAuth();
  const {
    restaurantCartCount,
    addToRestaurantCart,
    incrementRestaurantItem,
    decrementRestaurantItem,
    getRestaurantItemQuantity,
    getRestaurantCartServiceType,
    canAddToRestaurantCart,
  } = useGuestCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<MenuItemDetailData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch active menu items for the hotel
  const { data: menuItems = [], isLoading } = useGuestMenuItems(
    guestSession?.guestData?.hotel_id
  );

  // Group menu items by category
  const menuItemsByCategory = useMemo(() => {
    const grouped: Record<string, typeof menuItems> = {};

    menuItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  }, [menuItems]);

  // Filter by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return menuItemsByCategory;
    }

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, typeof menuItems> = {};

    Object.entries(menuItemsByCategory).forEach(([category, items]) => {
      const filteredItems = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query)
      );

      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });

    return filtered;
  }, [menuItemsByCategory, searchQuery]);

  if (!guestSession) {
    return null;
  }

  const handleMenuItemClick = (itemId: string) => {
    const menuItem = menuItems.find((m) => m.id === itemId);
    if (menuItem) {
      setSelectedMenuItem(menuItem);
      setIsDetailOpen(true);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedMenuItem(null);
  };

  const handleAddItem = (itemId: string) => {
    const menuItem = menuItems.find((m) => m.id === itemId);
    if (menuItem) {
      // Check if item can be added based on service type
      if (!canAddToRestaurantCart(menuItem.service_type || undefined)) {
        const lockedType = getRestaurantCartServiceType();
        alert(
          `Cannot add this item. Your cart is locked to ${lockedType} items only. Please clear your cart to add items with a different service type.`
        );
        return;
      }

      addToRestaurantCart({
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description || undefined,
        price: menuItem.price,
        quantity: 1,
        imageUrl: menuItem.image_url || undefined,
        serviceType: menuItem.service_type || undefined,
        restaurantIds: menuItem.restaurant_ids || undefined,
      });
    }
  };

  return (
    <>
      {/* Search Bar with Cart */}
      <GuestRestaurantHeader
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={restaurantCartCount}
        onCartClick={() => setIsCartOpen(true)}
        onBackClick={() => onNavigate?.("/guest/home")}
      />

      {/* Menu Categories */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading menu...</p>
        </div>
      ) : Object.keys(filteredCategories).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery
              ? "No menu items found matching your search."
              : "No menu items available at the moment."}
          </p>
        </div>
      ) : (
        Object.entries(filteredCategories).map(([category, items]) => (
          <MenuCategorySection
            key={category}
            categoryName={category}
            items={items.map((item) => ({
              id: item.id,
              title: item.name,
              description: item.description || "",
              price: item.price,
              imageUrl: item.image_url || undefined,
              isRecommended: item.hotel_recommended || false,
              quantity: getRestaurantItemQuantity(item.id),
              disabled: !canAddToRestaurantCart(item.service_type || undefined),
            }))}
            onAddClick={handleAddItem}
            onCardClick={handleMenuItemClick}
            onIncrement={incrementRestaurantItem}
            onDecrement={decrementRestaurantItem}
          />
        ))
      )}

      {/* Menu Item Detail Bottom Sheet */}
      <MenuItemDetailBottomSheet
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedMenuItem}
      />

      {/* Restaurant Cart Bottom Sheet */}
      <RestaurantCartBottomSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};
