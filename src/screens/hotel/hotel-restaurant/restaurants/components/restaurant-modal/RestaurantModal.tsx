import { useState, useEffect } from "react";
import {
  ModalForm,
  ModalFormActions,
} from "../../../../../../components/ui/modalform";
import { BasicInfoSection } from "./BasicInfoSection";
import { DescriptionSection } from "./DescriptionSection";
import { FoodTypesSection } from "./FoodTypesSection";
import { StatusSection } from "./StatusSection";
import type {
  RestaurantModalProps,
  RestaurantFormData,
  FormErrors,
} from "./types";

export function RestaurantModal({
  isOpen,
  onClose,
  mode,
  restaurant,
  onSubmit,
  onEdit,
  onDelete,
}: RestaurantModalProps) {
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    cuisine: "",
    description: "",
    foodTypes: [],
    foodTypesInput: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when restaurant data changes
  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || "",
        cuisine: restaurant.cuisine || "",
        description: restaurant.description || "",
        foodTypes: restaurant.food_types || [],
        foodTypesInput: "",
        isActive: restaurant.is_active,
      });
    } else {
      setFormData({
        name: "",
        cuisine: "",
        description: "",
        foodTypes: [],
        foodTypesInput: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [restaurant, isOpen]);

  const handleFieldChange = (
    field: keyof RestaurantFormData,
    value: string | string[] | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Restaurant name is required";
    }

    if (!formData.cuisine.trim()) {
      newErrors.cuisine = "Cuisine type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (mode === "view") return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
      handleClose();
    } catch {
      // Error handling is done by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      cuisine: "",
      description: "",
      foodTypes: [],
      foodTypesInput: "",
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Add Restaurant";
      case "edit":
        return "Edit Restaurant";
      case "view":
        return "Restaurant Details";
      default:
        return "Restaurant";
    }
  };

  const disabled = mode === "view";

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={handleClose}
      title={getTitle()}
      size="lg"
      footer={
        <ModalFormActions
          mode={mode}
          onCancel={handleClose}
          onSubmit={handleSubmit}
          onEdit={onEdit}
          onDelete={onDelete}
          isPending={isSubmitting}
          submitLabel={
            mode === "create" ? "Add Restaurant" : "Update Restaurant"
          }
        />
      }
    >
      {mode === "view" && <StatusSection restaurant={restaurant} />}

      <BasicInfoSection
        formData={formData}
        errors={errors}
        disabled={disabled}
        onChange={handleFieldChange}
      />

      <DescriptionSection
        formData={formData}
        errors={errors}
        disabled={disabled}
        onChange={handleFieldChange}
      />

      <FoodTypesSection
        formData={formData}
        disabled={disabled}
        onChange={handleFieldChange}
      />
    </ModalForm>
  );
}
