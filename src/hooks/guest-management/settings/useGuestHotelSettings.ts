/**
 * Guest Hotel Settings Hook
 *
 * Fetches hotel settings that control visibility of sections in guest app
 * Includes real-time subscription for live updates
 */

import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";
import { useGuestRealtimeSubscription } from "../../realtime/useGuestRealtimeSubscription";

interface GuestHotelSettings {
  aboutSectionEnabled: boolean;
  photoGalleryEnabled: boolean;
  dndEnabled: boolean;
  amenitiesEnabled: boolean;
  shopEnabled: boolean;
  restaurantEnabled: boolean;
  toursEnabled: boolean;
  localRestaurantsEnabled: boolean;
  chatEnabled: boolean;
}

const GUEST_HOTEL_SETTINGS_QUERY_KEY = "guest-hotel-settings";

/**
 * Fetch hotel settings for guest visibility controls
 */
export function useGuestHotelSettings(hotelId: string | undefined) {
  const query = useOptimizedQuery<GuestHotelSettings>({
    queryKey: [GUEST_HOTEL_SETTINGS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) {
        // Return default settings if no hotel ID
        return {
          aboutSectionEnabled: true,
          photoGalleryEnabled: true,
          dndEnabled: true,
          amenitiesEnabled: true,
          shopEnabled: true,
          restaurantEnabled: true,
          toursEnabled: true,
          localRestaurantsEnabled: true,
          chatEnabled: true,
        };
      }

      const supabase = getGuestSupabaseClient();

      // Fetch all settings for this hotel
      const { data, error } = await supabase
        .from("hotel_settings")
        .select("setting_key, setting_value")
        .eq("hotel_id", hotelId);

      if (error) {
        console.error("Error fetching guest hotel settings:", error);
        // Return defaults on error
        return {
          aboutSectionEnabled: true,
          photoGalleryEnabled: true,
          dndEnabled: true,
          amenitiesEnabled: true,
          shopEnabled: true,
          restaurantEnabled: true,
          toursEnabled: true,
          localRestaurantsEnabled: true,
          chatEnabled: true,
        };
      }

      // Map settings to visibility flags
      const settingsMap = new Map(
        data.map((s) => [s.setting_key, s.setting_value])
      );



      const result = {
        aboutSectionEnabled: settingsMap.get("about_section") !== false,
        photoGalleryEnabled: settingsMap.get("hotel_photo_gallery") !== false,
        dndEnabled: settingsMap.get("dnd") !== false,
        amenitiesEnabled: settingsMap.get("hotel_amenities") !== false,
        shopEnabled: settingsMap.get("hotel_shop") !== false,
        restaurantEnabled: settingsMap.get("room_service_restaurant") !== false,
        toursEnabled: settingsMap.get("tours_excursions") !== false,
        localRestaurantsEnabled: settingsMap.get("local_restaurants") !== false,
        chatEnabled: settingsMap.get("live_chat_support") !== false,
      };


      return result;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });

  // Real-time subscription for live updates
  useGuestRealtimeSubscription({
    table: "hotel_settings",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [GUEST_HOTEL_SETTINGS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}
