/**
 * Floating Action Button Component
 *
 * Individual action button (Clock, Message, etc.)
 * Used within the FloatingWidgetMenu
 */

import React from "react";
import type { LucideIcon } from "lucide-react";

interface FloatingActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  bgColor?: string;
  index: number;
  isVisible: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  bgColor = "bg-blue-500",
  index,
  isVisible,
}) => {
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
        <Icon className="w-6 h-6" />

        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {label}
        </span>
      </button>
    </div>
  );
};
