/**
 * Guest Notification Context
 *
 * Tracks order status changes and triggers shake animations
 * for the bell and clock widgets
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

interface GuestNotificationContextType {
  shouldShakeBell: boolean;
  shouldShakeClock: boolean;
  triggerBellShake: () => void;
  triggerClockShake: () => void;
  resetBellShake: () => void;
  resetClockShake: () => void;
  lastStatusChange: Date | null;
}

const GuestNotificationContext = createContext<
  GuestNotificationContextType | undefined
>(undefined);

export const GuestNotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [shouldShakeBell, setShouldShakeBell] = useState(false);
  const [shouldShakeClock, setShouldShakeClock] = useState(false);
  const [lastStatusChange, setLastStatusChange] = useState<Date | null>(null);

  const triggerBellShake = useCallback(() => {
    setShouldShakeBell(true);
    setLastStatusChange(new Date());
  }, []);

  const triggerClockShake = useCallback(() => {
    setShouldShakeClock(true);
    setLastStatusChange(new Date());
  }, []);

  const resetBellShake = useCallback(() => {
    setShouldShakeBell(false);
  }, []);

  const resetClockShake = useCallback(() => {
    setShouldShakeClock(false);
  }, []);

  // Auto-reset shake animations after 2 seconds
  useEffect(() => {
    if (shouldShakeBell) {
      const timer = setTimeout(() => {
        setShouldShakeBell(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldShakeBell]);

  useEffect(() => {
    if (shouldShakeClock) {
      const timer = setTimeout(() => {
        setShouldShakeClock(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldShakeClock]);

  return (
    <GuestNotificationContext.Provider
      value={{
        shouldShakeBell,
        shouldShakeClock,
        triggerBellShake,
        triggerClockShake,
        resetBellShake,
        resetClockShake,
        lastStatusChange,
      }}
    >
      {children}
    </GuestNotificationContext.Provider>
  );
};

export const useGuestNotification = () => {
  const context = useContext(GuestNotificationContext);
  if (!context) {
    throw new Error(
      "useGuestNotification must be used within GuestNotificationProvider"
    );
  }
  return context;
};

export default GuestNotificationProvider;
