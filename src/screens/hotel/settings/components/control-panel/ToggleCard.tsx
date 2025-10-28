import type { ReactNode } from "react";

interface ToggleCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  disabled?: boolean;
}

export function ToggleCard({
  icon,
  title,
  description,
  isEnabled,
  onToggle,
  actionButton,
  disabled = false,
}: ToggleCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-gray-400 shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {title}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {description}
            </p>
            {actionButton && isEnabled && (
              <button
                onClick={actionButton.onClick}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-2 inline-flex items-center"
              >
                {actionButton.label}
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => onToggle(!isEnabled)}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shrink-0 ${
            isEnabled ? "bg-emerald-600" : "bg-gray-200"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
