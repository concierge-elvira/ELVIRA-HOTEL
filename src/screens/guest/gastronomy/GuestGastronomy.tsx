import React, { useState, useMemo } from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";
import { SearchFilterBar } from "../shared/search-filter";
import { PlaceCategorySection } from "../shared/cards/place";
import { useAnnouncements } from "../../../hooks/announcements/useAnnouncements";
import { useGuestGastronomyPlaces } from "../../../hooks/guest-management/gastronomy";
import { PlaceDetailBottomSheet, type PlaceDetailData } from "../shared/modals";

interface GuestGastronomyProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
  onClockClick?: () => void;
}

export const GuestGastronomy: React.FC<GuestGastronomyProps> = ({
  onNavigate,
  currentPath = "/guest/gastronomy",
  onClockClick,
}) => {
  const { guestSession } = useGuestAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetailData | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: announcements } = useAnnouncements(
    guestSession?.guestData?.hotel_id
  );

  // Fetch approved gastronomy places
  const { data: gastronomyPlaces = [], isLoading } = useGuestGastronomyPlaces(
    guestSession?.guestData?.hotel_id
  );

  console.log(
    "🏨 [GuestGastronomy] Hotel ID:",
    guestSession?.guestData?.hotel_id
  );
  console.log("📍 [GuestGastronomy] Raw places data:", gastronomyPlaces);
  console.log("🔄 [GuestGastronomy] Loading:", isLoading);

  // Extract photo reference from Google Maps URLs
  const extractPhotoReference = (photoRef: string): string | null => {
    if (!photoRef) return null;

    // If it's already a clean reference (no http), return it
    if (!photoRef.startsWith("http")) {
      return photoRef;
    }

    // Try to extract from Google Maps JS API URL format
    const match = photoRef.match(/[?&]1s([^&]+)/);
    if (match && match[1]) {
      return match[1];
    }

    // Extract from photo_reference parameter
    const urlMatch = photoRef.match(/photo_reference=([^&]+)/);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }

    return null;
  };

  // Transform places to card format
  const places = useMemo(() => {
    console.log("🔄 [GuestGastronomy] Transforming places...");
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformed = gastronomyPlaces
      .map((item: any) => {
        const place = item.thirdparty_places;

        console.log("🔍 [GuestGastronomy] Processing item:", {
          item_id: item.id,
          has_place: !!place,
          place_name: place?.name,
          place_category: place?.category,
        });

        if (!place) return null;

        // Build Google Places photo URL
        let photoUrl: string | undefined = undefined;

        if (place.photo_reference) {
          const photoRef = extractPhotoReference(place.photo_reference);
          if (photoRef) {
            photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;
          }
        } else if (
          place.photos &&
          Array.isArray(place.photos) &&
          place.photos.length > 0
        ) {
          const firstPhoto = place.photos[0];
          if (firstPhoto.photo_reference) {
            const photoRef = extractPhotoReference(firstPhoto.photo_reference);
            if (photoRef) {
              photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;
            }
          }
        }

        return {
          id: place.id,
          title: place.name || "Unknown",
          description: place.vicinity || place.formatted_address || "",
          imageUrl: photoUrl,
          rating: place.rating || undefined,
          isRecommended: item.hotel_recommended || false,
        };
      })
      .filter(Boolean);

    console.log("✅ [GuestGastronomy] Transformed places:", transformed);
    console.log(
      "📊 [GuestGastronomy] Number of transformed places:",
      transformed.length
    );

    return transformed;
  }, [gastronomyPlaces]);

  // Filter by search query
  const filteredPlaces = useMemo(() => {
    if (!searchQuery.trim()) {
      return places;
    }

    const query = searchQuery.toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return places.filter(
      (place: any) =>
        place.title.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query)
    );
  }, [places, searchQuery]);

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

  const handlePlaceClick = (placeId: string) => {
    console.log("Place clicked:", placeId);
    // Find the full place data from gastronomyPlaces
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const placeData = gastronomyPlaces.find((item: any) => {
      const place = item.thirdparty_places;
      return place?.id === placeId;
    });

    if (placeData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const place = (placeData as any).thirdparty_places;

      // Transform thirdparty_places data to google_data format for the bottom sheet
      const googleData = {
        formatted_address: place.formatted_address,
        vicinity: place.vicinity,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        price_level: place.price_level,
        opening_hours: place.opening_hours,
        formatted_phone_number: place.formatted_phone_number,
        international_phone_number: place.international_phone_number,
        website: place.website,
        url: place.google_maps_url,
        photos: place.photos,
        photo_reference: place.photo_reference,
        business_status: place.business_status,
        types: place.types,
        reviews: place.reviews,
        geometry:
          place.latitude && place.longitude
            ? {
                location: {
                  lat: place.latitude,
                  lng: place.longitude,
                },
              }
            : undefined,
      };

      // Transform to PlaceDetailData format
      setSelectedPlace({
        id: place.id,
        name: place.name || "Unknown",
        google_data: googleData,
        recommended: placeData.hotel_recommended || false,
        type: place.category || "gastronomy",
        hotelCoordinates:
          hotelData.latitude && hotelData.longitude
            ? {
                lat: hotelData.latitude,
                lng: hotelData.longitude,
              }
            : undefined,
      });
      setIsDetailOpen(true);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedPlace(null);
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
            console.log("Filter clicked");
          }}
          placeholder="Search gastronomy places..."
        />
      }
    >
      {/* Gastronomy Places */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading gastronomy places...</p>
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery
              ? "No gastronomy places found matching your search."
              : "No gastronomy places available at the moment."}
          </p>
        </div>
      ) : (
        <>
          {/* Title Section */}
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-xl font-bold text-gray-900">
              Best Local Gastronomy Places
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Discover the finest dining experiences recommended by our hotel
            </p>
          </div>

          <PlaceCategorySection
            items={filteredPlaces}
            onItemClick={handlePlaceClick}
            showCategoryHeader={false}
          />
        </>
      )}

      {/* Place Detail Bottom Sheet */}
      <PlaceDetailBottomSheet
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        place={selectedPlace}
      />
    </GuestPageLayout>
  );
};
