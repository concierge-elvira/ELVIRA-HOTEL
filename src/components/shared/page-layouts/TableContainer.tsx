import type { ReactNode } from "react";
import { colors } from "../../../utils/theme";

interface TableContainerProps {
  children: ReactNode;
}

/**
 * TableContainer - Standardized table content wrapper
 * Ensures consistent background for table content areas
 */
export function TableContainer({ children }: TableContainerProps) {
  return (
    <div style={{ backgroundColor: colors.background.card }}>
      <div className="p-6">{children}</div>
    </div>
  );
}
