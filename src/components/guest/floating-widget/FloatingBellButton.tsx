/**
 * Floating Bell Button Component
 *
 * Main toggle button with bell icon and animations
 */

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";

interface FloatingBellButtonProps {
  isOpen: boolean;
  onClick: () => void;
  hasNotifications?: boolean;
  shouldShake?: boolean;
  notificationCount?: number;
}

export const FloatingBellButton: React.FC<FloatingBellButtonProps> = ({
  isOpen,
  onClick,
  shouldShake = false,
  notificationCount = 0,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when shouldShake prop changes
  useEffect(() => {
    if (shouldShake) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  }, [shouldShake]);

  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-emerald-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 relative group"
      aria-label={isOpen ? "Close menu" : "Open notifications"}
    >
      {/* Bell icon - always visible with subtle shake on click */}
      <Bell
        className={`w-7 h-7 ${
          isAnimating ? "animate-[swing_0.6s_ease-in-out]" : ""
        }`}
      />

      {/* Notification badge - Red dot indicator */}
      {!isOpen && notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 border-2 border-white shadow-md animate-pulse"></span>
      )}
    </button>
  );
};
