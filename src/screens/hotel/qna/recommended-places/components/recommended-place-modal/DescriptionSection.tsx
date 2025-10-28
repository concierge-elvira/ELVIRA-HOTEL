import { ModalFormSection } from "../../../../../../components/ui/modalform";
import { Textarea } from "../../../../../../components/ui";
import type { PlaceSectionProps } from "./types";

export function DescriptionSection({
  mode,
  formData,
  errors,
  onChange,
}: PlaceSectionProps) {
  const disabled = mode === "view";

  return (
    <ModalFormSection title="Description">
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => onChange("description", e.target.value)}
        error={errors?.description}
        disabled={disabled}
        placeholder="Add a description about this recommended place..."
        rows={4}
      />
    </ModalFormSection>
  );
}
