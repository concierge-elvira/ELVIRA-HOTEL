import { useEffect, useRef } from "react";
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
  const channelRef = useRef<RealtimeChannel | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const setupSubscription = () => {
      // Clean up existing channel if any
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Create unique channel name
      const channelName = `${table}-changes-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;



      const config = {
        event: "*" as const,
        schema: "public" as const,
        table,
        filter,
      };


      const channel = supabase
        .channel(channelName)
        .on("postgres_changes", config, (payload) => {
          console.log(`[Realtime] 🔔 ${table} ${payload.eventType}`, payload);

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
        })
        .subscribe((status, err) => {
          console.log(`[Realtime Status] ${table} - Status: ${status}`);

          if (status === "SUBSCRIBED") {

            // Clear any reconnect timeouts
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
              reconnectTimeoutRef.current = null;
            }
          }

          if (err) {
            console.error(`[Realtime Error] ${table}:`, err);
            console.error(`[Realtime Error Details] Message:`, err.message);
            console.error(
              `[Realtime Error Details] Full:`,
              JSON.stringify(err, null, 2)
            );

            // Don't spam console for "undefined" errors
            if (err.message && err.message !== "undefined") {
              console.error(`[Realtime] ❌ ${table} error:`, err);
            }
          }

          if (status === "CHANNEL_ERROR") {
            const errorMsg = err?.message || err;
            console.error(`[Realtime] ❌ CHANNEL_ERROR for ${table}`);
            console.error(`[Realtime] Error message:`, errorMsg);
            console.error(
              `[Realtime] This usually means RLS is blocking the subscription`
            );
            console.error(
              `[Realtime] Check if supabase_realtime_admin has SELECT permission on ${table}`
            );

            if (errorMsg && errorMsg !== "undefined") {
              console.warn(
                `[Realtime] ⚠️ ${table} channel error, will retry in 5s...`
              );

              // Attempt to reconnect after 5 seconds
              if (!reconnectTimeoutRef.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                  console.log(`[Realtime] 🔄 Reconnecting ${table}...`);
                  setupSubscription();
                }, 5000);
              }
            }
          } else if (status === "TIMED_OUT") {
            console.warn(
              `[Realtime] ⏱️ ${table} timeout, reconnecting in 1s...`
            );

            // Attempt immediate reconnect on timeout
            if (!reconnectTimeoutRef.current) {
              reconnectTimeoutRef.current = setTimeout(() => {
                setupSubscription();
              }, 1000);
            }
          } else if (status === "CLOSED") {
            console.log(`[Realtime] 🔌 ${table} connection closed`);
          } else {
            // Log any other status we don't explicitly handle

          }
        });

      channelRef.current = channel;
    };

    setupSubscription();

    return () => {
      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Remove channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, filter, enabled, queryClient]);
}
