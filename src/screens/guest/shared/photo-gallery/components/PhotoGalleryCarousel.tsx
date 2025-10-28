/**
 * Photo Gallery Carousel Component
 *
 * Horizontal scrollable carousel with auto-scroll and fade effects
 */

import React, { useRef, useEffect, useState } from "react";
import { PhotoGalleryCard } from "./PhotoGalleryCard";

interface PhotoGalleryCarouselProps {
  images: string[];
  onImageClick: (index: number) => void;
  backgroundColor?: string;
}

export const PhotoGalleryCarousel: React.FC<PhotoGalleryCarouselProps> = ({
  images,
  onImageClick,
  backgroundColor = "gray-50",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    if (!scrollRef.current || images.length === 0 || isPaused) return;

    const scrollContainer = scrollRef.current;
    const scrollSpeed = 0.5;
    let animationFrameId: number;

    const scroll = () => {
      if (!scrollContainer) return;

      scrollContainer.scrollLeft += scrollSpeed;

      if (
        scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth
      ) {
        scrollContainer.scrollLeft = 0;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [images.length, isPaused]);

  return (
    <div className="relative">
      {/* Left fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />

      {/* Right fade effect */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="flex gap-3 px-4 pb-2">
          {images.map((imageUrl, index) => (
            <PhotoGalleryCard
              key={index}
              imageUrl={imageUrl}
              index={index}
              onClick={() => onImageClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
