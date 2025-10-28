/**
 * Floating Action Button Component
 *
 * Individual action button (Clock, Message, etc.)
 * Used within the FloatingWidgetMenu
 */

import React, { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";

interface FloatingActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  bgColor?: string;
  index: number;
  isVisible: boolean;
  shouldShake?: boolean;
  badgeCount?: number;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  bgColor = "bg-blue-500",
  index,
  isVisible,
  shouldShake = false,
  badgeCount = 0,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when shouldShake prop changes
  useEffect(() => {
    if (shouldShake) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  }, [shouldShake]);

  return (
    <div
      className={`absolute right-0 transition-all duration-300 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{
        bottom: `${(index + 1) * 70}px`,
        transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
      }}
    >
      <button
        onClick={onClick}
        className={`${bgColor} text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 group relative`}
        aria-label={label}
      >
        <Icon
          className={`w-6 h-6 ${
            isAnimating ? "animate-[swing_0.6s_ease-in-out]" : ""
          }`}
        />

        {/* Badge - more discreet */}
        {badgeCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-white text-gray-900 text-[10px] font-semibold rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-sm border border-gray-200">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}

        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {label}
        </span>
      </button>
    </div>
  );
};
