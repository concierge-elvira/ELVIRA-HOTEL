/**
 * Guest About Us Hook
 *
 * Fetches about us information from hotel settings
 */

import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";

interface AboutUsData {
  aboutUs: string;
  buttonText: string;
  buttonUrl?: string;
}

/**
 * Fetch about us data from hotel settings
 */
export function useGuestAboutUs(hotelId: string | undefined) {
  return useOptimizedQuery<AboutUsData | null>({
    queryKey: ["guest-about-us", hotelId],
    queryFn: async () => {
      if (!hotelId) {
        return null;
      }

      // Get guest-authenticated Supabase client
      const supabase = getGuestSupabaseClient();

      // Fetch hotel settings with setting_key = "about_section"
      const { data, error } = await supabase
        .from("hotel_settings")
        .select("about_us, about_us_button")
        .eq("hotel_id", hotelId)
        .eq("setting_key", "about_section")
        .maybeSingle();

      if (error) {
        console.error("Error fetching about us data:", error);
        return null;
      }

      if (!data || !data.about_us) {
        return null;
      }

      // Parse about_us_button JSON
      let buttonText = "Booking";
      let buttonUrl = "";

      if (data.about_us_button) {
        try {
          const buttonData = JSON.parse(data.about_us_button);
          buttonText = buttonData.text || "Booking";
          buttonUrl = buttonData.url || "";
        } catch (e) {
          buttonText = data.about_us_button; // Fallback to raw string
        }
      }

      return {
        aboutUs: data.about_us || "",
        buttonText,
        buttonUrl,
      };
    },
    enabled: !!hotelId,
    config: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000,
    },
  });
}
