import type { Database } from "../../../../../../types/database";

export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

export type MenuItemFormData = {
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl: string | null;
  hotelRecommended: boolean;
  isActive: boolean;
  restaurantIds: string[];
  serviceTypes: string[];
  dietaryInfo: string[];
};

export type FormErrors = {
  [K in keyof MenuItemFormData]?: string;
};

export type ModalMode = "create" | "edit" | "view";

export interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  menuItem?: MenuItem | null;
  onSubmit?: (data: MenuItemFormData) => void | Promise<void>;
  onEdit?: () => void;
  onDelete?: () => void;
}
