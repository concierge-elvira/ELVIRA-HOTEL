/**
 * Guest Supabase Client
 *
 * Creates a Supabase client with guest JWT authentication
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";
import { getGuestSession } from "./guest/guestAuth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

/**
 * Get Supabase client with guest authentication
 * Returns a client with the guest's JWT token if available
 */
export function getGuestSupabaseClient() {
  const session = getGuestSession();

  if (session?.token) {
    // Create client with guest JWT token
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  // Fallback to anon client
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
