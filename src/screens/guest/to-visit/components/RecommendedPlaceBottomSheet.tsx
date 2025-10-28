/**
 * Recommended Place Detail Bottom Sheet
 *
 * Displays full details of a hotel recommended place
 * Includes photo carousel for multiple images
 */

import React, { useState, useRef, useEffect } from "react";
import { GuestBottomSheet } from "../../shared/modals/base/GuestBottomSheet";
import { PhotoGalleryViewer } from "../../shared/photo-gallery/components";
import { MapPin, Navigation } from "lucide-react";
import type { Database } from "../../../../types/database";

type RecommendedPlace =
  Database["public"]["Tables"]["hotel_recommended_places"]["Row"] & {
    image_url?: string | null; // JSON string of image URLs array
  };

interface RecommendedPlaceBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  place: RecommendedPlace | null;
  hotelCoordinates?: {
    lat: number;
    lng: number;
  };
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

export const RecommendedPlaceBottomSheet: React.FC<
  RecommendedPlaceBottomSheetProps
> = ({ isOpen, onClose, place, hotelCoordinates }) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Parse image URLs from JSON string
  const imageUrls: string[] = React.useMemo(() => {
    if (!place?.image_url) return [];
    try {
      const parsed = JSON.parse(place.image_url);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [place?.image_url]);

  // Calculate distance if coordinates are available
  const distance: string | null = React.useMemo(() => {
    if (
      !place ||
      !hotelCoordinates ||
      place.latitud === null ||
      place.longitud === null
    ) {
      return null;
    }

    const distanceKm = calculateDistance(
      hotelCoordinates.lat,
      hotelCoordinates.lng,
      place.latitud,
      place.longitud
    );

    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m away`;
    } else {
      return `${distanceKm.toFixed(1)}km away`;
    }
  }, [place, hotelCoordinates]);

  // Build Google Maps URL
  const googleMapsUrl = React.useMemo(() => {
    if (!place || place.latitud === null || place.longitud === null) {
      return null;
    }
    return `https://www.google.com/maps/search/?api=1&query=${place.latitud},${place.longitud}`;
  }, [place]);

  // Auto-scroll effect for thumbnails
  useEffect(() => {
    if (!scrollRef.current || imageUrls.length <= 1 || isPaused || !isOpen) {
      return;
    }

    const scrollContainer = scrollRef.current;
    const scrollSpeed = 0.3;
    let animationFrameId: number;

    const scroll = () => {
      if (!scrollContainer) return;

      scrollContainer.scrollLeft += scrollSpeed;

      // Reset scroll position when reaching the end
      if (
        scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth
      ) {
        scrollContainer.scrollLeft = 0;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [imageUrls.length, isPaused, isOpen]);

  // Auto-advance main image every 5 seconds
  useEffect(() => {
    if (imageUrls.length <= 1 || isPaused || !isOpen) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imageUrls.length, isPaused, isOpen]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };

  if (!place) {
    return null;
  }

  return (
    <>
      <GuestBottomSheet isOpen={isOpen} onClose={onClose}>
        <div className="pb-6">
          {/* Images Carousel or Single Image */}
          {imageUrls.length > 0 ? (
            <div className="relative">
              {/* Main Image */}
              <div
                className="relative w-full h-64 bg-gray-200 cursor-pointer"
                onClick={() => handleImageClick(currentImageIndex)}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
              >
                <img
                  src={imageUrls[currentImageIndex]}
                  alt={place.place_name}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                {/* Image Counter */}
                {imageUrls.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {imageUrls.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip with Auto-scroll */}
              {imageUrls.length > 1 && (
                <div className="relative">
                  {/* Left fade effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />

                  {/* Right fade effect */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

                  <div
                    ref={scrollRef}
                    className="flex gap-2 p-4 overflow-x-auto scrollbar-hide"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                  >
                    {imageUrls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          handleImageClick(index);
                        }}
                        className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === currentImageIndex
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <img
                          src={url}
                          alt={`${place.place_name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-64 bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-blue-300" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {place.place_name}
              </h2>
            </div>
                  {/* Description */}
                  {place.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        About this place
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {place.description}
                      </p>
                    </div>
                  )}

            {/* Address with Google Maps Link */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  {distance && (
                    <span className="flex items-center gap-1 text-xs font-medium text-blue-600">
                      <Navigation className="w-3.5 h-3.5" />
                      {distance}
                    </span>
                  )}
                </div>
                {googleMapsUrl ? (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    {place.address}
                  </a>
                ) : (
                  <p className="text-sm text-gray-600">{place.address}</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </GuestBottomSheet>

      {/* Photo Gallery Viewer */}
      {imageUrls.length > 0 && (
        <PhotoGalleryViewer
          images={imageUrls}
          initialIndex={selectedImageIndex}
          isOpen={viewerOpen}
          onClose={handleCloseViewer}
        />
      )}
    </>
  );
};
