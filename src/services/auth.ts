// Authentication service functions
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "../types/auth";

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  },

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role, created_at")
        .eq("id", userId)
        .single();
if (error) {
return null;
      }
return data;
    } catch (error) {
return null;
    }
  },

  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { session, error };
  },
};
