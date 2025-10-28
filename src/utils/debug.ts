// Debug utilities to help troubleshoot authentication issues

export const debugAuth = {
  // Check local storage for Supabase data
  checkLocalStorage() {
const supabaseKeys = Object.keys(localStorage).filter(
      (key) => key.includes("supabase") || key.includes("auth")
    );
supabaseKeys.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
} catch {
}
    });
  },

  // Check environment variables
  checkEnvVars() {
},

  // Check network connectivity to Supabase
  async checkConnectivity() {
const url = import.meta.env.VITE_SUPABASE_URL;
    if (!url) {
return;
    }

    try {
      const response = await fetch(`${url}/rest/v1/`, {
        method: "HEAD",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      });
} catch (error) {
}
  },

  // Clear all auth data
  clearAuthData() {
const supabaseKeys = Object.keys(localStorage).filter(
      (key) => key.includes("supabase") || key.includes("auth")
    );

    supabaseKeys.forEach((key) => {
      localStorage.removeItem(key);
});

    // Also clear session storage
    const sessionSupabaseKeys = Object.keys(sessionStorage).filter(
      (key) => key.includes("supabase") || key.includes("auth")
    );

    sessionSupabaseKeys.forEach((key) => {
      sessionStorage.removeItem(key);
});
},

  // Force sign out and clear everything
  async forceSignOut() {
try {
      // Import supabase dynamically to avoid circular imports
      const { supabase } = await import("../services/supabase");

      // Sign out from Supabase
      await supabase.auth.signOut();
// Clear all storage
      this.clearAuthData();

      // Reload the page to reset everything
      window.location.reload();
    } catch (error) {
// Clear storage anyway
      this.clearAuthData();
      window.location.reload();
    }
  },

  // Run all checks
  runAllChecks() {
this.checkEnvVars();
    this.checkLocalStorage();
    this.checkConnectivity();
  },

  // Check if there's a persisting session issue
  checkSessionIssue() {
const supabaseKeys = Object.keys(localStorage).filter((key) =>
      key.includes("supabase")
    );
supabaseKeys.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const parsed = JSON.parse(value);
// Check for access_token or user data
          if (parsed.access_token || parsed.user) {
}
        }
      } catch {
}
    });
  },
};

// Make it available globally for debugging in browser console
declare global {
  interface Window {
    debugAuth: typeof debugAuth;
  }
}

window.debugAuth = debugAuth;
