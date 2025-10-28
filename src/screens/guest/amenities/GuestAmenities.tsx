import React, { useState, useMemo } from "react";
import { useGuestAuth, useGuestCart } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";
import { SearchFilterBar } from "../shared/search-filter";
import { CartButton } from "../../../components/guest/shared/cart";
import { MenuCategorySection } from "../shared/cards/menu-item";
import { useAnnouncements } from "../../../hooks/announcements/useAnnouncements";
import { useGuestAmenities } from "../../../hooks/guest-management/amenities";
import {
  AmenityDetailBottomSheet,
  type AmenityDetailData,
} from "../shared/modals";
import type { MenuItemCardProps } from "../shared/cards/menu-item/MenuItemCard";

interface GuestAmenitiesProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
  onClockClick?: () => void;
}

export const GuestAmenities: React.FC<GuestAmenitiesProps> = ({
  onNavigate,
  currentPath = "/guest/amenities",
  onClockClick,
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

  const { data: announcements } = useAnnouncements(
    guestSession?.guestData?.hotel_id
  );

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

  const handleBook = (amenityId: string) => {
    const amenity = amenities?.find((a) => a.id === amenityId);
    if (amenity) {
      addToAmenityCart({
        id: amenity.id,
        name: amenity.name,
        price: amenity.price,
        imageUrl: amenity.image_url || undefined,
      });
    }
    setIsDetailOpen(false);
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

  const { guestData, hotelData } = guestSession;

  // Format announcements for ticker
  const activeAnnouncements =
    announcements
      ?.filter((a) => a.is_active)
      .map((a) => ({
        id: a.id,
        message: `${a.title} • ${a.description}`,
      })) || [];

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
          placeholder="Search amenities..."
          cartButton={
            <CartButton
              itemCount={amenityCartCount}
              onClick={() => console.log("View cart")}
            />
          }
        />
      }
    >
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
        onBook={handleBook}
      />
    </GuestPageLayout>
  );
};
