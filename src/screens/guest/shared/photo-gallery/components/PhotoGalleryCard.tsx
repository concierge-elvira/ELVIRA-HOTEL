/**
 * Photo Gallery Card Component
 *
 * Individual card for displaying a photo in the gallery carousel
 */

import React from "react";

interface PhotoGalleryCardProps {
  imageUrl: string;
  index: number;
  onClick: () => void;
}

export const PhotoGalleryCard: React.FC<PhotoGalleryCardProps> = ({
  imageUrl,
  index,
  onClick,
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
  };

  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-72 h-48 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <img
        src={imageUrl}
        alt={`Gallery ${index + 1}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        onError={handleError}
      />
    </button>
  );
};
