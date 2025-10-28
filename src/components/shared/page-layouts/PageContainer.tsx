import type { ReactNode } from "react";
import { colors, spacing, typography } from "../../../utils/theme";

interface PageContainerProps {
  children: ReactNode;
  noPadding?: boolean;
}

/**
 * Standard page container with consistent padding
 * Used across all hotel management pages
 */
export function PageContainer({
  children,
  noPadding = false,
}: PageContainerProps) {
  return (
    <div
      style={
        noPadding
          ? {}
          : {
              padding: spacing[6],
              backgroundColor: colors.background.main,
              fontFamily: typography.fontFamily.sans,
            }
      }
    >
      {children}
    </div>
  );
}
