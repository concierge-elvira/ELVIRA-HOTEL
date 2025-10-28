import type { ReactElement } from "react";
import { sidebarColors } from "../utils/theme";

interface MenuItem {
  id: string;
  label: string;
  icon: ReactElement;
}

interface SidebarProps {
  user: {
    email: string;
    role: string;
  };
  onSignOut: () => void;
  menuItems?: MenuItem[];
  activeMenuItem?: string;
  onMenuItemChange?: (itemId: string) => void;
  collapsible?: boolean;
  hotelName?: string;
  isCollapsed?: boolean;
}

export function Sidebar({
  user,
  onSignOut,
  menuItems = [],
  activeMenuItem = "",
  onMenuItemChange,
  collapsible = false,
  hotelName,
  isCollapsed = false,
}: SidebarProps) {
  // Get hotel initials from hotel name
  const getHotelInitials = (name?: string) => {
    if (!name) return user.role.substring(0, 2).toUpperCase();
    return name
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } shrink-0 flex flex-col transition-all duration-300 h-screen sticky top-0`}
      style={{
        background: sidebarColors.background,
        backdropFilter: "blur(10px)",
        backgroundColor: sidebarColors.backgroundRgba,
        boxShadow:
          "4px 0 24px -2px rgba(0, 0, 0, 0.12), 8px 0 16px -4px rgba(0, 0, 0, 0.08)",
        position: "relative",
      }}
    >
      {/* Collapse button moved to Layout component */}
      <div
        className={`p-4 flex-1 overflow-y-auto ${
          isCollapsed ? "flex flex-col" : ""
        }`}
      >
        {/* Header */}
        <div className="mb-6 mt-2">
          {!isCollapsed ? (
            <>
              <div
                style={{
                  color: sidebarColors.text,
                  fontSize: "1rem",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: "1.4",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                {hotelName || `${user.role} Dashboard`}
              </div>
              {/* Horizontal divider */}
              <div
                style={{
                  borderTop: `1px solid ${sidebarColors.border}`,
                  paddingTop: "0.5rem",
                }}
              />
            </>
          ) : (
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                color: sidebarColors.text,
                fontSize: "1.125rem",
                fontWeight: "700",
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "0.05em",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {getHotelInitials(hotelName)}
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav
          className={`-mr-4 mt-6 ${
            isCollapsed ? "flex-1 flex flex-col justify-evenly" : "space-y-1"
          }`}
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onMenuItemChange?.(item.id)}
              className={`w-full flex items-center transition-all duration-200 ${
                activeMenuItem === item.id
                  ? "rounded-l-xl pr-8 font-semibold"
                  : "rounded-xl mr-4"
              }`}
              style={{
                padding: "0.625rem 0.875rem",
                fontSize: "1rem",
                fontFamily: '"Inter", sans-serif',
                fontWeight: activeMenuItem === item.id ? "600" : "500",
                backgroundColor:
                  activeMenuItem === item.id
                    ? sidebarColors.activeBg
                    : "transparent",
                color:
                  activeMenuItem === item.id
                    ? sidebarColors.activeText
                    : sidebarColors.text,
                boxShadow:
                  activeMenuItem === item.id
                    ? "0 4px 12px -2px rgba(0, 0, 0, 0.15)"
                    : "none",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (activeMenuItem !== item.id) {
                  e.currentTarget.style.backgroundColor = sidebarColors.hoverBg;
                  e.currentTarget.style.color = sidebarColors.textHover;
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenuItem !== item.id) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = sidebarColors.text;
                }
              }}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Sign out button at bottom of sidebar */}
      <div
        className="p-4"
        style={{ borderTop: `1px solid ${sidebarColors.border}` }}
      >
        <button
          onClick={onSignOut}
          className={`w-full ${
            isCollapsed ? "px-2" : "px-4"
          } py-3 rounded-lg font-semibold focus:outline-none transition-all duration-200`}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            color: sidebarColors.active,
            fontSize: "0.875rem",
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "0.01em",
            boxShadow: "0 2px 8px -1px rgba(0, 0, 0, 0.1)",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px -2px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.boxShadow =
              "0 2px 8px -1px rgba(0, 0, 0, 0.1)";
          }}
        >
          {isCollapsed ? (
            <svg
              className="w-5 h-5 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          ) : (
            "Sign out"
          )}
        </button>
      </div>
    </aside>
  );
}
