import type { Database } from "../../../../../types/database";

export type AnnouncementRow =
  Database["public"]["Tables"]["announcements"]["Row"];

export interface AnnouncementFormData {
  title: string;
  description: string;
  isActive: boolean;
}

export interface FormErrors {
  title?: string;
  description?: string;
}

export type ModalMode = "create" | "edit" | "view";

export interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  announcement?: AnnouncementRow | null;
  onSubmit: (data: AnnouncementFormData) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
