import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useCurrentUserHotelId } from "../../useCurrentUserHotel";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";

/**
 * Hook to fetch staff members for a specific hotel
 * Includes real-time updates and performance optimization
 */
export function useStaffManagement(hotelId?: string) {
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
          *,
          hotel_staff_personal_data (*)
        `
        )
        .eq("hotel_id", hotelId)

        .order("created_at", { ascending: false });

      if (error) {
throw error;
      }

      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: Infinity, // Staff data rarely changes
      gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
      refetchOnWindowFocus: false,
    },
    logPrefix: "Staff Management",
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
 * Auto-hotel ID hook for current user's staff
 */
export function useCurrentHotelStaff() {
  const { hotelId, isLoading: hotelIdLoading } = useCurrentUserHotelId();
return useStaffManagement(hotelId || undefined);
}

/**
 * Delete staff mutation using edge function
 */
export function useDeleteStaff() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();

  return useMutation({
    mutationFn: async (staffId: string) => {
try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error("No session token available");
        }
const response = await supabase.functions.invoke("delete-staff-hotel", {
          body: { staffId },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
if (response.error) {
throw new Error(response.error.message || "Failed to delete staff");
        }
return response.data;
      } catch (error) {
throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffByHotel(hotelId || ""),
      });
    },
  });
}
