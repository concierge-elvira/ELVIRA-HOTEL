import { Modal } from "../../../../components/ui";
import { ThirdPartyMapView } from "../map-view";

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  hotel_approved?: boolean;
  hotel_recommended?: boolean;
}

interface MapViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: Place[];
  category?: string;
  onPlaceClick?: (place: Place) => void;
}

export function MapViewModal({
  isOpen,
  onClose,
  places,
  category,
  onPlaceClick,
}: MapViewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${
        category ? category.charAt(0).toUpperCase() + category.slice(1) : "All"
      } Places - Map View`}
      size="xl"
    >
      <div className="h-[calc(100vh-16rem)] relative">
        <ThirdPartyMapView
          places={places}
          category={category}
          onPlaceClick={onPlaceClick}
        />
      </div>
    </Modal>
  );
}
