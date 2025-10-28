import { ModalFormSection } from "../../../../../../components/ui/modalform";
import {
  ItemImageUpload,
  ItemImageDisplay,
} from "../../../../../../components/ui/forms";
import type { AmenityFormData } from "./types";

interface ImageSectionProps {
  formData: AmenityFormData;
  disabled: boolean;
  onChange: (url: string | null) => void;
  onStatusToggle?: (newStatus: boolean) => void;
}

export function ImageSection({
  formData,
  disabled,
  onChange,
  onStatusToggle,
}: ImageSectionProps) {
  if (disabled) {
    // View mode - show image display
    return (
      <ModalFormSection title="Image">
        <ItemImageDisplay
          imageUrl={formData.imageUrl}
          itemName={formData.name}
          price={parseFloat(formData.price)}
          isActive={formData.isActive}
          onStatusToggle={onStatusToggle}
        />
      </ModalFormSection>
    );
  }

  // Create/Edit mode - show image upload
  return (
    <ModalFormSection title="Amenity Image">
      <ItemImageUpload
        value={formData.imageUrl}
        onChange={onChange}
        disabled={disabled}
        bucketPath="amenities"
        label="Upload Image"
      />
    </ModalFormSection>
  );
}
