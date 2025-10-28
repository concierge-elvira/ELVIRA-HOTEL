import type { Database } from "../../../../../../types/database";

type AmenityRow = Database["public"]["Tables"]["amenities"]["Row"];

export interface AmenityFormData {
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl: string | null;
  recommended: boolean;
}

import type { Database } from "../../../../../../types/database";

export type AmenityRow = Database["public"]["Tables"]["amenities"]["Row"];

export interface AmenityFormData {
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl: string | null;
  recommended: boolean;
  isActive: boolean;
}

export interface FormErrors {
  name?: string;
  price?: string;
  category?: string;
  description?: string;
}

export type ModalMode = "create" | "edit" | "view";

export interface AmenityModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  amenity?: AmenityRow | null;
  onSubmit: (data: AmenityFormData) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface AmenitySectionProps {
  mode: "create" | "edit" | "view";
  formData?: AmenityFormData;
  amenity?: AmenityRow | null;
  currentIsActive?: boolean;
  onFieldChange?: (field: string, value: string | boolean | null) => void;
  errors?: Record<string, string | undefined>;
  disabled?: boolean;
  onImageChange?: (url: string | null) => void;
  onStatusToggle?: (newStatus: boolean) => Promise<void>;
}

export type { AmenityRow };
