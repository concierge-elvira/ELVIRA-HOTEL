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
import { getGuestSupabaseClient } from "../../services/guestSupabase";
import type { GuestSession } from "../../types/guest";
import type { RealtimeChannel } from "@supabase/supabase-js";

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

  // Set up realtime subscription for guest data updates
  useEffect(() => {
    if (!guestSession?.guestData?.id) {
      return;
    }

    const guestId = guestSession.guestData.id;
    const currentToken = guestSession.token;
    const currentHotelData = guestSession.hotelData;



    let channel: RealtimeChannel;
    const guestSupabase = getGuestSupabaseClient();

    const setupSubscription = () => {
      channel = guestSupabase
        .channel(`guest-data-changes-${guestId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "guests",
            filter: `id=eq.${guestId}`,
          },
          (payload) => {


            // Update the session with new guest data
            if (payload.new) {
              setGuestSession((prevSession) => {
                if (!prevSession) return prevSession;

                const updatedSession: GuestSession = {
                  token: currentToken,
                  guestData: {
                    ...prevSession.guestData,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ...(payload.new as any),
                  },
                  hotelData: currentHotelData,
                };

                saveGuestSession(
                  currentToken,
                  updatedSession.guestData,
                  currentHotelData
                );


                return updatedSession;
              });
            }
          }
        )
        .subscribe((status) => {


        });
    };

    setupSubscription();

    return () => {

      if (channel) {
        guestSupabase.removeChannel(channel);
      }
    };
  }, [
    guestSession?.guestData?.id,
    guestSession?.token,
    guestSession?.hotelData,
  ]);

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
