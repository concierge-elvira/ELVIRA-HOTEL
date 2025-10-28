/**
 * Guest Photo Gallery Hook
 *
 * Fetches photo gallery images from hotel settings
 * Includes real-time subscription for live updates
 */

import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";
import { useGuestRealtimeSubscription } from "../../realtime/useGuestRealtimeSubscription";

interface PhotoGalleryData {
  images: string[];
  title?: string;
  subtitle?: string;
}

/**
 * Fetch photo gallery data from hotel settings
 */
export function useGuestPhotoGallery(hotelId: string | undefined) {
  const query = useOptimizedQuery<PhotoGalleryData | null>({
    queryKey: ["guest-photo-gallery", hotelId],
    queryFn: async () => {
      if (!hotelId) {
        return null;
      }

      // Get guest-authenticated Supabase client
      const supabase = getGuestSupabaseClient();

      // Fetch hotel settings with setting_key = "hotel_photo_gallery"
      const { data, error } = await supabase
        .from("hotel_settings")
        .select("images_url")
        .eq("hotel_id", hotelId)
        .eq("setting_key", "hotel_photo_gallery")
        .maybeSingle();

      if (error) {
        console.error("Error fetching photo gallery:", error);
        return null;
      }

      if (!data || !data.images_url) {
        return null;
      }

      // Parse images_url - it could be JSON array or comma-separated string
      let images: string[] = [];

      try {
        // Try parsing as JSON first
        if (typeof data.images_url === "string") {
          const parsed = JSON.parse(data.images_url);
          images = Array.isArray(parsed) ? parsed : [parsed];
        } else if (Array.isArray(data.images_url)) {
          images = data.images_url;
        }
      } catch (e) {
        // If JSON parse fails, try comma-separated
        if (typeof data.images_url === "string") {
          images = data.images_url
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url.length > 0);
        }
      }

      // Filter out empty strings and invalid URLs
      images = images.filter((url) => url && url.startsWith("http"));

      if (images.length === 0) {
        return null;
      }

      return {
        images,
        title: "Photo Gallery",
        subtitle: "Discover our beautiful spaces and amenities",
      };
    },
    enabled: !!hotelId,
    config: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000,
    },
  });

  // Real-time subscription for live updates
  useGuestRealtimeSubscription({
    table: "hotel_settings",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: ["guest-photo-gallery", hotelId],
    enabled: !!hotelId,
  });

  return query;
}
