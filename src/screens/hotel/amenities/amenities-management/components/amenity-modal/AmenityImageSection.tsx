import { ModalFormSection } from "../../../../../../components/ui";
import {
  ItemImageUpload,
  ItemImageDisplay,
} from "../../../../../../components/ui/forms";
import type { AmenitySectionProps } from "./types";

/**
 * AmenityImageSection - Image upload/display for amenities
 * Shows upload in create/edit mode, display in view mode
 */
import { ModalFormSection } from "../../../../../../components/ui";
import {
  ItemImageUpload,
  ItemImageDisplay,
} from "../../../../../../components/ui/forms";
import type { AmenityFormData } from "../../../../../../hooks/forms/useAmenityForm";

interface AmenityImageSectionProps {
  formData: AmenityFormData & { isActive: boolean };
  disabled: boolean;
  onChange: (url: string | null) => void;
  onStatusToggle?: (newStatus: boolean) => void;
}

/**
 * AmenityImageSection - Image upload/display for amenities
 * Shows upload in create/edit mode, display in view mode
 */
export function AmenityImageSection({
  formData,
  disabled,
  onChange,
  onStatusToggle,
}: AmenityImageSectionProps) {
  if (disabled) {
    // View mode: Display image with status toggle
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

  // Create/Edit mode: Image upload
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

```
