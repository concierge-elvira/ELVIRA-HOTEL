/**
 * Shared Category Card Component
 *
 * Reusable card component for displaying category items
 * Features a title and description in a clean card layout
 */

import React from "react";

interface CategoryCardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation overflow-hidden"
    >
      {/* Title with background */}
      <div className="bg-indigo-50/60 px-3 py-2">
        <h3 className="text-xs font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Description without background */}
      <div className="bg-white px-3 py-2">
        <p className="text-xs text-gray-600 leading-snug">{description}</p>
      </div>
    </button>
  );
};
