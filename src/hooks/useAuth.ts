import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { authService } from "../services/auth";
import type { UserProfile } from "../types/auth";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
// Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
if (session?.user) {
authService
            .getUserProfile(session.user.id)
            .then((profile) => {
setUser(profile);
              setLoading(false);
})
            .catch((error) => {
setLoading(false);
            });
        } else {
setLoading(false);
        }
      })
      .catch((error) => {
setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
if (event === "SIGNED_IN" && session?.user) {
authService
          .getUserProfile(session.user.id)
          .then((profile) => {
setUser(profile);
          })
          .catch((error) => {
});
      } else if (event === "SIGNED_OUT") {
setUser(null);
      }
    });

    return () => {
subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authService.signIn(email, password);

    if (error) {
      return { data: null, error };
    }

    if (data.user) {
      const profile = await authService.getUserProfile(data.user.id);

      if (!profile) {
        await authService.signOut();
        return {
          data: null,
          error: { message: "No profile found. Please contact administrator." },
        };
      }

      if (profile.role !== "elvira" && profile.role !== "hotel") {
        await authService.signOut();
        return {
          data: null,
          error: { message: "Invalid user role. Access denied." },
        };
      }
    }

    return { data, error };
  };

  const signOut = async () => {
    setUser(null);
    const { error } = await authService.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await authService.resetPassword(email);
    return { error };
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    resetPassword,
  };
}
