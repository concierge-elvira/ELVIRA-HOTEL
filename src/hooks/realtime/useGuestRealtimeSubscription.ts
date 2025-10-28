import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getGuestSupabaseClient } from "../../services/guestSupabase";
import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

interface UseGuestRealtimeSubscriptionParams {
  table: string;
  filter?: string;
  queryKey: readonly unknown[];
  enabled?: boolean;
  onInsert?: (payload: unknown) => void;
  onUpdate?: (payload: unknown) => void;
  onDelete?: (payload: unknown) => void;
}

/**
 * Generic real-time subscription hook for Supabase tables (Guest version)
 * Uses guest JWT authentication
 * Automatically invalidates queries when data changes
 */
export function useGuestRealtimeSubscription({
  table,
  filter,
  queryKey,
  enabled = true,
  onInsert,
  onUpdate,
  onDelete,
}: UseGuestRealtimeSubscriptionParams) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let channel: RealtimeChannel;
    const guestSupabase = getGuestSupabaseClient(); // Create client once per effect

    const setupSubscription = () => {
      // Create truly unique channel name using timestamp + random string
      const channelName = `guest-${table}-${
        filter || "all"
      }-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Build the postgres_changes config
      const changesConfig: {
        event: "*";
        schema: "public";
        table: string;
        filter?: string;
      } = {
        event: "*",
        schema: "public",
        table,
      };

      // Only add filter if it's provided
      if (filter) {
        changesConfig.filter = filter;
      }

      channel = guestSupabase
        .channel(channelName)
        .on(
          "postgres_changes" as never,
          changesConfig,
          (
            payload: RealtimePostgresChangesPayload<Record<string, unknown>>
          ) => {
            console.log(`[Realtime] 🔔 ${table} ${payload.eventType}`);

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
        .subscribe((status, err) => {
          if (err) {
            console.error(`[Realtime] ❌ ${table} error:`, err);
          }
          if (status === "CHANNEL_ERROR") {
            console.error(
              `[Realtime] ❌ ${table} channel error -`,
              err?.message || err
            );
          } else if (status === "TIMED_OUT") {
            console.error(`[Realtime] ⏱️ ${table} timeout`);
          }
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        guestSupabase.removeChannel(channel);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, filter, enabled, queryClient]);
}
