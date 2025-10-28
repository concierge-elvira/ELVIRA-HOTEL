import { ModalFormSection } from "../../../../../../components/ui";
import { OrderField } from "../../../../../../components/ui/forms/order-details";
import type { AmenityRequestSectionProps } from "./types";

/**
 * AmenityDetailsSection - Amenity information
 * View-only display
 */
export function AmenityDetailsSection({ request }: AmenityRequestSectionProps) {
  if (!request.amenities) return null;

  return (
    <ModalFormSection title="Amenity Details">
      <OrderField label="Amenity" value={request.amenities.name} />
      <OrderField label="Category" value={request.amenities.category} />
      <OrderField
        label="Price"
        value={`$${request.amenities.price.toFixed(2)}`}
      />
    </ModalFormSection>
  );
}
