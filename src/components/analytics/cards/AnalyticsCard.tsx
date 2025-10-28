import type { ReactNode } from "react";
import {
  colors,
  borderRadius,
  spacing,
  typography,
} from "../../../utils/theme";

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function AnalyticsCard({
  title,
  subtitle,
  children,
  action,
  className = "",
}: AnalyticsCardProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: "white",
        border: `1px solid ${colors.border.DEFAULT}`,
        borderRadius: borderRadius.xl,
        padding: spacing[6],
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: spacing[4],
        }}
      >
        <div>
          <h3
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              margin: 0,
              marginBottom: subtitle ? spacing[1] : 0,
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
