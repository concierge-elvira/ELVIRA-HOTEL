import type { ReactNode } from "react";
import { colors } from "../../../utils/theme";

interface PageContentProps {
  children: ReactNode;
}

/**
 * PageContent - Standardized content wrapper for all pages
 * Ensures consistent background and layout across tab-based and toolbar-based pages
 */
export function PageContent({ children }: PageContentProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background.main,
      }}
    >
      {children}
    </div>
  );
}
