/**
 * Preview Recommended Section Component
 *
 * Shows a placeholder for the "Recommended for You" section
 */

import React from "react";
import {
  useAppearance,
  getBorderRadiusClass,
  getCardStyleClass,
} from "./contexts/AppearanceContext";

export const PreviewRecommendedSection: React.FC = () => {
  const { config } = useAppearance();
  const borderRadiusClass = getBorderRadiusClass(config.shapes.borderRadius);
  const cardStyleClass = getCardStyleClass(config.shapes.cardStyle);

  const mockItems = [
    {
      id: "1",
      title: "24/7 Personal Butler Service",
      description: "For the ultimate in personalized service",
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    },
    {
      id: "2",
      title: "Bruschetta al Pomodoro",
      description: "Toasted ciabatta bread with fresh tomatoes",
      imageUrl:
        "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400",
      price: 9.0,
    },
    {
      id: "3",
      title: "Spa Treatment",
      description: "Relax and rejuvenate",
      imageUrl:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400",
    },
  ];

  return (
    <section className="py-4">
      {/* Header */}
      <div className="px-4 mb-3">
        <h2
          className="font-bold"
          style={{
            fontSize: config.typography.fontSize.heading,
            color: config.colors.text.primary,
          }}
        >
          Recommended{" "}
          <span
            style={{
              color: config.colors.primary,
              fontWeight: config.typography.fontWeight.bold,
            }}
          >
            for You
          </span>
        </h2>
        <p
          className="mt-1"
          style={{
            fontSize: config.typography.fontSize.small,
            color: config.colors.text.secondary,
          }}
        >
          Curated selections from our hotel services
        </p>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="relative">
        {/* Left fade effect */}
        <div
          className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${"#f9fafb"} 0%, transparent 100%)`,
          }}
        />

        {/* Right fade effect */}
        <div
          className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to left, ${"#f9fafb"} 0%, transparent 100%)`,
          }}
        />

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 pb-2">
            {mockItems.map((item) => (
              <div
                key={item.id}
                className={`shrink-0 w-40 ${borderRadiusClass} overflow-hidden ${cardStyleClass} transition-shadow duration-200`}
                style={{ backgroundColor: "#ffffff" }}
              >
                {/* Image */}
                <div
                  className={`relative h-32 ${borderRadiusClass}`}
                  style={{
                    backgroundColor: `${config.colors.text.secondary}20`,
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.price && (
                    <div
                      className={`absolute bottom-2 left-2 bg-opacity-75 px-2 py-1 ${borderRadiusClass}`}
                      style={{
                        backgroundColor: `${config.colors.text.primary}CC`,
                        color: config.colors.text.inverse,
                        fontSize: config.typography.fontSize.small,
                        fontWeight: config.typography.fontWeight.semibold,
                      }}
                    >
                      ${item.price.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3
                    className="font-semibold line-clamp-2 mb-1"
                    style={{
                      fontSize: config.typography.fontSize.small,
                      color: config.colors.text.primary,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="line-clamp-2"
                    style={{
                      fontSize: config.typography.fontSize.small,
                      color: config.colors.text.secondary,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
