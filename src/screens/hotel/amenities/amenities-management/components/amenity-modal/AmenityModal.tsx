import { useEffect, useState } from "react";
import {
  ModalForm,
  ModalFormActions,
} from "../../../../../../components/ui/modalform";
import { useUpdateAmenity } from "../../../../../../hooks/amenities/amenities/useAmenities";
import { ImageSection } from "./ImageSection";
import { BasicInfoSection } from "./BasicInfoSection";
import { DescriptionSection } from "./DescriptionSection";
import { RecommendedSection } from "./RecommendedSection";
import type { AmenityFormData, FormErrors, AmenityModalProps } from "./types";

const AMENITY_CATEGORIES = [
  "Room Service",
  "Spa & Wellness",
  "Fitness",
  "Business Services",
  "Entertainment",
  "Transportation",
  "Concierge",
  "Laundry & Cleaning",
  "Other Services",
];

export function AmenityModal({
  isOpen,
  onClose,
  mode,
  amenity,
  onSubmit,
  onEdit,
  onDelete,
}: AmenityModalProps) {
  const updateAmenity = useUpdateAmenity();
  const [formData, setFormData] = useState<AmenityFormData>({
    name: "",
    price: "",
    category: "",
    description: "",
    imageUrl: null,
    recommended: false,
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, setIsPending] = useState(false);

  // Reset form when modal opens/closes or amenity changes
  useEffect(() => {
    if (isOpen && amenity) {
      setFormData({
        name: amenity.name || "",
        price: amenity.price?.toString() || "",
        category: amenity.category || "",
        description: amenity.description || "",
        imageUrl: amenity.image_url || null,
        recommended: amenity.recommended || false,
        isActive: amenity.is_active,
      });
    } else if (isOpen && !amenity) {
      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        imageUrl: null,
        recommended: false,
        isActive: true,
      });
    }
    setErrors({});
  }, [amenity, isOpen]);

  const handleFieldChange = (
    field: keyof AmenityFormData,
    value: string | boolean | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Amenity name is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
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

  const handleStatusToggle = async (newStatus: boolean) => {
    if (!amenity) return;

    // Optimistically update the local state
    setFormData((prev) => ({ ...prev, isActive: newStatus }));

    try {
      await updateAmenity.mutateAsync({
        id: amenity.id,
        updates: { is_active: newStatus },
      });
    } catch (error) {
      console.error("Error updating amenity status:", error);
      // Revert on error
      setFormData((prev) => ({ ...prev, isActive: !newStatus }));
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Add Amenity";
      case "edit":
        return "Edit Amenity";
      case "view":
        return "Amenity Details";
      default:
        return "Amenity";
    }
  };

  const getSubmitLabel = () => {
    return mode === "edit" ? "Save Changes" : "Add Amenity";
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
      <ImageSection
        formData={formData}
        disabled={mode === "view"}
        onChange={(url: string | null) => handleFieldChange("imageUrl", url)}
        onStatusToggle={mode === "view" ? handleStatusToggle : undefined}
      />

      <BasicInfoSection
        formData={formData}
        errors={errors}
        mode={mode}
        onChange={handleFieldChange}
        categories={AMENITY_CATEGORIES}
      />

      <DescriptionSection
        formData={formData}
        errors={errors}
        mode={mode}
        onChange={handleFieldChange}
      />

      <RecommendedSection
        formData={formData}
        mode={mode}
        onChange={handleFieldChange}
      />
    </ModalForm>
  );
}
