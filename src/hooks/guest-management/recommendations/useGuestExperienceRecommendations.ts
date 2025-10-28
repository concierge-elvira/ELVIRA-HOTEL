/**
 * Guest Experience Recommendations Hook
 *
 * Fetches hotel-recommended third-party places for experiences
 */

import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { supabase } from "../../../services/supabase";
import type { RecommendedItem } from "../../../screens/guest/shared/recommended";

/**
 * Extract photo reference from Google Maps URLs
 * Handles both direct references and Google Maps JS API URLs
 */
function extractPhotoReference(photoRef: string): string | null {
  if (!photoRef) return null;

  // If it's already a clean reference (no http), return it
  if (!photoRef.startsWith("http")) {
    return photoRef;
  }

  // Try to extract from Google Maps JS API URL format
  // Format: https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1s{REFERENCE}&...
  const match = photoRef.match(/[?&]1s([^&]+)/);
  if (match && match[1]) {
    return match[1];
  }

  // If it's a proper Google Places API photo URL, extract the reference parameter
  const urlMatch = photoRef.match(/photo_reference=([^&]+)/);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }

  return null;
}

/**
 * Fetch recommended third-party places for experiences
 * Returns places that are both approved AND recommended by the hotel
 */
export function useGuestExperienceRecommendations(
  hotelId: string | undefined,
  limit: number = 10
) {
  return useOptimizedQuery<RecommendedItem[]>({
    queryKey: ["guest-experience-recommendations", hotelId, limit],
    queryFn: async () => {
      if (!hotelId) {
        return [];
      }

      // Fetch approved and recommended places from hotel_thirdparty_places
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("hotel_thirdparty_places")
        .select(
          `
          *,
          thirdparty_place:thirdparty_places (*)
        `
        )
        .eq("hotel_id", hotelId)
        .eq("hotel_approved", true)
        .eq("hotel_recommended", true);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      // Transform to RecommendedItem format
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items: RecommendedItem[] = (data as any[])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => item.thirdparty_place) // Ensure place data exists
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => {
          const place = item.thirdparty_place;

          // Build Google Places photo URL from photo_reference
          let photoUrl: string | undefined = undefined;
          const GOOGLE_API_KEY =
            import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "";

          if (place.photo_reference) {
            // Extract the actual photo reference token
            const photoRef = extractPhotoReference(place.photo_reference);

            if (photoRef) {
              // Build proper Google Places API photo URL
              photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;
            }
          } else if (
            place.photos &&
            Array.isArray(place.photos) &&
            place.photos.length > 0
          ) {
            // Try to get from photos array
            const firstPhoto = place.photos[0];
            if (firstPhoto.photo_reference) {
              const photoRef = extractPhotoReference(
                firstPhoto.photo_reference
              );

              if (photoRef) {
                photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;
              }
            }
          }

          // Capitalize first letter of category
          const categoryText = place.category || "experience";
          const capitalizedCategory =
            categoryText.charAt(0).toUpperCase() + categoryText.slice(1);

          return {
            id: place.id,
            title: place.name || "Unknown",
            description: place.vicinity || place.formatted_address || "",
            imageUrl: photoUrl,
            category: capitalizedCategory,
          };
        })
        // Randomize the order
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);

      return items;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });
}
