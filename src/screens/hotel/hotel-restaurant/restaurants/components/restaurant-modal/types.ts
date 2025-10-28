import type { Database } from "../../../../../../types/database";

export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

export type RestaurantFormData = {
  name: string;
  cuisine: string;
  description: string;
  foodTypes: string[];
  foodTypesInput: string;
  isActive: boolean;
};

export type FormErrors = {
  [K in keyof RestaurantFormData]?: string;
};

export type ModalMode = "create" | "edit" | "view";

export interface RestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  restaurant?: Restaurant | null;
  onSubmit?: (data: RestaurantFormData) => void | Promise<void>;
  onEdit?: () => void;
  onDelete?: () => void;
}
