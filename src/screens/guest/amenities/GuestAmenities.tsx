import React, { useState, useMemo } from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";
import { SearchFilterBar } from "../shared/search-filter";
import { MenuCategorySection } from "../shared/cards/menu-item";
import { useAnnouncements } from "../../../hooks/announcements/useAnnouncements";
import { useGuestAmenities } from "../../../hooks/guest-management/amenities";
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
          badge: amenity.recommended ? "Recommended" : undefined,
        });
        return acc;
      },
      {}
    );
  }, [amenities, searchQuery]);

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
            />
          ))}
        </>
      )}
    </GuestPageLayout>
  );
};
