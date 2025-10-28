import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../components/ui/modalform";
import { Textarea } from "../../../../../components/ui";
import type { AnnouncementFormData, FormErrors, ModalMode } from "./types";

interface DescriptionSectionProps {
  formData: AnnouncementFormData;
  errors: FormErrors;
  mode: ModalMode;
  onChange: (field: keyof AnnouncementFormData, value: string) => void;
}

export function DescriptionSection({
  formData,
  errors,
  mode,
  onChange,
}: DescriptionSectionProps) {
  const disabled = mode === "view";

  return (
    <ModalFormSection title="Description">
      <ModalFormGrid columns={1}>
        <Textarea
          label="Announcement Description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          error={errors.description}
          disabled={disabled}
          placeholder="Enter announcement description"
          rows={6}
          required
        />
      </ModalFormGrid>
    </ModalFormSection>
  );
}
