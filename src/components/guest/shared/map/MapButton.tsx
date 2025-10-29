/**
 * Map Button Component
 *
 * Button to view locations on a map
 * Shows map icon, styled similarly to CartButton
 */

import React from "react";
import { Map } from "lucide-react";

interface MapButtonProps {
  onClick: () => void;
  visible?: boolean;
}

export const MapButton: React.FC<MapButtonProps> = ({
  onClick,
  visible = true,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 p-0 hover:opacity-70 transition-opacity"
      aria-label="Open map"
    >
      <Map className="text-gray-700" size={20} />
    </button>
  );
};
