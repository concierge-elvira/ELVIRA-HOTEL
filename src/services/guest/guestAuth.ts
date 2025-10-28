import { supabase } from "../supabase";
import type { GuestAuthResponse } from "../../types/guest";

export async function authenticateGuest(
  roomNumber: string,
  verificationCode: string
): Promise<GuestAuthResponse> {
  try {
    const { data, error } = await supabase.functions.invoke("guest-auth", {
      body: {
        roomNumber,
        verificationCode,
      },
    });

    if (error) {
      console.error("Guest auth error:", error);
      return {
        success: false,
        error: "Authentication failed. Please try again.",
      };
    }

    if (!data.success) {
      return {
        success: false,
        error: data.error || "Invalid credentials",
      };
    }

    return data as GuestAuthResponse;
  } catch (error) {
    console.error("Guest auth exception:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export function saveGuestSession(
  token: string,
  guestData: any,
  hotelData: any
): void {
  const session = {
    token,
    guestData,
    hotelData,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem("guestSession", JSON.stringify(session));
}

export function getGuestSession() {
  const sessionStr = localStorage.getItem("guestSession");
  if (!sessionStr) return null;

  try {
    const session = JSON.parse(sessionStr);

    // Check if session has expired
    const expiresAt = new Date(session.guestData.access_code_expires_at);
    if (expiresAt < new Date()) {
      clearGuestSession();
      return null;
    }

    return session;
  } catch {
    clearGuestSession();
    return null;
  }
}

export function clearGuestSession(): void {
  localStorage.removeItem("guestSession");
}
