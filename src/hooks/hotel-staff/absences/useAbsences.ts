import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, type Inserts } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useCurrentUserHotelId } from "../../useCurrentUserHotel";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";

/**
 * Hook to fetch absence requests for a specific hotel
 * Includes real-time updates and performance optimization
 */
export function useAbsences(hotelId?: string) {
  const result = useOptimizedQuery({
    queryKey: queryKeys.absenceRequestsByHotel(hotelId || ""),
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("absence_requests")
        .select(
          `
          id,
          staff_id,
          hotel_id,
          request_type,
          start_date,
          end_date,
          status,
          notes,
          created_at,
          updated_at,
          staff:hotel_staff!staff_id (
            id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) {
throw error;
      }

      return data || [];
    },
    enabled: !!hotelId,
    config: {
      staleTime: 1000 * 60 * 2, // Keep fresh for 2 minutes
      gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
      refetchOnWindowFocus: false,
    },
    logPrefix: "Absences",
  });

  // Real-time subscription for absence changes
  useRealtimeSubscription({
    table: "absence_requests",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: queryKeys.absenceRequestsByHotel(hotelId || ""),
    enabled: !!hotelId,
  });

  return result;
}

/**
 * Auto-hotel ID hook for absence requests
 */
export function useCurrentHotelAbsences() {
  const { hotelId, isLoading: hotelIdLoading } = useCurrentUserHotelId();
return useAbsences(hotelId || undefined);
}

/**
 * Create absence request
 */
export function useCreateAbsenceRequest() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();

  return useMutation({
    mutationFn: async (
      request: Omit<Inserts<"absence_requests">, "hotel_id">
    ) => {
      if (!hotelId) throw new Error("Hotel ID is required");
const { data, error } = await supabase
        .from("absence_requests")
        .insert({
          ...request,
          hotel_id: hotelId,
        })
        .select(
          `
          id,
          staff_id,
          hotel_id,
          request_type,
          start_date,
          end_date,
          status,
          notes,
          created_at,
          updated_at,

          staff:hotel_staff!staff_id (
            id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .single();

      if (error) {
throw error;
      }
return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.absenceRequestsByHotel(hotelId || ""),
      });
    },
  });
}

/**
 * Update absence request
 */
export function useUpdateAbsenceRequest() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();

  return useMutation({
    mutationFn: async ({
      requestId,
      updates,
    }: {
      requestId: string;
      updates: Partial<Inserts<"absence_requests">>;
    }) => {
const { data, error } = await supabase
        .from("absence_requests")
        .update(updates)
        .eq("id", requestId)
        .select(
          `
          id,
          staff_id,
          hotel_id,
          request_type,
          start_date,
          end_date,
          status,
          notes,
          created_at,
          updated_at,

          staff:hotel_staff!staff_id (
            id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .single();

      if (error) {
throw error;
      }
return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.absenceRequestsByHotel(hotelId || ""),
      });
    },
  });
}

/**
 * Delete absence request
 */
export function useDeleteAbsenceRequest() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();

  return useMutation({
    mutationFn: async (requestId: string) => {
const { error } = await supabase
        .from("absence_requests")
        .delete()
        .eq("id", requestId);

      if (error) {
throw error;
      }
return requestId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.absenceRequestsByHotel(hotelId || ""),
      });
    },
  });
}
