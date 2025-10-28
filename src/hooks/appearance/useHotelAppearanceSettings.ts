/**
 * Hook to manage hotel appearance settings
 *
 * Loads and saves appearance settings from/to the database
 */

import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { useCurrentUserHotel } from "../useCurrentUserHotel";
import type { AppearanceConfig } from "../../screens/hotel/settings/components/appearance/types";

interface DbAppearanceSettings {
  id: string;
  hotel_id: string;
  font_family: string;
  font_size_base: string;
  font_size_heading: string;
  font_size_small: string;
  font_weight_normal: string;
  font_weight_medium: string;
  font_weight_semibold: string;
  font_weight_bold: string;
  color_primary: string;
  color_text_primary: string;
  color_text_secondary: string;
  color_text_inverse: string;
  stay_card_gradient_from: string;
  stay_card_gradient_to: string;
  about_us_background_color: string;
  icon_size: string;
  border_radius: string;
  card_style: string;
  created_at: string | null;
  updated_at: string | null;
}

export const useHotelAppearanceSettings = () => {
  const { data: hotelInfo } = useCurrentUserHotel();
  const [settings, setSettings] = useState<AppearanceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert DB format to AppearanceConfig
  const dbToConfig = (db: DbAppearanceSettings): AppearanceConfig => ({
    typography: {
      fontFamily: db.font_family,
      fontSize: {
        base: db.font_size_base,
        heading: db.font_size_heading,
        small: db.font_size_small,
      },
      fontWeight: {
        normal: db.font_weight_normal,
        medium: db.font_weight_medium,
        semibold: db.font_weight_semibold,
        bold: db.font_weight_bold,
      },
    },
    colors: {
      primary: db.color_primary,
      text: {
        primary: db.color_text_primary,
        secondary: db.color_text_secondary,
        inverse: db.color_text_inverse,
      },
    },
    stayCard: {
      gradientFrom: db.stay_card_gradient_from,
      gradientTo: db.stay_card_gradient_to,
    },
    aboutUs: {
      backgroundColor: db.about_us_background_color,
    },
    icons: {
      size: db.icon_size as "small" | "medium" | "large",
    },
    shapes: {
      borderRadius: db.border_radius as "none" | "small" | "medium" | "large",
      cardStyle: db.card_style as "flat" | "elevated" | "outlined",
    },
  });

  // Convert AppearanceConfig to DB format
  const configToDb = (config: AppearanceConfig) => ({
    font_family: config.typography.fontFamily,
    font_size_base: config.typography.fontSize.base,
    font_size_heading: config.typography.fontSize.heading,
    font_size_small: config.typography.fontSize.small,
    font_weight_normal: config.typography.fontWeight.normal,
    font_weight_medium: config.typography.fontWeight.medium,
    font_weight_semibold: config.typography.fontWeight.semibold,
    font_weight_bold: config.typography.fontWeight.bold,
    color_primary: config.colors.primary,
    color_text_primary: config.colors.text.primary,
    color_text_secondary: config.colors.text.secondary,
    color_text_inverse: config.colors.text.inverse,
    stay_card_gradient_from: config.stayCard.gradientFrom,
    stay_card_gradient_to: config.stayCard.gradientTo,
    about_us_background_color: config.aboutUs.backgroundColor,
    icon_size: config.icons.size,
    border_radius: config.shapes.borderRadius,
    card_style: config.shapes.cardStyle,
  });

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      if (!hotelInfo?.hotelId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("hotel_appearance_settings")
          .select("*")
          .eq("hotel_id", hotelInfo.hotelId)
          .single();

        if (fetchError) {
          // If no settings found, that's okay - we'll use defaults
          if (fetchError.code === "PGRST116") {
            setSettings(null);
          } else {
            throw fetchError;
          }
        } else if (data) {
          setSettings(dbToConfig(data));
        }
      } catch (err) {
        console.error("Error loading appearance settings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load settings"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [hotelInfo?.hotelId]);

  // Save settings to database
  const saveSettings = async (config: AppearanceConfig) => {
    if (!hotelInfo?.hotelId) {
      throw new Error("No hotel selected");
    }

    try {
      setSaving(true);
      setError(null);

      const dbData = configToDb(config);

      // Try to update first, if not exists then insert
      const { data: existingData } = await supabase
        .from("hotel_appearance_settings")
        .select("id")
        .eq("hotel_id", hotelInfo.hotelId)
        .single();

      if (existingData) {
        // Update existing
        const { error: updateError } = await supabase
          .from("hotel_appearance_settings")
          .update(dbData)
          .eq("hotel_id", hotelInfo.hotelId);

        if (updateError) throw updateError;
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from("hotel_appearance_settings")
          .insert({
            hotel_id: hotelInfo.hotelId,
            ...dbData,
          });

        if (insertError) throw insertError;
      }

      setSettings(config);
      return { success: true };
    } catch (err) {
      console.error("Error saving appearance settings:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save settings";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    error,
    saveSettings,
  };
};
