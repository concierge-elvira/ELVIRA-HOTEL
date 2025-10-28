/**
 * Preview Bottom Navigation Component
 *
 * Shows a placeholder for the guest bottom navigation
 */

import React from "react";
import {
  Home,
  ConciergeBell,
  UtensilsCrossed,
  ShoppingBag,
  LogOut,
} from "lucide-react";

export const PreviewBottomNav: React.FC = () => {
  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-6 h-6" />,
      isActive: true,
    },
    {
      id: "services",
      label: "Services",
      icon: <ConciergeBell className="w-6 h-6" />,
      badgeCount: 2,
    },
    {
      id: "dine-in",
      label: "Dine In",
      icon: <UtensilsCrossed className="w-6 h-6" />,
    },
    {
      id: "shop",
      label: "Shop",
      icon: <ShoppingBag className="w-6 h-6" />,
      badgeCount: 1,
    },
    {
      id: "logout",
      label: "Logout",
      icon: <LogOut className="w-6 h-6" />,
      isAction: true,
    },
  ];

  return (
    <nav className="bg-white/70 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
      <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = item.isActive;
          const isAction = item.isAction;

          return (
            <button
              key={item.id}
              disabled
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 transition-all flex-1 relative ${
                isActive
                  ? "text-blue-600"
                  : isAction
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              <div className="relative scale-90">
                {item.icon}
                {/* Badge */}
                {typeof item.badgeCount === "number" && item.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span
                className={`text-xs ${
                  isActive ? "font-semibold" : "font-medium"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
