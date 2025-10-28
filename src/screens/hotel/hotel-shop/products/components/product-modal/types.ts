import type { Database } from "../../../../../../types/database";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export interface ProductFormData {
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl: string | null;
  recommended: boolean;
  miniBar: boolean;
  isUnlimitedStock: boolean;
  stockQuantity: string;
  isActive: boolean;
}

export interface FormErrors {
  name?: string;
  price?: string;
  category?: string;
  description?: string;
  stockQuantity?: string;
}

export type ModalMode = "create" | "edit" | "view";

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  product?: ProductRow | null;
  onSubmit: (data: ProductFormData) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
