import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../services/supabase";

/**
 * Hook to approve a third-party place (Elvira admin action)
 */
export function useApprovePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (placeId: string) => {
      // Get current user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("thirdparty_places")
        .update({
          elvira_approved: true,
          approved_by: user?.id || null,
        })
        .eq("id", placeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all third-party places queries
      queryClient.invalidateQueries({
        queryKey: ["thirdparty_places"],
      });
    },
  });
}
