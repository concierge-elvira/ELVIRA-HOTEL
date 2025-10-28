import type { Database } from "../../../../../types/database";

export type EmergencyContactRow =
  Database["public"]["Tables"]["emergency_contacts"]["Row"];

export interface EmergencyContactFormData {
  contactName: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface FormErrors {
  contactName?: string;
  phoneNumber?: string;
}

export type ModalMode = "create" | "edit" | "view";

export interface EmergencyContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  contact?: EmergencyContactRow | null;
  onSubmit: (data: EmergencyContactFormData) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
