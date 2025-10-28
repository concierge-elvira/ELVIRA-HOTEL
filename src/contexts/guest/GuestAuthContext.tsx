import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  authenticateGuest,
  saveGuestSession,
  getGuestSession,
  clearGuestSession,
} from "../../services/guest";
import type { GuestSession } from "../../types/guest";

interface GuestAuthContextType {
  guestSession: GuestSession | null;
  loading: boolean;
  signIn: (
    roomNumber: string,
    verificationCode: string
  ) => Promise<{ error?: string }>;
  signOut: () => void;
}

const GuestAuthContext = createContext<GuestAuthContextType | undefined>(
  undefined
);

export function GuestAuthProvider({ children }: { children: ReactNode }) {
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const session = getGuestSession();
    if (session) {
      setGuestSession(session);
    }
    setLoading(false);
  }, []);

  const signIn = async (roomNumber: string, verificationCode: string) => {
    try {
      const response = await authenticateGuest(roomNumber, verificationCode);

      if (
        !response.success ||
        !response.token ||
        !response.guestData ||
        !response.hotelData
      ) {
        return { error: response.error || "Authentication failed" };
      }

      const session: GuestSession = {
        token: response.token,
        guestData: response.guestData,
        hotelData: response.hotelData,
      };

      saveGuestSession(response.token, response.guestData, response.hotelData);
      setGuestSession(session);

      return {};
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: "An unexpected error occurred" };
    }
  };

  const signOut = () => {
    clearGuestSession();
    setGuestSession(null);
  };

  return (
    <GuestAuthContext.Provider
      value={{ guestSession, loading, signIn, signOut }}
    >
      {children}
    </GuestAuthContext.Provider>
  );
}

export function useGuestAuth() {
  const context = useContext(GuestAuthContext);
  if (context === undefined) {
    throw new Error("useGuestAuth must be used within a GuestAuthProvider");
  }
  return context;
}
