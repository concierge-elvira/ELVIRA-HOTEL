import {
  ModalFormSection,
  ModalFormGrid,
} from "../../../../../components/ui/modalform";
import { Input } from "../../../../../components/ui";
import type { AnnouncementFormData, FormErrors, ModalMode } from "./types";

interface BasicInfoSectionProps {
  formData: AnnouncementFormData;
  errors: FormErrors;
  mode: ModalMode;
  onChange: (field: keyof AnnouncementFormData, value: string) => void;
}

export function BasicInfoSection({
  formData,
  errors,
  mode,
  onChange,
}: BasicInfoSectionProps) {
  const disabled = mode === "view";

  return (
    <ModalFormSection title="Announcement Details">
      <ModalFormGrid columns={1}>
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          error={errors.title}
          disabled={disabled}
          placeholder="Enter announcement title"
          required
        />
      </ModalFormGrid>
    </ModalFormSection>
  );
}
