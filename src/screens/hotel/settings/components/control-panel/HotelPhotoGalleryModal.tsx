import { useState, useEffect } from "react";
import { ModalForm, Button } from "../../../../../components/ui";
import { ItemImageGallery } from "../../../../../components/ui/forms";
import { useHotelId } from "../../../../../hooks";

interface HotelPhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageUrls: string[]) => Promise<void>;
  initialImages?: string[];
}

const MAX_IMAGES = 8;

export function HotelPhotoGalleryModal({
  isOpen,
  onClose,
  onSave,
  initialImages = [],
}: HotelPhotoGalleryModalProps) {
  const hotelId = useHotelId();
  const [images, setImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse initial images
  useEffect(() => {
    if (isOpen && initialImages) {
      // Parse if string, otherwise use as-is
      let parsedImages = initialImages;
      if (typeof initialImages === "string") {
        try {
          parsedImages = JSON.parse(initialImages);
        } catch {
          parsedImages = [];
        }
      }

      // Ensure it's an array and filter valid URLs
      const validUrls = (
        Array.isArray(parsedImages) ? parsedImages : []
      ).filter((url) => typeof url === "string" && url.startsWith("http"));

      setImages(validUrls);
    }
  }, [initialImages, isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await onSave(images);
      onClose();
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save gallery. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const handleAddImageClick = () => {
    document.getElementById("hotel-gallery-upload")?.click();
  };

  const isMaxImages = images.length >= MAX_IMAGES;

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={handleClose}
      title="Hotel Photo Gallery"
      size="xl"
      footer={
        <>
          <Button
            variant="outline"
            onClick={handleAddImageClick}
            disabled={isSaving || isMaxImages}
          >
            Add Image
          </Button>
          <div className="flex gap-3 ml-auto">
            <Button variant="outline" onClick={handleClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Gallery"}
            </Button>
          </div>
        </>
      }
    >
      <p className="text-sm text-gray-600">
        Upload up to {MAX_IMAGES} photos to showcase your hotel.
      </p>

      {/* Image Gallery Component - Hide upload button */}
      <ItemImageGallery
        value={images}
        onChange={setImages}
        disabled={isSaving}
        bucketPath={`hotel-gallery/${hotelId || ""}`}
        maxImages={MAX_IMAGES}
        label="Gallery Photos"
        hideUploadButton={true}
        uploadButtonId="hotel-gallery-upload"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </ModalForm>
  );
}
