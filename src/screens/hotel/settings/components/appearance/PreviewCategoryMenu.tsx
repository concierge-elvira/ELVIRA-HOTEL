/**
 * Preview Category Menu Component
 *
 * Preview version of the category menu that uses appearance context
 */

import { Building2, MapPin, Compass } from "lucide-react";
import { useState } from "react";
import { useAppearance, getIconSizeClass } from "./contexts/AppearanceContext";

export type CategoryType = "hotel" | "experiences" | "tovisit";

interface PreviewCategoryMenuProps {
  onCategoryChange?: (category: CategoryType) => void;
}

interface CategoryItem {
  id: CategoryType;
  label: string;
  icon: React.ReactNode;
}

export const PreviewCategoryMenu = ({
  onCategoryChange,
}: PreviewCategoryMenuProps) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("hotel");
  const { config } = useAppearance();
  const iconSizeClass = getIconSizeClass(config.icons.size);

  const categories: CategoryItem[] = [
    {
      id: "hotel",
      label: "Hotel",
      icon: <Building2 className={iconSizeClass} />,
    },
    {
      id: "experiences",
      label: "Experiences",
      icon: <MapPin className={iconSizeClass} />,
    },
    {
      id: "tovisit",
      label: "To Visit",
      icon: <Compass className={iconSizeClass} />,
    },
  ];

  const handleCategoryClick = (categoryId: CategoryType) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <div className="mt-2 mb-2 -mx-4">
      {/* Grid container - 3 equal columns */}
      <div
        className="grid grid-cols-3 border-b"
        style={{
          backgroundColor: "#ffffff",
          borderColor: `${config.colors.text.secondary}30`,
        }}
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="relative flex flex-col items-center justify-center gap-1 py-2.5 px-2 transition-all duration-200 touch-manipulation"
              style={{
                color: isActive
                  ? config.colors.primary
                  : config.colors.text.secondary,
              }}
            >
              {/* Icon */}
              <div>{category.icon}</div>

              {/* Label */}
              <span
                className={isActive ? "font-semibold" : "font-medium"}
                style={{
                  fontSize: config.typography.fontSize.small,
                }}
              >
                {category.label}
              </span>

              {/* Active indicator - underline that overlaps with bottom border */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 z-10"
                  style={{ backgroundColor: config.colors.primary }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
