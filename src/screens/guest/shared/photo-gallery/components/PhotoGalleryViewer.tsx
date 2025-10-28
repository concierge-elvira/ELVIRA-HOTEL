/**
 * Photo Gallery Viewer Component
 *
 * Full-screen modal viewer for browsing through gallery images
 */

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoGalleryViewerProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoGalleryViewer: React.FC<PhotoGalleryViewerProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    // Disable body scroll when viewer is open
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, handleNext, handlePrevious]);

  if (!isOpen) {
    return null;
  }

  const viewerContent = (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 9999,
        position: "fixed",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute p-3 rounded-full text-white transition-all duration-200"
        style={{
          top: "24px",
          right: "24px",
          zIndex: 10000,
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          border: "2px solid rgba(255, 255, 255, 0.5)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.35)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)")
        }
        aria-label="Close gallery"
      >
        <X size={28} />
      </button>

      {/* Image Counter */}
      <div
        className="absolute text-white text-base font-semibold px-4 py-2 rounded-full"
        style={{
          top: "24px",
          left: "24px",
          zIndex: 10000,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={handlePrevious}
          className="absolute p-4 rounded-full text-white transition-all duration-200"
          style={{
            left: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10000,
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            border: "2px solid rgba(255, 255, 255, 0.5)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "rgba(255, 255, 255, 0.35)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              "rgba(255, 255, 255, 0.25)")
          }
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Main Image */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        style={{ zIndex: 9999 }}
      >
        <img
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
          style={{ maxHeight: "calc(100vh - 200px)" }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute p-4 rounded-full text-white transition-all duration-200"
          style={{
            right: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10000,
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            border: "2px solid rgba(255, 255, 255, 0.5)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "rgba(255, 255, 255, 0.35)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              "rgba(255, 255, 255, 0.25)")
          }
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Thumbnail Strip (bottom) */}
      {images.length > 1 && (
        <div
          className="absolute left-0 right-0 flex justify-center"
          style={{ bottom: "24px", zIndex: 10000 }}
        >
          <div className="flex gap-2 px-4 overflow-x-auto max-w-full scrollbar-hide pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  currentIndex === index
                    ? "border-blue-500 scale-110"
                    : "border-white border-opacity-30 hover:border-opacity-60"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Background Click to Close */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 9998 }}
        onClick={onClose}
        aria-label="Close gallery"
      />
    </div>
  );

  // Render using portal to ensure it's at the root level
  return createPortal(viewerContent, document.body);
};
