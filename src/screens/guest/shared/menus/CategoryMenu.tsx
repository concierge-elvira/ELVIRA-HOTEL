/**
 * Category Menu Component
 *
 * Horizontal menu with categories: Hotel, Experiences, To Visit
 * Matches the reference design with icon-based navigation
 */

import { Building2, MapPin, Compass } from "lucide-react";
import { useState } from "react";

export type CategoryType = "hotel" | "experiences" | "tovisit";

interface CategoryMenuProps {
  onCategoryChange?: (category: CategoryType) => void;
}

interface CategoryItem {
  id: CategoryType;
  label: string;
  icon: React.ReactNode;
}

const categories: CategoryItem[] = [
  {
    id: "hotel",
    label: "Hotel",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: "experiences",
    label: "Experiences",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    id: "tovisit",
    label: "To Visit",
    icon: <Compass className="w-5 h-5" />,
  },
];

export const CategoryMenu = ({ onCategoryChange }: CategoryMenuProps) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("hotel");

  const handleCategoryClick = (categoryId: CategoryType) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <div className="mt-2 mb-2 -mx-4">
      {/* Grid container - 3 equal columns */}
      <div className="grid grid-cols-3 bg-white border-b border-gray-200">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                relative flex flex-col items-center justify-center gap-1
                py-2.5 px-2
                transition-all duration-200 touch-manipulation
                ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              {/* Icon */}
              <div>{category.icon}</div>

              {/* Label */}
              <span
                className={`text-xs font-medium ${
                  isActive ? "font-semibold" : ""
                }`}
              >
                {category.label}
              </span>

              {/* Active indicator - blue underline that overlaps with bottom border */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 z-10" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
