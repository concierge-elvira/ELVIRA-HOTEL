import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../../components/ui/modalform";
import { ItemRecommendedToggle } from "../../../../../../components/ui/forms";
import type { AmenityFormData, ModalMode } from "./types";

interface RecommendedSectionProps {
  formData: AmenityFormData;
  mode: ModalMode;
  onChange: (field: keyof AmenityFormData, value: boolean) => void;
}

export function RecommendedSection({
  formData,
  mode,
  onChange,
}: RecommendedSectionProps) {
  const disabled = mode === "view";

  return (
    <ModalFormSection title="Recommendations">
      <ModalFormGrid>
        <div className="col-span-2">
          <ItemRecommendedToggle
            checked={formData.recommended}
            disabled={disabled}
            onChange={(value) => onChange("recommended", value)}
          />
        </div>
      </ModalFormGrid>
    </ModalFormSection>
  );
}
