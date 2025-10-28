import { useState, useEffect } from "react";
import {
  useCreateMenuItem,
  useUpdateMenuItem,
} from "../hotel-restaurant/menu-items/useMenuItems";
import { useHotelContext } from "../useHotelContext";
import { useAuth } from "../useAuth";
import type { Database } from "../../types/database";

type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"];

interface FormData {
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl: string | null;
  hotelRecommended: boolean;
  serviceTypes: string[];
  restaurantIds: string[];
}

interface FormErrors {
  name: string;
  price: string;
  category: string;
  description: string;
}

const initialFormData: FormData = {
  name: "",
  price: "",
  category: "",
  description: "",
  imageUrl: null,
  hotelRecommended: false,
  serviceTypes: [],
  restaurantIds: [],
};

const initialErrors: FormErrors = {
  name: "",
  price: "",
  category: "",
  description: "",
};

export function useMenuItemForm(
  menuItem: MenuItemRow | null | undefined,
  onSuccess: () => void
) {
  const { user } = useAuth();
  const { hotelId } = useHotelContext();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const isEditMode = !!menuItem;
  const isPending = createMenuItem.isPending || updateMenuItem.isPending;

  // Initialize form when menuItem changes
  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name,
        price: menuItem.price.toString(),
        category: menuItem.category,
        description: menuItem.description || "",
        imageUrl: menuItem.image_url,
        hotelRecommended: menuItem.hotel_recommended || false,
        serviceTypes: menuItem.service_type || [],
        restaurantIds: menuItem.restaurant_ids || [],
      });
    } else {
      setFormData(initialFormData);
    }
  }, [menuItem]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: "",
      price: "",
      category: "",
      description: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.price && !newErrors.category;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!hotelId || !user?.id) {
return;
    }

    try {
      if (isEditMode && menuItem) {
        await updateMenuItem.mutateAsync({
          id: menuItem.id,
          updates: {
            name: formData.name.trim(),
            price: parseFloat(formData.price),
            category: formData.category,
            description: formData.description.trim() || null,
            image_url: formData.imageUrl,
            hotel_recommended: formData.hotelRecommended,
            service_type:
              formData.serviceTypes.length > 0 ? formData.serviceTypes : null,
            restaurant_ids:
              formData.restaurantIds.length > 0 ? formData.restaurantIds : null,
          },
        });
      } else {
        await createMenuItem.mutateAsync({
          name: formData.name.trim(),
          price: parseFloat(formData.price),
          category: formData.category,
          description: formData.description.trim() || null,
          image_url: formData.imageUrl,
          hotel_recommended: formData.hotelRecommended,
          service_type:
            formData.serviceTypes.length > 0 ? formData.serviceTypes : null,
          restaurant_ids:
            formData.restaurantIds.length > 0 ? formData.restaurantIds : null,
          hotel_id: hotelId,
          created_by: user.id,
          is_active: true,
        });
      }

      resetForm();
      onSuccess();
    } catch (error) {
}
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors(initialErrors);
  };

  return {
    formData,
    errors,
    isEditMode,
    isPending,
    setFormData,
    handleFieldChange,
    handleSubmit,
    resetForm,
  };
}
