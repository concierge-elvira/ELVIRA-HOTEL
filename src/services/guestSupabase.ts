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

/**
 * Get Supabase client with guest authentication
 * Returns a singleton client to maintain realtime connections
 */
export function getGuestSupabaseClient() {
  // Return existing instance if available
  if (guestSupabaseInstance) {
    return guestSupabaseInstance;
  }

  const session = getGuestSession();

  console.log("[Guest Supabase] Creating new client instance");
  console.log("[Guest Supabase] Has guest token:", !!session?.token);

  if (session?.token) {
    // Create client with guest JWT token
    guestSupabaseInstance = createClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${session.token}`,
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
        },
      }
    );
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
        },
      }
    );
  }

  console.log("[Guest Supabase] Client created successfully");
  return guestSupabaseInstance;
}

/**
 * Reset the guest Supabase client instance
 * Useful when guest logs out or token changes
 */
export function resetGuestSupabaseClient() {
  console.log("[Guest Supabase] Resetting client instance");
  if (guestSupabaseInstance) {
    // Remove all channels before resetting
    const channels = guestSupabaseInstance.getChannels();
    channels.forEach((channel) => {
      guestSupabaseInstance?.removeChannel(channel);
    });
  }
  guestSupabaseInstance = null;
}
