import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useCurrentUserHotelId } from "../../useCurrentUserHotel";

/**
 * Hook to fetch all staff members from the same hotel for staff communication
 */
export function useStaffList(hotelId?: string) {
  const result = useOptimizedQuery({
    queryKey: queryKeys.staffByHotel(hotelId || ""),
    queryFn: async () => {
      if (!hotelId) {
return [];
      }

      const { data, error } = await supabase
        .from("hotel_staff")
        .select(
          `
          id,
          employee_id,
          position,
          department,
          status,
          hotel_staff_personal_data (
            first_name,
            last_name,
            email
          )
        `
        )
        .eq("hotel_id", hotelId)
        .eq("status", "active")
        .order("hotel_staff_personal_data(first_name)", { ascending: true });

      if (error) {
throw error;
      }

      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 15,
      refetchOnWindowFocus: true,
    },
    logPrefix: "Staff Communication - Staff List",
  });

  // Real-time subscription for staff changes
  useRealtimeSubscription({
    table: "hotel_staff",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: queryKeys.staffByHotel(hotelId || ""),
    enabled: !!hotelId,
  });

  return result;
}

/**
 * Auto-hotel ID hook for current hotel staff list
 */
export function useCurrentHotelStaffList() {
  const { hotelId } = useCurrentUserHotelId();
  return useStaffList(hotelId || undefined);
}
