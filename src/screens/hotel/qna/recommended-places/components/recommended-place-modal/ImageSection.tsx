import { ItemImageGallery } from "../../../../../../components/ui/forms";
import type { PlaceSectionProps } from "./types";
import { useHotelId } from "../../../../../../hooks";

export function ImageSection({ mode, formData, onChange }: PlaceSectionProps) {
  const hotelId = useHotelId();

  const handleImageChange = (newImages: string[]) => {
    onChange("imageUrls", newImages);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Photos
        <span className="text-sm font-normal text-gray-500 ml-2">
          (Optional)
        </span>
      </h3>

      <ItemImageGallery
        value={formData.imageUrls}
        onChange={handleImageChange}
        disabled={mode === "view"}
        bucketPath={`hotel-gallery/${hotelId || ""}`}
        maxImages={8}
        label="Place Photos"
        hideUploadButton={false}
      />

      <p className="text-sm text-gray-500">
        Upload photos of this recommended place. Maximum 8 images.
      </p>
    </div>
  );
}
