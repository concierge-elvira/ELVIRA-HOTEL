/**
 * Experiences Category Cards Component
 *
 * Displays 3 cards for experience-related services:
 * - Gastronomy
 * - Tours
 * - Wellness
 */

import React from "react";
import { CategoryCard } from "./CategoryCard";

interface ExperiencesCategoryCardsProps {
  onNavigate?: (path: string) => void;
}

export const ExperiencesCategoryCards: React.FC<
  ExperiencesCategoryCardsProps
> = ({ onNavigate }) => {
  const experienceCards = [
    {
      id: "gastronomy",
      title: "Gastronomy",
      description: "Culinary experiences and dining",
      path: "/guest/gastronomy",
    },
    {
      id: "tours",
      title: "Tours",
      description: "Local attractions and excursions",
      path: "/guest/tours",
    },
    {
      id: "wellness",
      title: "Wellness",
      description: "Spa and relaxation services",
      path: "/guest/wellness",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 px-4">
      {experienceCards.map((card) => (
        <CategoryCard
          key={card.id}
          title={card.title}
          description={card.description}
          onClick={() => onNavigate?.(card.path)}
        />
      ))}
    </div>
  );
};
