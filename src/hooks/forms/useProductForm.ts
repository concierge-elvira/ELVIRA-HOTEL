import { useState, useEffect } from "react";
import {
  useCreateProduct,
  useUpdateProduct,
} from "../hotel-shop/products/useProducts";
import { useHotelContext } from "../useHotelContext";
import { useAuth } from "../useAuth";
import type { Database } from "../../types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

interface FormData {
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl: string | null;
  recommended: boolean;
  miniBar: boolean;
  isUnlimitedStock: boolean;
  stockQuantity: string;
}

interface FormErrors {
  name: string;
  price: string;
  category: string;
  description: string;
  stockQuantity: string;
}

const initialFormData: FormData = {
  name: "",
  price: "",
  category: "",
  description: "",
  imageUrl: null,
  recommended: false,
  miniBar: false,
  isUnlimitedStock: true,
  stockQuantity: "",
};

const initialErrors: FormErrors = {
  name: "",
  price: "",
  category: "",
  description: "",
  stockQuantity: "",
};

export function useProductForm(
  product: ProductRow | null | undefined,
  onSuccess: () => void
) {
  const { user } = useAuth();
  const { hotelId } = useHotelContext();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const isEditMode = !!product;
  const isPending = createProduct.isPending || updateProduct.isPending;

  // Initialize form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        description: product.description || "",
        imageUrl: product.image_url,
        recommended: product.recommended || false,
        miniBar: product.mini_bar || false,
        isUnlimitedStock: product.is_unlimited_stock || false,
        stockQuantity: product.stock_quantity?.toString() || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [product]);

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
      stockQuantity: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (
      !formData.isUnlimitedStock &&
      (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0)
    ) {
      newErrors.stockQuantity = "Valid stock quantity is required";
    }

    setErrors(newErrors);
    return (
      !newErrors.name &&
      !newErrors.price &&
      !newErrors.category &&
      !newErrors.stockQuantity
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!hotelId || !user?.id) {
return;
    }

    try {
      if (isEditMode && product) {
        await updateProduct.mutateAsync({
          id: product.id,
          updates: {
            name: formData.name.trim(),
            price: parseFloat(formData.price),
            category: formData.category,
            description: formData.description.trim() || null,
            image_url: formData.imageUrl,
            recommended: formData.recommended,
            mini_bar: formData.miniBar,
            is_unlimited_stock: formData.isUnlimitedStock,
            stock_quantity: formData.isUnlimitedStock
              ? null
              : parseInt(formData.stockQuantity) || 0,
          },
        });
      } else {
        await createProduct.mutateAsync({
          name: formData.name.trim(),
          price: parseFloat(formData.price),
          category: formData.category,
          description: formData.description.trim() || null,
          image_url: formData.imageUrl,
          recommended: formData.recommended,
          mini_bar: formData.miniBar,
          is_unlimited_stock: formData.isUnlimitedStock,
          stock_quantity: formData.isUnlimitedStock
            ? null
            : parseInt(formData.stockQuantity) || 0,
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
