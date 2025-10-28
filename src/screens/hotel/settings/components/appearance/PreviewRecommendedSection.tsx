/**
 * Preview Recommended Section Component
 *
 * Shows a placeholder for the "Recommended for You" section
 */

import React from "react";

export const PreviewRecommendedSection: React.FC = () => {
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
        <h2 className="text-lg font-bold text-gray-900">
          Recommended <span className="text-blue-600 font-bold">for You</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Curated selections from our hotel services
        </p>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="relative">
        {/* Left fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

        {/* Right fade effect */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 pb-2">
            {mockItems.map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-40 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Image */}
                <div className="relative h-32 bg-gray-200">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.price && (
                    <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded text-xs font-semibold">
                      ${item.price.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
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
