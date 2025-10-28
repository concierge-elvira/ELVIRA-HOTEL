import { ModalFormSection } from "../../../../../../components/ui/modalform";
import { Input } from "../../../../../../components/ui";
import type { PlaceSectionProps } from "./types";

export function BasicInfoSection({
  mode,
  formData,
  errors,
  onChange,
}: PlaceSectionProps) {
  const disabled = mode === "view";

  return (
    <ModalFormSection title="Basic Information">
      <Input
        label="Place Name"
        value={formData.placeName}
        onChange={(e) => onChange("placeName", e.target.value)}
        error={errors?.placeName}
        disabled={disabled}
        placeholder="Enter place name"
        required
      />
    </ModalFormSection>
  );
}
