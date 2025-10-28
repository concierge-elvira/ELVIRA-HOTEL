/**
 * Place Detail Bottom Sheet
 *
 * Displays full details of a third-party place (gastronomy, tours, wellness)
 * Read-only with close button (no action button)
 */

import React from "react";
import { GuestBottomSheet } from "../base/GuestBottomSheet";
import {
  MapPin,
  Star,
  Phone,
  Globe,
  DollarSign,
  ExternalLink,
  MapPinned,
  Navigation,
} from "lucide-react";

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

export interface PlaceDetailData {
  id: string;
  name: string;
  google_data: {
    formatted_address?: string;
    vicinity?: string;
    rating?: number;
    user_ratings_total?: number;
    price_level?: number;
    opening_hours?: {
      weekday_text?: string[];
      open_now?: boolean;
    };
    formatted_phone_number?: string;
    international_phone_number?: string;
    website?: string;
    url?: string;
    photos?: Array<{
      photo_reference: string;
      width: number;
      height: number;
    }>;
    photo_reference?: string; // Primary photo reference (direct field)
    business_status?: string;
    types?: string[];
    reviews?: Array<{
      author_name: string;
      rating: number;
      text: string;
      time: number;
    }>;
    geometry?: {
      location: {
        lat: number;
        lng: number;
      };
    };
  };
  recommended: boolean;
  type: string;
  hotelCoordinates?: {
    // Optional hotel coordinates for distance calculation
    lat: number;
    lng: number;
  };
}

interface PlaceDetailBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  place: PlaceDetailData | null;
}

export const PlaceDetailBottomSheet: React.FC<PlaceDetailBottomSheetProps> = ({
  isOpen,
  onClose,
  place,
}) => {
  if (!place) {
    return null;
  }

  const googleData = place.google_data;

  // Extract photo reference from Google Maps URLs (same logic as cards)
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



  // Build photo URL - extract reference and rebuild URL (same as cards)
  let photoUrl: string | null = null;
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "";


  if (googleData.photo_reference) {
    const photoRef = extractPhotoReference(googleData.photo_reference);
    if (photoRef) {
      photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;

    }
  } else if (
    googleData.photos &&
    Array.isArray(googleData.photos) &&
    googleData.photos.length > 0
  ) {
    const firstPhoto = googleData.photos[0];
    if (firstPhoto.photo_reference) {
      const photoRef = extractPhotoReference(firstPhoto.photo_reference);
      if (photoRef) {
        photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;

      }
    }
  }



  // Calculate distance if hotel coordinates are provided
  let distance: string | null = null;
  if (place.hotelCoordinates && googleData.geometry?.location) {
    const distanceKm = calculateDistance(
      place.hotelCoordinates.lat,
      place.hotelCoordinates.lng,
      googleData.geometry.location.lat,
      googleData.geometry.location.lng
    );

    if (distanceKm < 1) {
      distance = `${Math.round(distanceKm * 1000)}m away`;
    } else {
      distance = `${distanceKm.toFixed(1)}km away`;
    }

    console.log("📍 [PlaceDetailBottomSheet] Distance:", distance);
  }

  const priceLevel = googleData.price_level
    ? "$".repeat(googleData.price_level)
    : null;

  return (
    <GuestBottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="pb-6">
        {/* Image */}
        {photoUrl ? (
          <div className="relative w-full h-64 bg-gray-200">
            <img
              src={photoUrl}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            {place.recommended && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Recommended
              </div>
            )}
            {googleData.opening_hours?.open_now !== undefined && (
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    googleData.opening_hours.open_now
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {googleData.opening_hours.open_now ? "Open Now" : "Closed"}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-linear-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-emerald-300" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Type */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {place.name}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200">
                {place.type}
              </span>
              {priceLevel && (
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  {priceLevel}
                </span>
              )}
              {googleData.business_status === "OPERATIONAL" && (
                <span className="text-sm text-emerald-600 font-medium">
                  ● Operational
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          {googleData.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-lg font-semibold text-gray-900">
                  {googleData.rating.toFixed(1)}
                </span>
              </div>
              {googleData.user_ratings_total && (
                <span className="text-sm text-gray-500">
                  ({googleData.user_ratings_total.toLocaleString()} reviews)
                </span>
              )}
            </div>
          )}

          {/* Address */}
          {googleData.formatted_address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  {distance && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <Navigation className="w-3.5 h-3.5" />
                      {distance}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {googleData.formatted_address}
                </p>
              </div>
            </div>
          )}

          {/* Phone */}
          {googleData.formatted_phone_number && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Phone</p>
                <a
                  href={`tel:${googleData.formatted_phone_number}`}
                  className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  {googleData.formatted_phone_number}
                </a>
              </div>
            </div>
          )}

          {/* Website */}
          {googleData.website && (
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Website
                </p>
                <a
                  href={googleData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline break-all"
                >
                  {googleData.website}
                </a>
              </div>
            </div>
          )}

          {/* Opening Hours */}
          {googleData.opening_hours?.weekday_text && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Opening Hours
              </h3>
              <div className="space-y-1">
                {googleData.opening_hours.weekday_text.map((day, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {day}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Google Maps Link */}
          {googleData.url && (
            <div className="flex items-start gap-3">
              <MapPinned className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  View on Google Maps
                </p>
                <a
                  href={googleData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  Open in Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Place Types */}
          {googleData.types && googleData.types.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {googleData.types.slice(0, 5).map((type, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {type.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {googleData.reviews && googleData.reviews.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Recent Reviews
              </h3>
              <div className="space-y-4">
                {googleData.reviews.slice(0, 3).map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">
                        {review.author_name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {review.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(review.time * 1000).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </GuestBottomSheet>
  );
};
