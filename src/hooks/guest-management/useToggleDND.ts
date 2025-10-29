import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getGuestSupabaseClient } from "../../services/guestSupabase";

interface ToggleDNDParams {
  guestId: string;
  currentStatus: boolean;
}

/**
 * Toggle guest DND (Do Not Disturb) status
 * Uses guest Supabase client to ensure proper authentication context
 */
export function useToggleDND() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ guestId, currentStatus }: ToggleDNDParams) => {
      const guestSupabase = getGuestSupabaseClient();

      const { data, error } = await guestSupabase
        .from("guests")
        .update({ dnd_status: !currentStatus })
        .eq("id", guestId)
        .select()
        .single();

      if (error) {
        console.error("[useToggleDND] Error updating DND status:", error);
        throw error;
      }


      return data;
    },
    onSuccess: () => {
      // Invalidate any guest-related queries if needed
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
}
