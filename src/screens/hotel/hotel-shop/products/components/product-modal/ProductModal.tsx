import { useEffect, useState } from "react";
import {
  ModalForm,
  ModalFormActions,
} from "../../../../../../components/ui/modalform";
import { useUpdateProduct } from "../../../../../../hooks/hotel-shop";
import { ImageSection } from "./ImageSection";
import { BasicInfoSection } from "./BasicInfoSection";
import { DescriptionSection } from "./DescriptionSection";
import { StockSection } from "./StockSection";
import { OptionsSection } from "./OptionsSection";
import type { ProductFormData, FormErrors, ProductModalProps } from "./types";

const PRODUCT_CATEGORIES = [
  "Food & Snacks",
  "Beverages",
  "Personal Care",
  "Health & Wellness",
  "Electronics",
  "Reading Materials",
  "Souvenirs",
  "Other",
];

export function ProductModal({
  isOpen,
  onClose,
  mode,
  product,
  onSubmit,
  onEdit,
  onDelete,
}: ProductModalProps) {
  const updateProduct = useUpdateProduct();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    category: "",
    description: "",
    imageUrl: null,
    recommended: false,
    miniBar: false,
    isUnlimitedStock: false,
    stockQuantity: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, setIsPending] = useState(false);

  // Reset form when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name || "",
        price: product.price?.toString() || "",
        category: product.category || "",
        description: product.description || "",
        imageUrl: product.image_url || null,
        recommended: product.recommended || false,
        miniBar: product.mini_bar || false,
        isUnlimitedStock: product.is_unlimited_stock || false,
        stockQuantity: product.stock_quantity?.toString() || "",
        isActive: product.is_active,
      });
    } else if (isOpen && !product) {
      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        imageUrl: null,
        recommended: false,
        miniBar: false,
        isUnlimitedStock: false,
        stockQuantity: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const handleFieldChange = (
    field: keyof ProductFormData,
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
      newErrors.name = "Product name is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.isUnlimitedStock && !formData.stockQuantity) {
      newErrors.stockQuantity = "Stock quantity is required";
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
    if (!product) return;

    // Optimistically update the local state
    setFormData((prev) => ({ ...prev, isActive: newStatus }));

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        updates: { is_active: newStatus },
      });
    } catch (error) {
      console.error("Error updating product status:", error);
      // Revert on error
      setFormData((prev) => ({ ...prev, isActive: !newStatus }));
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Add Product";
      case "edit":
        return "Edit Product";
      case "view":
        return "Product Details";
      default:
        return "Product";
    }
  };

  const getSubmitLabel = () => {
    return mode === "edit" ? "Save Changes" : "Add Product";
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
        onChange={(url) => handleFieldChange("imageUrl", url)}
        onStatusToggle={mode === "view" ? handleStatusToggle : undefined}
      />

      <BasicInfoSection
        formData={formData}
        errors={errors}
        mode={mode}
        onChange={handleFieldChange}
        categories={PRODUCT_CATEGORIES}
      />

      <DescriptionSection
        formData={formData}
        errors={errors}
        mode={mode}
        onChange={handleFieldChange}
      />

      {/* Two-column layout for Stock and Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StockSection
          formData={formData}
          errors={errors}
          mode={mode}
          onChange={handleFieldChange}
        />

        <OptionsSection
          formData={formData}
          mode={mode}
          onChange={handleFieldChange}
        />
      </div>
    </ModalForm>
  );
}
