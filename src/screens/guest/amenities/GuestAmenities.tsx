import React, { useState, useMemo } from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";
import { SearchFilterBar } from "../shared/search-filter";
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
}

export const GuestAmenities: React.FC<GuestAmenitiesProps> = ({
  onNavigate,
  currentPath = "/guest/amenities",
}) => {
  const { guestSession } = useGuestAuth();
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
        });
        return acc;
      },
      {}
    );
  }, [amenities, searchQuery]);

  const handleAmenityClick = (itemId: string) => {
    const amenity = amenities?.find((a) => a.id === itemId);
    if (amenity) {
      setSelectedAmenity(amenity);
      setIsDetailOpen(true);
    }
  };

  const handleBook = (amenityId: string) => {
    console.log("Book amenity:", amenityId);
    // TODO: Implement booking functionality
    setIsDetailOpen(false);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedAmenity(null);
  };

  const handleAddItem = (itemId: string) => {
    console.log("Request amenity:", itemId);
    // TODO: Handle amenity request
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
      headerSlot={
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => {
            // Handle filter click
            console.log("Filter clicked");
          }}
          placeholder="Search amenities..."
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
