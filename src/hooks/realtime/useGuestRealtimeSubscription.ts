import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getGuestSupabaseClient } from "../../services/guestSupabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

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
    console.log(
      `[Guest Realtime] Effect triggered for table: ${table}, enabled: ${enabled}, filter: ${filter}`
    );

    if (!enabled) {
      console.log(`[Guest Realtime] Subscription disabled for ${table}`);
      return;
    }

    let channel: RealtimeChannel;
    const guestSupabase = getGuestSupabaseClient(); // Create client once per effect

    const setupSubscription = () => {
      const channelName = `guest-${table}-changes-${Date.now()}`;
      console.log(`[Guest Realtime] Creating channel: ${channelName}`);
      console.log(`[Guest Realtime] Filter: ${filter}`);

      // Build the postgres_changes config
      const changesConfig: Record<string, unknown> = {
        event: "*",
        schema: "public",
        table,
      };

      // Only add filter if it's provided
      if (filter) {
        changesConfig.filter = filter;
      }

      console.log(`[Guest Realtime] Changes config:`, changesConfig);

      channel = guestSupabase
        .channel(channelName)
        .on("postgres_changes", changesConfig, (payload) => {
          console.log(`[Guest Realtime] 🔔 ${table} change detected:`, payload);
          console.log(
            `[Guest Realtime] Event type: ${payload.eventType}, Table: ${payload.table}`
          );

          // Call custom handlers
          if (payload.eventType === "INSERT" && onInsert) {
            console.log(`[Guest Realtime] Calling onInsert handler`);
            onInsert(payload.new);
          } else if (payload.eventType === "UPDATE" && onUpdate) {
            console.log(`[Guest Realtime] Calling onUpdate handler`);
            onUpdate(payload.new);
          } else if (payload.eventType === "DELETE" && onDelete) {
            console.log(`[Guest Realtime] Calling onDelete handler`);
            onDelete(payload.old);
          }

          // Invalidate the query to refetch data
          console.log(
            `[Guest Realtime] Invalidating query with key:`,
            queryKey
          );
          queryClient.invalidateQueries({ queryKey });
        })
        .subscribe((status, err) => {
          console.log(
            `[Guest Realtime] 📡 ${table} subscription status:`,
            status
          );
          if (err) {
            console.error(`[Guest Realtime] ❌ Subscription error:`, err);
          }
          if (status === "SUBSCRIBED") {
            console.log(
              `[Guest Realtime] ✅ Successfully subscribed to ${table}`
            );
          } else if (status === "CHANNEL_ERROR") {
            console.error(
              `[Guest Realtime] ❌ Channel error for ${table}`,
              err
            );
          } else if (status === "TIMED_OUT") {
            console.error(
              `[Guest Realtime] ⏱️ Subscription timed out for ${table}`
            );
          } else if (status === "CLOSED") {
            console.log(`[Guest Realtime] 🔒 Channel closed for ${table}`);
          }
        });
    };

    setupSubscription();

    return () => {
      console.log(`[Guest Realtime] 🧹 Cleaning up subscription for ${table}`);
      if (channel) {
        guestSupabase.removeChannel(channel);
        console.log(`[Guest Realtime] ✅ Channel removed for ${table}`);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, filter, enabled, queryClient]);
}
