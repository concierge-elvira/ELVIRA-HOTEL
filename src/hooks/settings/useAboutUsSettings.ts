import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";
import type { Database } from "../../types/database";

type HotelSetting = Database["public"]["Tables"]["hotel_settings"]["Row"];

const HOTEL_SETTINGS_QUERY_KEY = "hotel-settings";

/**
 * Update About Us information in hotel settings
 */
export function useUpdateAboutUs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hotelId,
      aboutUsText,
      buttonText,
      buttonUrl,
      settingKey = "about_section",
    }: {
      hotelId: string;
      aboutUsText: string;
      buttonText: string;
      buttonUrl: string;
      settingKey?: string;
    }) => {
      // First, check if setting exists
      const { data: existingSetting } = await supabase
        .from("hotel_settings")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("setting_key", settingKey)
        .maybeSingle();

      // Store button data as JSON
      const buttonJson = JSON.stringify({
        text: buttonText,
        url: buttonUrl,
      });

      if (existingSetting) {
        // Update existing setting
        const { data, error } = await supabase
          .from("hotel_settings")
          .update({
            about_us: aboutUsText,
            about_us_button: buttonJson,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSetting.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new setting
        const { data, error } = await supabase
          .from("hotel_settings")
          .insert({
            hotel_id: hotelId,
            setting_key: settingKey,
            setting_value: true,
            about_us: aboutUsText,
            about_us_button: buttonJson,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data: HotelSetting) => {
      queryClient.invalidateQueries({
        queryKey: [HOTEL_SETTINGS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Get About Us information from hotel settings
 */
export function getAboutUsFromSettings(settings: HotelSetting[] | undefined): {
  aboutUsText: string;
  buttonText: string;
  buttonUrl: string;
} {
  const aboutSetting = settings?.find((s) => s.setting_key === "about_section");

  // Parse about_us_button JSON
  let buttonText = "";
  let buttonUrl = "";

  if (aboutSetting?.about_us_button) {
    try {
      const buttonData = JSON.parse(aboutSetting.about_us_button);
      buttonText = buttonData.text || "";
      buttonUrl = buttonData.url || "";
    } catch {
      // If not JSON, treat as plain text (backward compatibility)
      buttonText = aboutSetting.about_us_button;
    }
  }

  return {
    aboutUsText: aboutSetting?.about_us || "",
    buttonText,
    buttonUrl,
  };
}

/**
 * Update Hotel Photo Gallery
 */
export function useUpdatePhotoGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hotelId,
      imageUrls,
      settingKey = "hotel_photo_gallery",
    }: {
      hotelId: string;
      imageUrls: string[];
      settingKey?: string;
    }) => {
      // First, check if setting exists
      const { data: existingSetting } = await supabase
        .from("hotel_settings")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("setting_key", settingKey)
        .maybeSingle();

      // Store images as JSON array
      const imagesJson = JSON.stringify(imageUrls);

      if (existingSetting) {
        // Update existing setting
        const { data, error } = await supabase
          .from("hotel_settings")
          .update({
            images_url: imagesJson,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSetting.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new setting
        const { data, error } = await supabase
          .from("hotel_settings")
          .insert({
            hotel_id: hotelId,
            setting_key: settingKey,
            setting_value: true,
            images_url: imagesJson,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data: HotelSetting) => {
      queryClient.invalidateQueries({
        queryKey: [HOTEL_SETTINGS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Get Photo Gallery images from hotel settings
 */
export function getPhotoGalleryFromSettings(
  settings: HotelSetting[] | undefined
): string[] {
  const gallerySetting = settings?.find(
    (s) => s.setting_key === "hotel_photo_gallery"
  );

  if (!gallerySetting?.images_url) {
    return [];
  }

  try {
    const images = JSON.parse(gallerySetting.images_url);
    return Array.isArray(images) ? images : [];
  } catch {
    return [];
  }
}
