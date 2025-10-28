import React, { useState, useMemo } from "react";
import { useGuestAuth, useGuestCart } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";
import { SearchFilterBar } from "../shared/search-filter";
import { CartButton } from "../../../components/guest/shared/cart";
import { MenuCategorySection } from "../shared/cards/menu-item";
import { useAnnouncements } from "../../../hooks/announcements/useAnnouncements";
import { useGuestMenuItems } from "../../../hooks/guest-management/restaurant";
import {
  MenuItemDetailBottomSheet,
  type MenuItemDetailData,
} from "../shared/modals";

interface GuestRestaurantProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
  onClockClick?: () => void;
}

export const GuestRestaurant: React.FC<GuestRestaurantProps> = ({
  onNavigate,
  currentPath = "/guest/restaurant",
  onClockClick,
}) => {
  const { guestSession } = useGuestAuth();
  const {
    restaurantCartCount,
    addToRestaurantCart,
    incrementRestaurantItem,
    decrementRestaurantItem,
    getRestaurantItemQuantity,
  } = useGuestCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<MenuItemDetailData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: announcements } = useAnnouncements(
    guestSession?.guestData?.hotel_id
  );

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

  const { guestData, hotelData } = guestSession;

  // Format announcements for ticker
  const activeAnnouncements =
    announcements
      ?.filter((a) => a.is_active)
      .map((a) => ({
        id: a.id,
        message: `${a.title} • ${a.description}`,
      })) || [];

  const handleMenuItemClick = (itemId: string) => {
    const menuItem = menuItems.find((m) => m.id === itemId);
    if (menuItem) {
      setSelectedMenuItem(menuItem);
      setIsDetailOpen(true);
    }
  };

  const handleAddToCart = (menuItemId: string) => {
    const menuItem = menuItems.find((m) => m.id === menuItemId);
    if (menuItem) {
      addToRestaurantCart({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        imageUrl: menuItem.image_url || undefined,
      });
    }
    setIsDetailOpen(false);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedMenuItem(null);
  };

  const handleAddItem = (itemId: string) => {
    const menuItem = menuItems.find((m) => m.id === itemId);
    if (menuItem) {

      addToRestaurantCart({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        imageUrl: menuItem.image_url || undefined,
      });

    }
  };

  return (
    <GuestPageLayout
      guestName={guestData.guest_name}
      hotelName={hotelData.name}
      roomNumber={guestData.room_number}
      guestId={guestData.id}
      dndStatus={guestData.dnd_status}
      announcements={activeAnnouncements}
      currentPath={currentPath}
      onNavigate={onNavigate}
      onClockClick={onClockClick}
      headerSlot={
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => {
            // Handle filter click
            console.log("Filter clicked");
          }}
          placeholder="Search menu..."
          cartButton={
            <CartButton
              itemCount={restaurantCartCount}
              onClick={() => console.log("View cart")}
            />
          }
        />
      }
    >
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
        onAddToCart={handleAddToCart}
      />
    </GuestPageLayout>
  );
};
