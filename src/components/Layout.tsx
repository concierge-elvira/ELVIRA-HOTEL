import type { ReactNode, ReactElement } from "react";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { colors, typography } from "../utils/theme";
import { sidebarColors } from "../utils/theme";

interface MenuItem {
  id: string;
  label: string;
  icon: ReactElement;
}

interface LayoutProps {
  children: ReactNode;
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
}

export function Layout({
  children,
  user,
  onSignOut,
  menuItems,
  activeMenuItem,
  onMenuItemChange,
  collapsible = false,
  hotelName,
}: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: colors.background.main,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {/* Collapse Button - Rendered at Layout level for proper z-index */}
      {collapsible && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="fixed top-4 transition-all duration-300"
          style={{
            left: isCollapsed ? "68px" : "244px",
            zIndex: 99999,
            width: "28px",
            height: "56px",
            background: sidebarColors.background,
            backdropFilter: "blur(10px)",
            borderRadius: "0 12px 12px 0",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "3px 0 12px rgba(0, 0, 0, 0.2)",
            maskImage: "linear-gradient(to right, transparent 10%, black 40%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 10%, black 40%)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: "white" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
            />
          </svg>
        </button>
      )}

      <Sidebar
        user={user}
        onSignOut={onSignOut}
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        onMenuItemChange={onMenuItemChange}
        collapsible={collapsible}
        hotelName={hotelName}
        isCollapsed={isCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Sticky Footer */}
        <footer
          className="shrink-0 sticky bottom-0"
          style={{
            backgroundColor: colors.background.card,
            borderTop: `1px solid ${colors.border.DEFAULT}`,
            padding: "1rem",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p
              className="text-center text-sm"
              style={{ color: colors.text.secondary }}
            >
              © 2025 ELVIRA CONCIERGE. Hotel Management System
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
