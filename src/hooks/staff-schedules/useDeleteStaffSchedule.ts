import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";

/**
 * Delete a staff schedule
 */
export function useDeleteStaffSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("staff_schedules")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["staff-member-schedules"] });
    },
  });
}
