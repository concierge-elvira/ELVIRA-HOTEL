import { ModalFormSection } from "../../../../../../components/ui/modalform";
import type { Restaurant } from "./types";

interface StatusSectionProps {
  restaurant: Restaurant | null | undefined;
  onToggle?: (newStatus: boolean) => void;
  isUpdating?: boolean;
}

export function StatusSection({
  restaurant,
  onToggle,
  isUpdating,
}: StatusSectionProps) {
  if (!restaurant) return null;

  return (
    <ModalFormSection title="Status">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          Restaurant Status
        </span>
        <button
          onClick={() => onToggle?.(!restaurant.is_active)}
          disabled={isUpdating || !onToggle}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            restaurant.is_active
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } ${
            isUpdating || !onToggle
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          {restaurant.is_active ? "Active" : "Inactive"}
        </button>
      </div>
    </ModalFormSection>
  );
}
