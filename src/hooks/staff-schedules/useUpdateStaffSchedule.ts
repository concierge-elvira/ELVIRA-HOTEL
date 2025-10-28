import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";
import type { UpdateStaffScheduleInput } from "../../types/staff-schedules";

interface UpdateStaffScheduleParams {
  id: string;
  updates: UpdateStaffScheduleInput;
}

/**
 * Update an existing staff schedule
 */
export function useUpdateStaffSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: UpdateStaffScheduleParams) => {
      const { data, error } = await supabase
        .from("staff_schedules")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate all schedule queries
      queryClient.invalidateQueries({ queryKey: ["staff-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["staff-member-schedules"] });
    },
  });
}
