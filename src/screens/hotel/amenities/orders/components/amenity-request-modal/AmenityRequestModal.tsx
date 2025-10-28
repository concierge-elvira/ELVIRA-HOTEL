import { ModalForm, Button } from "../../../../../../components/ui";
import { AmenityRequestInfoSection } from "./AmenityRequestInfoSection";
import { AmenityDetailsSection } from "./AmenityDetailsSection";
import { RequestScheduleSection } from "./RequestScheduleSection";
import { RequestNotesSection } from "./RequestNotesSection";
import type { AmenityRequestModalProps } from "./types";

export function AmenityRequestModal({
  isOpen,
  onClose,
  request,
}: AmenityRequestModalProps) {
  if (!request) return null;

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title="Amenity Request Details"
      size="md"
      footer={
        <div className="flex justify-end">
          <Button variant="primary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <RequestNotesSection request={request} />
        <AmenityDetailsSection request={request} />
        <AmenityRequestInfoSection request={request} />
        <RequestScheduleSection request={request} />
      </div>
    </ModalForm>
  );
}
