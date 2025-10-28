import type { AmenityRequestWithDetails } from "../../../../../../hooks/amenities/amenity-requests/useAmenityRequests";

export interface AmenityRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: AmenityRequestWithDetails | null;
}

export interface AmenityRequestSectionProps {
  request: AmenityRequestWithDetails;
}

export type { AmenityRequestWithDetails };
