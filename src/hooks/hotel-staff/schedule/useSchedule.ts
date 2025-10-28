import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useCurrentUserHotelId } from "../../useCurrentUserHotel";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";

/**
 * Hook to fetch schedules for a specific hotel
 * Includes real-time updates and performance optimization
 */
export function useSchedule(hotelId?: string, date?: string) {
  const result = useOptimizedQuery({
    queryKey: date ? queryKeys.schedulesByDate(date) : queryKeys.schedules,
    queryFn: async () => {
      if (!hotelId) return [];

      let query = supabase
        .from("staff_schedules")
        .select(
          `
          *,
          hotel_staff!inner (
            id,
            employee_id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name
            )
          )
        `
        )
        .eq("hotel_id", hotelId);

      if (date) {
        query = query
          .gte("schedule_start_date", date)
          .lte("schedule_finish_date", date);
      }

      const { data, error } = await query.order("schedule_start_date", {
        ascending: true,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
      gcTime: 1000 * 60 * 15, // Keep in cache for 15 minutes
      refetchOnWindowFocus: false,
    },
    logPrefix: "Schedule",
  });

  // Real-time subscription for schedule changes
  useRealtimeSubscription({
    table: "staff_schedules",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: date ? queryKeys.schedulesByDate(date) : queryKeys.schedules,
    enabled: !!hotelId,
  });

  return result;
}

/**
 * Auto-hotel ID hook for current hotel's schedule
 */
export function useCurrentHotelSchedule(date?: string) {
  const { hotelId, isLoading: hotelIdLoading } = useCurrentUserHotelId();
return useSchedule(hotelId || undefined, date);
}
