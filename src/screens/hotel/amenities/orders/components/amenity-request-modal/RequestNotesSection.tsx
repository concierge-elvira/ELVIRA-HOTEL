import { ModalFormSection } from "../../../../../../components/ui";
import { OrderField } from "../../../../../../components/ui/forms/order-details";
import type { AmenityRequestSectionProps } from "./types";

/**
 * RequestNotesSection - Special instructions and amenity image
 * View-only display
 */
export function RequestNotesSection({ request }: AmenityRequestSectionProps) {
  return (
    <>
      {request.amenities?.image_url && (
        <ModalFormSection title="Amenity Image">
          <img
            src={request.amenities.image_url}
            alt={request.amenities.name}
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
        </ModalFormSection>
      )}
      <ModalFormSection title="Additional Information">
        <OrderField
          label="Special Instructions"
          value={request.special_instructions || "No special requirements"}
        />
      </ModalFormSection>
    </>
  );
}
