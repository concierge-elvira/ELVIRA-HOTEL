/**
 * Preview Photo Gallery Section Component
 *
 * Shows a placeholder for the photo gallery section
 */

import React from "react";

export const PreviewPhotoGallerySection: React.FC = () => {
  const mockPhotos = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400",
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="px-4 mb-4">
        <p className="text-sm text-gray-600">
          Discover our beautiful spaces and amenities
        </p>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4">
          {mockPhotos.map((photo, index) => (
            <div
              key={index}
              className="shrink-0 w-64 h-48 bg-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={photo}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
