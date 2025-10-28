import type { ReactNode } from "react";
import { Card } from "./Card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    type: "increase" | "decrease" | "neutral";
  };
  icon?: ReactNode;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  subtitle,
}: StatCardProps) {
  const getChangeColor = (type: "increase" | "decrease" | "neutral") => {
    switch (type) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      case "neutral":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getChangeIcon = (type: "increase" | "decrease" | "neutral") => {
    switch (type) {
      case "increase":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        );
      case "decrease":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        );
      case "neutral":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {change && (
            <div
              className={`flex items-center mt-2 ${getChangeColor(
                change.type
              )}`}
            >
              {getChangeIcon(change.type)}
              <span className="ml-1 text-sm font-medium">{change.value}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 p-3 bg-emerald-100 rounded-2xl">
            <div className="text-emerald-600">{icon}</div>
          </div>
        )}
      </div>
    </Card>
  );
}
