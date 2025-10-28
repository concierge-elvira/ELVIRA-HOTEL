import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";

interface ToggleDNDParams {
  guestId: string;
  currentStatus: boolean;
}

/**
 * Toggle guest DND (Do Not Disturb) status
 */
export function useToggleDND() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ guestId, currentStatus }: ToggleDNDParams) => {
      const { data, error } = await supabase
        .from("guests")
        .update({ dnd_status: !currentStatus })
        .eq("id", guestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate any guest-related queries if needed
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
}
