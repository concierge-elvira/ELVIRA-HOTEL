/**
 * Preview Category Card Component
 *
 * Preview version of the category card that uses appearance context
 */

import React from "react";
import {
  useAppearance,
  getBorderRadiusClass,
  getCardStyleClass,
} from "./contexts/AppearanceContext";

interface PreviewCategoryCardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export const PreviewCategoryCard: React.FC<PreviewCategoryCardProps> = ({
  title,
  description,
  onClick,
}) => {
  const { config } = useAppearance();
  const borderRadiusClass = getBorderRadiusClass(config.shapes.borderRadius);
  const cardStyleClass = getCardStyleClass(config.shapes.cardStyle);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left ${borderRadiusClass} ${cardStyleClass} transition-all duration-200 touch-manipulation overflow-hidden`}
      style={{
        borderColor: `${config.colors.text.secondary}30`,
      }}
    >
      {/* Title with background */}
      <div
        className="px-3 py-2"
        style={{
          backgroundColor: `${config.colors.primary}10`,
        }}
      >
        <h3
          className="font-semibold"
          style={{
            fontSize: config.typography.fontSize.small,
            color: config.colors.text.primary,
          }}
        >
          {title}
        </h3>
      </div>

      {/* Description without background */}
      <div
        className="px-3 py-2"
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <p
          className="leading-snug"
          style={{
            fontSize: config.typography.fontSize.small,
            color: config.colors.text.secondary,
          }}
        >
          {description}
        </p>
      </div>
    </button>
  );
};
