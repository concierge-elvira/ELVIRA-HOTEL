import React, { useState, useMemo } from "react";
import { useGuestAuth, useGuestCart } from "../../../contexts/guest";
import { GuestAmenitiesHeader } from "./GuestAmenitiesHeader";
import { MenuCategorySection } from "../shared/cards/menu-item";
import { useGuestAmenities } from "../../../hooks/guest-management/amenities";
import {
  AmenityDetailBottomSheet,
  type AmenityDetailData,
} from "../shared/modals";
import { AmenityCartBottomSheet } from "../cart";
import type { MenuItemCardProps } from "../shared/cards/menu-item/MenuItemCard";

interface GuestAmenitiesProps {
  onNavigate?: (path: string) => void;
}

export const GuestAmenities: React.FC<GuestAmenitiesProps> = ({
  onNavigate,
}) => {
  const { guestSession } = useGuestAuth();
  const {
    amenityCartCount,
    addToAmenityCart,
    isAmenityInCart,
    removeFromAmenityCart,
  } = useGuestCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAmenity, setSelectedAmenity] =
    useState<AmenityDetailData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: amenities, isLoading } = useGuestAmenities(
    guestSession?.guestData?.hotel_id
  );

  // Group amenities by category and filter by search query
  const categorizedAmenities = useMemo(() => {
    if (!amenities) return {};

    const filtered = amenities.filter((amenity) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        amenity.name.toLowerCase().includes(query) ||
        amenity.description?.toLowerCase().includes(query) ||
        amenity.category.toLowerCase().includes(query)
      );
    });

    return filtered.reduce<Record<string, MenuItemCardProps[]>>(
      (acc, amenity) => {
        const category = amenity.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push({
          id: amenity.id,
          title: amenity.name,
          description: amenity.description || "",
          price: amenity.price,
          imageUrl: amenity.image_url || undefined,
          isRecommended: amenity.recommended || false,
          isAdded: isAmenityInCart(amenity.id),
        });
        return acc;
      },
      {}
    );
  }, [amenities, searchQuery, isAmenityInCart]);

  const handleAmenityClick = (itemId: string) => {
    const amenity = amenities?.find((a) => a.id === itemId);
    if (amenity) {
      setSelectedAmenity(amenity);
      setIsDetailOpen(true);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedAmenity(null);
  };

  const handleAddItem = (itemId: string) => {
    const amenity = amenities?.find((a) => a.id === itemId);
    if (amenity) {
      addToAmenityCart({
        id: amenity.id,
        name: amenity.name,
        description: amenity.description || undefined,
        price: amenity.price,
        imageUrl: amenity.image_url || undefined,
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromAmenityCart(itemId);
  };

  if (!guestSession) {
    return null;
  }

  return (
    <>
      {/* Search Bar with Cart */}
      <GuestAmenitiesHeader
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={amenityCartCount}
        onCartClick={() => setIsCartOpen(true)}
        onBackClick={() => onNavigate?.("/guest/home")}
      />

      {isLoading ? (
        <div className="px-4 py-6 text-center text-gray-600">
          Loading amenities...
        </div>
      ) : Object.keys(categorizedAmenities).length === 0 ? (
        <div className="px-4 py-6 text-center text-gray-600">
          {searchQuery
            ? "No amenities found matching your search."
            : "No amenities available at this time."}
        </div>
      ) : (
        <>
          {Object.entries(categorizedAmenities).map(([category, items]) => (
            <MenuCategorySection
              key={category}
              categoryName={category}
              items={items}
              onAddClick={handleAddItem}
              onCardClick={handleAmenityClick}
              onRemoveClick={handleRemoveItem}
            />
          ))}
        </>
      )}

      {/* Amenity Detail Bottom Sheet */}
      <AmenityDetailBottomSheet
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        amenity={selectedAmenity}
      />

      {/* Amenity Cart Bottom Sheet */}
      <AmenityCartBottomSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};
