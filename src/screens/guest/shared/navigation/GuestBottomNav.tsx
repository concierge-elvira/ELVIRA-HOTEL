import React from "react";
import {
  Home,
  Wrench,
  UtensilsCrossed,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useGuestAuth } from "../../../../contexts/guest";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  isAction?: boolean;
}

interface GuestBottomNavProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <Home className="w-6 h-6" />,
    path: "/guest/home",
  },
  {
    id: "services",
    label: "Services",
    icon: <Wrench className="w-6 h-6" />,
    path: "/guest/services",
  },
  {
    id: "dine-in",
    label: "Dine In",
    icon: <UtensilsCrossed className="w-6 h-6" />,
    path: "/guest/restaurant",
  },
  {
    id: "shop",
    label: "Shop",
    icon: <ShoppingBag className="w-6 h-6" />,
    path: "/guest/shop",
  },

  {
    id: "logout",
    label: "Logout",
    icon: <LogOut className="w-6 h-6" />,
    path: "/logout",
    isAction: true,
  },
];

export const GuestBottomNav: React.FC<GuestBottomNavProps> = ({
  currentPath = "/guest/home",
  onNavigate,
}) => {
  const { signOut } = useGuestAuth();

  const handleNavClick = (item: NavItem) => {
    if (item.isAction && item.id === "logout") {
      signOut();
    } else if (onNavigate) {
      onNavigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path && !item.isAction;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all flex-1 relative ${
                isActive
                  ? "text-blue-600"
                  : item.isAction
                  ? "text-red-500 hover:text-red-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div>{item.icon}</div>
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
