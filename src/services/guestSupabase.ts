/**
 * Guest Supabase Client
 *
 * Creates a Supabase client with guest JWT authentication
 * Uses singleton pattern to maintain realtime connections
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";
import { getGuestSession } from "./guest/guestAuth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

// Singleton client instance
let guestSupabaseInstance: SupabaseClient<Database> | null = null;
let currentToken: string | null = null;

/**
 * Get Supabase client with guest authentication
 * Returns a singleton client to maintain realtime connections
 * Automatically recreates client if token changes
 */
export function getGuestSupabaseClient() {
  const session = getGuestSession();
  const newToken = session?.token || null;

  // Check if token has changed - if so, reset the client
  if (guestSupabaseInstance && currentToken !== newToken) {
    console.log("[GuestSupabase] Token changed, resetting client...");
    resetGuestSupabaseClient();
  }

  // Return existing instance if available and token matches
  if (guestSupabaseInstance && currentToken === newToken) {
    return guestSupabaseInstance;
  }

  // Store current token for comparison
  currentToken = newToken;

  if (newToken) {
    // Create client with guest JWT token
    guestSupabaseInstance = createClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
          // Add heartbeat to keep connections alive
          heartbeatIntervalMs: 30000, // 30 seconds
          // Increase timeout for better reliability
          timeout: 60000, // 60 seconds
        },
      }
    );
    console.log("[GuestSupabase] Created authenticated client");
  } else {
    // Fallback to anon client
    guestSupabaseInstance = createClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
          // Add heartbeat to keep connections alive
          heartbeatIntervalMs: 30000, // 30 seconds
          // Increase timeout for better reliability
          timeout: 60000, // 60 seconds
        },
      }
    );
    console.log("[GuestSupabase] Created anonymous client");
  }

  return guestSupabaseInstance;
}

/**
 * Reset the guest Supabase client instance
 * Useful when guest logs out or token changes
 */
export function resetGuestSupabaseClient() {
  console.log("[GuestSupabase] Resetting client instance");

  if (guestSupabaseInstance) {
    // Remove all channels before resetting
    const channels = guestSupabaseInstance.getChannels();
    console.log(`[GuestSupabase] Removing ${channels.length} channels...`);
    channels.forEach((channel) => {
      guestSupabaseInstance?.removeChannel(channel);
    });
  }

  guestSupabaseInstance = null;
  currentToken = null;
}
