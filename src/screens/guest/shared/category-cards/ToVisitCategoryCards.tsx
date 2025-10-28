/**
 * To Visit Category Cards Component
 *
 * Displays a single card for "To Visit" places:
 * - Places to Visit
 */

import React from "react";
import { CategoryCard } from "./CategoryCard";

interface ToVisitCategoryCardsProps {
  onNavigate?: (path: string) => void;
}

export const ToVisitCategoryCards: React.FC<ToVisitCategoryCardsProps> = ({
  onNavigate,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2.5 px-4">
      <CategoryCard
        title="Places to Visit"
        description="Discover must-see locations"
        onClick={() => onNavigate?.("/guest/to-visit")}
      />
    </div>
  );
};
