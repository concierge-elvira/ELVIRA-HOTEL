import type { ReactNode } from "react";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => ReactNode;
  width?: string;
}

export interface TableAction<T = Record<string, unknown>> {
  label: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: (item: T) => boolean;
}
