import type { ReactNode } from "react";
import { Card } from "./Card";

interface InfoCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}

export function InfoCard({
  title,
  description,
  icon,
  children,
  actions,
}: InfoCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <div className="text-emerald-600 text-sm">{icon}</div>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-xs text-gray-600">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>

      {children && <div className="mt-2">{children}</div>}
    </Card>
  );
}
