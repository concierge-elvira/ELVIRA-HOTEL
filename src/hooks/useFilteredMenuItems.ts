import { useMemo } from "react";
import { hotelMenuItems } from "../utils/hotel/menuItems";
import { useHotelSettings } from "./settings";
import { useHotelId } from "./useHotelContext";
import { useCurrentUserHotel } from "./useCurrentUserHotel";

/**
 * Hook to filter menu items based on hotel settings and user role
 * Menu items are hidden when their corresponding setting is disabled
 * For "Hotel Staff" position, Overview and Third Party are hidden
 */
export function useFilteredMenuItems() {
  const hotelId = useHotelId();
  const { data: settings, isLoading } = useHotelSettings(hotelId || undefined);
  const { data: currentUser } = useCurrentUserHotel();

  const filteredMenuItems = useMemo(() => {
    // Filter based on user position first
    let items = hotelMenuItems;

    if (currentUser?.position === "Hotel Staff") {
      // Hide Overview and Third Party for Hotel Staff
      items = items.filter(
        (item) => item.id !== "overview" && item.id !== "third-party-management"
      );
    }

    if (!settings || settings.length === 0) {
      // If no settings exist yet, return position-filtered items
      return items;
    }

    // Map menu item IDs to their corresponding setting keys
    const menuSettingsMap: Record<string, string> = {
      amenities: "hotel_amenities",
      "hotel-restaurant": "room_service_restaurant",
      "hotel-shop": "hotel_shop",
      "third-party-management": "tours_excursions",
      announcements: "hotel_announcements",
      qna: "qa_recommendations",
      "emergency-contacts": "emergency_contacts",
    };

    return items.filter((item) => {
      // Always show these core items regardless of settings
      const alwaysVisible = [
        "overview",
        "hotel-staff",
        "chat-management",
        "guest-management",
        "ai-support",
        "settings",
      ];

      if (alwaysVisible.includes(item.id)) {
        return true;
      }

      // Check if item has a corresponding setting
      const settingKey = menuSettingsMap[item.id];
      if (!settingKey) {
        return true; // Show item if no setting is defined
      }

      // Find the setting value
      const setting = settings.find((s) => s.setting_key === settingKey);

      // Show item only if setting is enabled (true)
      return setting?.setting_value === true;
    });
  }, [settings, currentUser]);

  return {
    menuItems: filteredMenuItems,
    isLoading,
  };
}
