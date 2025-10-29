import React, { useState, useMemo } from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { useGuestRecommendedPlaces } from "../../../hooks/guest-management/recommended-places";
import {
  RecommendedPlaceCard,
  RecommendedPlaceBottomSheet,
} from "./components";
import type { Database } from "../../../types/database";

type RecommendedPlace =
  Database["public"]["Tables"]["hotel_recommended_places"]["Row"] & {
    image_url?: string | null;
  };

interface GuestToVisitProps {
  onNavigate?: (path: string) => void;
}

export const GuestToVisit: React.FC<GuestToVisitProps> = ({ onNavigate }) => {
  const { guestSession } = useGuestAuth();
  const [selectedPlace, setSelectedPlace] = useState<RecommendedPlace | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch active recommended places
  const { data: recommendedPlaces = [], isLoading } = useGuestRecommendedPlaces(
    guestSession?.guestData?.hotel_id
  );

  // Parse image URLs for each place
  const placesWithImages = useMemo(() => {
    return recommendedPlaces.map((place) => {
      let imageUrls: string[] = [];
      if (place.image_url) {
        try {
          const parsed = JSON.parse(place.image_url);
          imageUrls = Array.isArray(parsed) ? parsed : [];
        } catch {
          imageUrls = [];
        }
      }
      return {
        ...place,
        imageUrls,
      };
    });
  }, [recommendedPlaces]);

  if (!guestSession) {
    return null;
  }

  const { hotelData } = guestSession;

  const handlePlaceClick = (placeId: string) => {
    const place = placesWithImages.find((p) => p.id === placeId);
    if (place) {
      setSelectedPlace(place);
      setIsDetailOpen(true);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedPlace(null);
  };

  // Hotel coordinates for distance calculation
  const hotelCoordinates =
    hotelData.latitude && hotelData.longitude
      ? {
          lat: hotelData.latitude,
          lng: hotelData.longitude,
        }
      : undefined;

  return (
    <>
      {/* Page Content */}
      <div className="px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <p className="text-gray-600">
            Discover amazing places and attractions recommended by our hotel
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading recommended places...</p>
          </div>
        ) : placesWithImages.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500">
              No recommended places available at the moment.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Check back later for curated recommendations.
            </p>
          </div>
        ) : (
          /* Places List */
          <div className="space-y-3 pb-20">
            {placesWithImages.map((place) => (
              <RecommendedPlaceCard
                key={place.id}
                id={place.id}
                placeName={place.place_name}
                address={place.address}
                description={place.description}
                imageUrls={place.imageUrls}
                onClick={handlePlaceClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Place Detail Bottom Sheet */}
      <RecommendedPlaceBottomSheet
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        place={selectedPlace}
        hotelCoordinates={hotelCoordinates}
      />
    </>
  );
};
