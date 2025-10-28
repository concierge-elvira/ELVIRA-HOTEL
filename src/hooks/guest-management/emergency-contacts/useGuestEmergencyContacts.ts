/**
 * Hook for fetching emergency contacts for guests
 * Uses guest JWT authentication
 * Includes real-time subscription for live updates
 */

import { useQuery } from "@tanstack/react-query";
import { getGuestSupabaseClient } from "../../../services/guestSupabase";
import { useGuestRealtimeSubscription } from "../../realtime/useGuestRealtimeSubscription";

interface EmergencyContact {
  id: string;
  contact_name: string;
  phone_number: string;
  is_active: boolean;
}

const GUEST_EMERGENCY_CONTACTS_QUERY_KEY = "guest-emergency-contacts";

export const useGuestEmergencyContacts = (hotelId: string | null) => {
  const query = useQuery({
    queryKey: [GUEST_EMERGENCY_CONTACTS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) {
        throw new Error("Hotel ID is required");
      }

      const supabase = getGuestSupabaseClient();

      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("id, contact_name, phone_number, is_active")
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .order("contact_name");

      if (error) {
        throw error;
      }

      return data as EmergencyContact[];
    },
    enabled: !!hotelId,
  });

  // Real-time subscription for live updates
  useGuestRealtimeSubscription({
    table: "emergency_contacts",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [GUEST_EMERGENCY_CONTACTS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
};
