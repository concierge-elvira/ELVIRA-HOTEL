import { useEffect, useState } from "react";
import {
  ModalForm,
  ModalFormActions,
} from "../../../../../../components/ui/modalform";
import { BasicInfoSection } from "./BasicInfoSection";
import { LocationSection } from "./LocationSection";
import { DescriptionSection } from "./DescriptionSection";
import { ImageSection } from "./ImageSection";
import type {
  RecommendedPlaceFormData,
  FormErrors,
  RecommendedPlaceModalProps,
} from "./types";

export function RecommendedPlaceModal({
  isOpen,
  onClose,
  mode,
  place,
  onSubmit,
  onEdit,
  onDelete,
}: RecommendedPlaceModalProps) {
  const [formData, setFormData] = useState<RecommendedPlaceFormData>({
    placeName: "",
    address: "",
    description: "",
    latitude: null,
    longitude: null,
    isActive: true,
    imageUrls: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, setIsPending] = useState(false);

  // Reset form when modal opens/closes or place changes
  useEffect(() => {
    if (isOpen && place) {
      // Parse image_url if it exists
      let parsedImages: string[] = [];
      if (place.image_url) {
        try {
          parsedImages = JSON.parse(place.image_url);
          if (!Array.isArray(parsedImages)) {
            parsedImages = [];
          }
        } catch {
          // If it's not JSON, treat as single URL
          parsedImages = [place.image_url];
        }
      }

      setFormData({
        placeName: place.place_name || "",
        address: place.address || "",
        description: place.description || "",
        latitude: place.latitud || null,
        longitude: place.longitud || null,
        isActive: place.is_active,
        imageUrls: parsedImages,
      });
    } else if (isOpen && !place) {
      setFormData({
        placeName: "",
        address: "",
        description: "",
        latitude: null,
        longitude: null,
        isActive: true,
        imageUrls: [],
      });
    }
    setErrors({});
  }, [place, isOpen]);

  const handleFieldChange = (
    field: keyof RecommendedPlaceFormData,
    value: string | number | boolean | null | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.placeName.trim()) {
      newErrors.placeName = "Place name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (mode === "view") return;

    if (!validateForm()) return;

    setIsPending(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Add Recommended Place";
      case "edit":
        return "Edit Recommended Place";
      case "view":
        return "Place Details";
      default:
        return "Recommended Place";
    }
  };

  const getSubmitLabel = () => {
    return mode === "edit" ? "Save Changes" : "Add Place";
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size="lg"
      footer={
        <ModalFormActions
          mode={mode}
          onCancel={onClose}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel={getSubmitLabel()}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      }
    >
      <BasicInfoSection
        mode={mode}
        formData={formData}
        errors={errors}
        onChange={handleFieldChange}
      />

      <LocationSection
        mode={mode}
        formData={formData}
        errors={errors}
        onChange={handleFieldChange}
      />

      <DescriptionSection
        mode={mode}
        formData={formData}
        errors={errors}
        onChange={handleFieldChange}
      />

      <ImageSection
        mode={mode}
        formData={formData}
        errors={errors}
        onChange={handleFieldChange}
      />
    </ModalForm>
  );
}
