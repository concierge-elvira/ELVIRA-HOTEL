import { useState, useEffect } from "react";
import {
  ModalForm,
  ModalFormActions,
} from "../../../../../../components/ui/modalform";
import { useUpdateMenuItem } from "../../../../../../hooks/hotel-restaurant";
import { ImageSection } from "./ImageSection";
import { BasicInfoSection } from "./BasicInfoSection";
import { DescriptionSection } from "./DescriptionSection";
import { AdditionalDetailsSection } from "./AdditionalDetailsSection";
import type { MenuItemModalProps, MenuItemFormData, FormErrors } from "./types";

const MENU_CATEGORIES = [
  "Appetizers",
  "Main Course",
  "Desserts",
  "Beverages",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
];

const SERVICE_TYPE_OPTIONS = [
  { value: "room-service", label: "Room Service" },
  { value: "restaurant", label: "Restaurant" },
];

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Halal",
  "Kosher",
];

interface MenuItemModalWithRestaurantsProps extends MenuItemModalProps {
  restaurants: Array<{ value: string; label: string }>;
}

export function MenuItemModal({
  isOpen,
  onClose,
  mode,
  menuItem,
  onSubmit,
  onEdit,
  onDelete,
  restaurants,
}: MenuItemModalWithRestaurantsProps) {
  const updateMenuItem = useUpdateMenuItem();
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: "",
    price: "",
    category: "",
    description: "",
    imageUrl: null,
    hotelRecommended: false,
    isActive: true,
    restaurantIds: [],
    serviceTypes: [],
    dietaryInfo: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when menuItem data changes
  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name || "",
        price: menuItem.price?.toString() || "",
        category: menuItem.category || "",
        description: menuItem.description || "",
        imageUrl: menuItem.image_url || null,
        hotelRecommended: menuItem.hotel_recommended || false,
        isActive: menuItem.is_active,
        restaurantIds: menuItem.restaurant_ids || [],
        serviceTypes: menuItem.service_type || [],
        dietaryInfo: menuItem.special_type || [],
      });
    } else {
      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        imageUrl: null,
        hotelRecommended: false,
        isActive: true,
        restaurantIds: [],
        serviceTypes: [],
        dietaryInfo: [],
      });
    }
    setErrors({});
  }, [menuItem, isOpen]);

  const handleFieldChange = (
    field: keyof MenuItemFormData,
    value: string | string[] | boolean | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }

    const priceNum = parseFloat(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
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
      price: "",
      category: "",
      description: "",
      imageUrl: null,
      hotelRecommended: false,
      isActive: true,
      restaurantIds: [],
      serviceTypes: [],
      dietaryInfo: [],
    });
    setErrors({});
    onClose();
  };

  const handleStatusToggle = async (newStatus: boolean) => {
    if (!menuItem) return;

    // Optimistically update the local state
    setFormData((prev) => ({ ...prev, isActive: newStatus }));

    try {
      await updateMenuItem.mutateAsync({
        id: menuItem.id,
        updates: { is_active: newStatus },
      });
    } catch (error) {
      console.error("Error updating menu item status:", error);
      // Revert on error
      setFormData((prev) => ({ ...prev, isActive: !newStatus }));
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Add Menu Item";
      case "edit":
        return "Edit Menu Item";
      case "view":
        return "Menu Item Details";
      default:
        return "Menu Item";
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
          submitLabel={mode === "create" ? "Add Menu Item" : "Update Menu Item"}
        />
      }
    >
      <ImageSection
        formData={formData}
        disabled={disabled}
        onChange={(url) => handleFieldChange("imageUrl", url)}
        onStatusToggle={disabled ? handleStatusToggle : undefined}
      />

      <BasicInfoSection
        formData={formData}
        errors={errors}
        disabled={disabled}
        onChange={handleFieldChange}
        categories={MENU_CATEGORIES}
      />

      <DescriptionSection
        formData={formData}
        errors={errors}
        disabled={disabled}
        onChange={handleFieldChange}
      />

      <AdditionalDetailsSection
        formData={formData}
        disabled={disabled}
        onChange={handleFieldChange}
        restaurants={restaurants}
        serviceTypeOptions={SERVICE_TYPE_OPTIONS}
        dietaryOptions={DIETARY_OPTIONS}
      />
    </ModalForm>
  );
}
