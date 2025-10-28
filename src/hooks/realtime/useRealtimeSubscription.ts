import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface UseRealtimeSubscriptionParams {
  table: string;
  filter?: string;
  queryKey: readonly unknown[];
  enabled?: boolean;
  onInsert?: (payload: unknown) => void;
  onUpdate?: (payload: unknown) => void;
  onDelete?: (payload: unknown) => void;
}

/**
 * Generic real-time subscription hook for Supabase tables
 * Automatically invalidates queries when data changes
 */
export function useRealtimeSubscription({
  table,
  filter,
  queryKey,
  enabled = true,
  onInsert,
  onUpdate,
  onDelete,
}: UseRealtimeSubscriptionParams) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) {
return;
    }
let channel: RealtimeChannel;

    const setupSubscription = () => {
      channel = supabase
        .channel(`${table}-changes-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table,
            filter,
          },
          (payload) => {
// Call custom handlers
            if (payload.eventType === "INSERT" && onInsert) {
              onInsert(payload.new);
            } else if (payload.eventType === "UPDATE" && onUpdate) {
              onUpdate(payload.new);
            } else if (payload.eventType === "DELETE" && onDelete) {
              onDelete(payload.old);
            }

            // Invalidate the query to refetch data
queryClient.invalidateQueries({ queryKey });
          }
        )
        .subscribe((status) => {
});
    };

    setupSubscription();

    return () => {
if (channel) {
        supabase.removeChannel(channel);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, filter, enabled, queryClient]);
}
