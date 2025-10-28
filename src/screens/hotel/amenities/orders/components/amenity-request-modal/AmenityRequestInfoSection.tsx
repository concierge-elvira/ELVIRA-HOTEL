import { ModalFormSection } from "../../../../../../components/ui";
import { OrderField } from "../../../../../../components/ui/forms/order-details";
import type { AmenityRequestSectionProps } from "./types";

/**
 * AmenityRequestInfoSection - Basic request information
 * View-only display
 */
export function AmenityRequestInfoSection({
  request,
}: AmenityRequestSectionProps) {
  return (
    <ModalFormSection title="Request Information">
      <OrderField label="Request ID" value={`#${request.id.slice(0, 8)}`} />

      {request.guests && (
        <>
          <OrderField label="Guest" value={request.guests.guest_name} />
          <OrderField label="Room" value={request.guests.room_number} />
        </>
      )}
    </ModalFormSection>
  );
}
