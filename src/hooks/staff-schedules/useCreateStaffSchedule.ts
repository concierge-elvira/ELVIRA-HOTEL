import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";
import type { CreateStaffScheduleInput } from "../../types/staff-schedules";

/**
 * Create a new staff schedule
 */
export function useCreateStaffSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateStaffScheduleInput) => {
      const { data, error } = await supabase
        .from("staff_schedules")
        .insert({
          ...input,
          status: input.status || "SCHEDULED",
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["staff-schedules"] });
      queryClient.invalidateQueries({
        queryKey: ["staff-member-schedules", data.staff_id],
      });
    },
  });
}
