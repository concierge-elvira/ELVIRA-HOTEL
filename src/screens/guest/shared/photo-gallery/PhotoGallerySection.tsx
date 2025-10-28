/**
 * Photo Gallery Section Component
 *
 * Displays a horizontal scrollable carousel of hotel photos with auto-scroll
 * and full-screen viewer on click
 */

import React, { useState, useEffect } from "react";
import {
  PhotoGalleryHeader,
  PhotoGalleryCarousel,
  PhotoGalleryViewer,
} from "./components";

interface PhotoGallerySectionProps {
  images: string[];
  title?: string;
  subtitle?: string;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  images,
  subtitle = "Discover our beautiful spaces and amenities",
}) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Hide/show bottom navigation when viewer opens/closes
  useEffect(() => {
    if (viewerOpen) {
      // Hide bottom navigation
      const bottomNavs = document.querySelectorAll(
        'nav, [class*="bottom"], [class*="Bottom"]'
      );
      bottomNavs.forEach((nav) => {
        (nav as HTMLElement).style.display = "none";
      });
    } else {
      // Restore bottom navigation
      const bottomNavs = document.querySelectorAll(
        'nav, [class*="bottom"], [class*="Bottom"]'
      );
      bottomNavs.forEach((nav) => {
        (nav as HTMLElement).style.display = "";
      });
    }

    return () => {
      // Cleanup on unmount
      const bottomNavs = document.querySelectorAll(
        'nav, [class*="bottom"], [class*="Bottom"]'
      );
      bottomNavs.forEach((nav) => {
        (nav as HTMLElement).style.display = "";
      });
    };
  }, [viewerOpen]);

  if (!images || images.length === 0) {
    return null;
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };

  return (
    <>
      <section className="py-8 bg-gray-50">
        <PhotoGalleryHeader subtitle={subtitle} />
        <PhotoGalleryCarousel
          images={images}
          onImageClick={handleImageClick}
          backgroundColor="gray-50"
        />
      </section>

      <PhotoGalleryViewer
        images={images}
        initialIndex={selectedImageIndex}
        isOpen={viewerOpen}
        onClose={handleCloseViewer}
      />
    </>
  );
};
