import type { Database } from "../../../../../../types/database";

export type HotelRecommendedPlaceRow =
  Database["public"]["Tables"]["hotel_recommended_places"]["Row"];

export interface RecommendedPlaceFormData {
  placeName: string;
  address: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  imageUrls: string[];
}

export interface FormErrors {
  placeName?: string;
  address?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
}

export type ModalMode = "create" | "edit" | "view";

export interface RecommendedPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  place?: HotelRecommendedPlaceRow | null;
  onSubmit: (data: RecommendedPlaceFormData) => Promise<void>;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface PlaceSectionProps {
  mode: ModalMode;
  formData: RecommendedPlaceFormData;
  errors?: FormErrors;
  onChange: (
    field: keyof RecommendedPlaceFormData,
    value: string | number | boolean | null | string[]
  ) => void;
}
