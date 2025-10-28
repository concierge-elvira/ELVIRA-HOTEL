import React, { useMemo } from "react";
import {
  Home,
  ConciergeBell,
  UtensilsCrossed,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useGuestAuth, useGuestCart } from "../../../../contexts/guest";
import { useGuestHotelSettings } from "../../../../hooks/guest-management/settings/useGuestHotelSettings";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  isAction?: boolean;
  enabled?: boolean;
  badgeCount?: number;
}

interface GuestBottomNavProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const GuestBottomNav: React.FC<GuestBottomNavProps> = ({
  currentPath = "/guest/home",
  onNavigate,
}) => {
  const { signOut, guestSession } = useGuestAuth();
  const { amenityCartCount, restaurantCartCount, shopCartCount } =
    useGuestCart();
  const { data: hotelSettings } = useGuestHotelSettings(
    guestSession?.guestData?.hotel_id
  );

  const navItems: NavItem[] = useMemo(
    () => [
      {
        id: "home",
        label: "Home",
        icon: <Home className="w-6 h-6" />,
        path: "/guest/home",
        enabled: true, // Home is always enabled
      },
      {
        id: "services",
        label: "Services",
        icon: <ConciergeBell className="w-6 h-6" />,
        path: "/guest/services",
        enabled: hotelSettings?.amenitiesEnabled ?? true,
        badgeCount: amenityCartCount,
      },
      {
        id: "dine-in",
        label: "Dine In",
        icon: <UtensilsCrossed className="w-6 h-6" />,
        path: "/guest/restaurant",
        enabled: hotelSettings?.restaurantEnabled ?? true,
        badgeCount: restaurantCartCount,
      },
      {
        id: "shop",
        label: "Shop",
        icon: <ShoppingBag className="w-6 h-6" />,
        path: "/guest/shop",
        enabled: hotelSettings?.shopEnabled ?? true,
        badgeCount: shopCartCount,
      },
      {
        id: "logout",
        label: "Logout",
        icon: <LogOut className="w-6 h-6" />,
        path: "/logout",
        isAction: true,
        enabled: true, // Logout is always enabled
      },
    ],
    [hotelSettings, amenityCartCount, restaurantCartCount, shopCartCount]
  );

  // Filter navigation items based on settings
  const visibleNavItems = useMemo(
    () => navItems.filter((item) => item.enabled),
    [navItems]
  );

  const handleNavClick = (item: NavItem) => {
    if (item.isAction && item.id === "logout") {
      signOut();
    } else if (onNavigate) {
      onNavigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md border-t border-gray-200/50 shadow-lg z-50">
      <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        {visibleNavItems.map((item) => {
          const isActive = currentPath === item.path && !item.isAction;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 transition-all flex-1 relative ${
                isActive
                  ? "text-blue-600"
                  : item.isAction
                  ? "text-red-500 hover:text-red-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="relative scale-90">
                {item.icon}
                {/* Badge */}
                {typeof item.badgeCount === "number" && item.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                    {item.badgeCount > 99 ? "99+" : item.badgeCount}
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
