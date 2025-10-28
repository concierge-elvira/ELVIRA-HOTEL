import React, { useState, useMemo } from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";
import { SearchFilterBar } from "../shared/search-filter";
import { MenuCategorySection } from "../shared/cards/menu-item";
import { useAnnouncements } from "../../../hooks/announcements/useAnnouncements";
import { useGuestProducts } from "../../../hooks/guest-management/shop";

interface GuestShopProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const GuestShop: React.FC<GuestShopProps> = ({
  onNavigate,
  currentPath = "/guest/shop",
}) => {
  const { guestSession } = useGuestAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: announcements } = useAnnouncements(
    guestSession?.guestData?.hotel_id
  );

  // Fetch active products for the hotel
  const { data: products = [], isLoading } = useGuestProducts(
    guestSession?.guestData?.hotel_id
  );

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, typeof products> = {};

    products.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  }, [products]);

  // Filter by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return productsByCategory;
    }

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, typeof products> = {};

    Object.entries(productsByCategory).forEach(([category, items]) => {
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
  }, [productsByCategory, searchQuery]);

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

  const handleAddItem = (itemId: string) => {
    console.log("Add product:", itemId);
    // Handle add to cart
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
      headerSlot={
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => {
            // Handle filter click
            console.log("Filter clicked");
          }}
          placeholder="Search products..."
        />
      }
    >
      {/* Product Categories */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : Object.keys(filteredCategories).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery
              ? "No products found matching your search."
              : "No products available at the moment."}
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
            }))}
            onAddClick={handleAddItem}
          />
        ))
      )}
    </GuestPageLayout>
  );
};
