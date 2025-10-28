/**
 * Recommended Section Component
 *
 * Displays a horizontal scrollable section of recommended items
 * Can be used for products, menu items, amenities, or any other recommendations
 */

import React, { useEffect, useRef } from "react";
import { RecommendedCard } from "./RecommendedCard";

export interface RecommendedItem {
  id: string;
  title: string;
  description: string;
  price?: number;
  imageUrl?: string;
  category?: string;
}

interface RecommendedSectionProps {
  title: string;
  subtitle?: string;
  items: RecommendedItem[];
  onItemClick?: (item: RecommendedItem) => void;
  emptyMessage?: string;
  showPrice?: boolean; // Control whether to show price badges
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  title,
  subtitle,
  items,
  onItemClick,
  emptyMessage = "No recommendations available",
  showPrice = true, // Default to showing price
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || items.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame
    const cardWidth = 172; // 160px card + 12px gap
    const maxScroll = cardWidth * items.length;

    const autoScroll = () => {
      scrollPosition += scrollSpeed;

      // Reset to start when reaching the end
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      requestAnimationFrame(autoScroll);
    };

    const animationId = requestAnimationFrame(autoScroll);

    // Pause on hover/touch
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => requestAnimationFrame(autoScroll);

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("touchstart", handleMouseEnter);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      scrollContainer.removeEventListener("touchstart", handleMouseEnter);
    };
  }, [items.length]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      {/* Header */}
      <div className="px-4 mb-3">
        <h2 className="text-lg font-bold text-gray-900">
          {title} <span className="text-blue-600 font-bold">for You</span>
        </h2>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="relative">
        {/* Left fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

        {/* Right fade effect */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 pb-2">
            {items.map((item) => (
              <RecommendedCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                price={item.price}
                imageUrl={item.imageUrl}
                category={item.category}
                showPrice={showPrice}
                onClick={() => onItemClick?.(item)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
