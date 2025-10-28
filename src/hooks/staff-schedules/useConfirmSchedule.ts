import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";

interface ConfirmScheduleParams {
  id: string;
  confirmedBy: string;
}

/**
 * Confirm a staff schedule
 */
export function useConfirmSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, confirmedBy }: ConfirmScheduleParams) => {
      const { data, error } = await supabase
        .from("staff_schedules")
        .update({
          is_confirmed: true,
          confirmed_by: confirmedBy,
          confirmed_at: new Date().toISOString(),
          status: "CONFIRMED",
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["staff-member-schedules"] });
    },
  });
}
