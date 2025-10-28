import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { supabase } from "../../services/supabase";
import type { StaffScheduleWithDetails } from "../../types/staff-schedules";

interface UseStaffSchedulesParams {
  hotelId: string | undefined;
  startDate?: string;
  endDate?: string;
  status?: string;
  staffId?: string;
}

/**
 * Fetch staff schedules with optional filtering
 */
export function useStaffSchedules({
  hotelId,
  startDate,
  endDate,
  status,
  staffId,
}: UseStaffSchedulesParams) {
  return useOptimizedQuery({
    queryKey: ["staff-schedules", hotelId, startDate, endDate, status, staffId],
    queryFn: async (): Promise<StaffScheduleWithDetails[]> => {
      if (!hotelId) {
        throw new Error("Hotel ID is required");
      }

      let query = supabase
        .from("staff_schedules")
        .select(
          `
          *,
          staff:hotel_staff(
            id,
            hotel_staff_personal_data(
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("schedule_start_date", { ascending: true });

      console.log("[useStaffSchedules] Base query with hotel_id:", hotelId);

      // Apply filters
      if (startDate && endDate) {
        console.log("[useStaffSchedules] Applying date range filter:", {
          startDate,
          endDate,
        });
        query = query
          .lte("schedule_start_date", endDate)
          .gte("schedule_finish_date", startDate);
      }

      if (status && status !== "All Statuses") {
        query = query.eq("status", status.toUpperCase());
      }

      if (staffId) {
        query = query.eq("staff_id", staffId);
      }

      const { data, error } = await query;

      console.log("[useStaffSchedules] Query result:", {
        hotelId,
        startDate,
        endDate,
        status,
        staffId,
        resultCount: data?.length || 0,
        data,
        error,
      });

      if (error) {
        throw error;
      }

      return (data || []) as StaffScheduleWithDetails[];
    },
    enabled: !!hotelId,
  });
}

/**
 * Fetch schedules for a specific date range (for calendar view)
 */
export function useSchedulesByDateRange(
  hotelId: string | undefined,
  startDate: string,
  endDate: string
) {
  return useStaffSchedules({
    hotelId,
    startDate,
    endDate,
  });
}

/**
 * Fetch schedules for a specific staff member
 */
export function useStaffMemberSchedules(
  hotelId: string | undefined,
  staffId: string | undefined
) {
  return useOptimizedQuery({
    queryKey: ["staff-member-schedules", hotelId, staffId],
    queryFn: async (): Promise<StaffScheduleWithDetails[]> => {
      if (!hotelId || !staffId) {
        throw new Error("Hotel ID and Staff ID are required");
      }

      const { data, error } = await supabase
        .from("staff_schedules")
        .select(
          `
          *,
          staff:hotel_staff(
            id,
            hotel_staff_personal_data(
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .eq("hotel_id", hotelId)
        .eq("staff_id", staffId)
        .order("schedule_start_date", { ascending: true });

      if (error) {
        throw error;
      }

      return (data || []) as StaffScheduleWithDetails[];
    },
    enabled: !!hotelId && !!staffId,
  });
}
