import type { ReactNode } from "react";
import { colors, typography, spacing } from "../../../utils/theme";
import { useCurrentUserHotel } from "../../../hooks/useCurrentUserHotel";

interface PageHeaderProps {
  title: string;
  icon: ReactNode;
  rightContent?: ReactNode;
}

/**
 * Standardized page header component
 * Used across ALL main screens for perfect consistency
 */
export function PageHeader({ title, icon, rightContent }: PageHeaderProps) {
  // Get user's full name from hotel context
  const { data: hotelInfo } = useCurrentUserHotel();
  const userName = hotelInfo?.fullName || "";

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backgroundColor: "#f9fafb", // Soft grey background
        borderBottom: `1px solid ${colors.border.DEFAULT}`,
      }}
    >
      <div style={{ padding: `${spacing[4]} ${spacing[6]}` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className="w-6 h-6 mr-3"
              style={{ color: colors.primary[600] }}
            >
              {icon}
            </div>
            <h1
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                fontFamily: typography.fontFamily.sans,
                margin: 0,
                lineHeight: typography.lineHeight.tight,
              }}
            >
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {userName && (
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  fontFamily: typography.fontFamily.sans,
                  fontWeight: typography.fontWeight.medium,
                }}
              >
                Welcome, {userName}
              </span>
            )}
            {rightContent && <div>{rightContent}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
