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
import { useAppearance, getIconSizeClass } from "./contexts/AppearanceContext";

export const PreviewBottomNav: React.FC = () => {
  const { config } = useAppearance();
  const iconSizeClass = getIconSizeClass(config.icons.size);

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: <Home className={iconSizeClass} />,
      isActive: true,
    },
    {
      id: "services",
      label: "Services",
      icon: <ConciergeBell className={iconSizeClass} />,
      badgeCount: 2,
    },
    {
      id: "dine-in",
      label: "Dine In",
      icon: <UtensilsCrossed className={iconSizeClass} />,
    },
    {
      id: "shop",
      label: "Shop",
      icon: <ShoppingBag className={iconSizeClass} />,
      badgeCount: 1,
    },
    {
      id: "logout",
      label: "Logout",
      icon: <LogOut className={iconSizeClass} />,
      isAction: true,
    },
  ];

  return (
    <nav
      className="bg-white/70 backdrop-blur-md border-t shadow-lg"
      style={{
        borderColor: `${config.colors.text.secondary}30`,
      }}
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = item.isActive;
          const isAction = item.isAction;

          return (
            <button
              key={item.id}
              disabled
              className="flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 transition-all flex-1 relative"
              style={{
                color: isActive
                  ? config.colors.primary
                  : isAction
                  ? "#EF4444"
                  : config.colors.text.secondary,
              }}
            >
              <div className="relative scale-90">
                {item.icon}
                {/* Badge */}
                {typeof item.badgeCount === "number" && item.badgeCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-xs font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center"
                    style={{
                      backgroundColor: "#EF4444",
                      color: config.colors.text.inverse,
                    }}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span
                className={isActive ? "font-semibold" : "font-medium"}
                style={{ fontSize: config.typography.fontSize.small }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: config.colors.primary }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
