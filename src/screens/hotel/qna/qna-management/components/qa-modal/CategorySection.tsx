import {
  ModalFormSection,
  ModalFormGrid,
  Select,
} from "../../../../../../components/ui";
import type { QAFormData } from "./types";

interface CategorySectionProps {
  formData: QAFormData;
  onChange: (field: keyof QAFormData, value: string | boolean) => void;
  mode: "create" | "edit" | "view";
}

const CATEGORIES = [
  { value: "General", label: "General" },
  { value: "Amenities", label: "Amenities" },
  { value: "Services", label: "Services" },
  { value: "Policies", label: "Policies" },
  { value: "Facilities", label: "Facilities" },
  { value: "Location", label: "Location" },
  { value: "Dining", label: "Dining" },
  { value: "Activities", label: "Activities" },
  { value: "Transportation", label: "Transportation" },
  { value: "Other", label: "Other" },
];

const TYPES = [
  { value: "FAQ", label: "FAQ" },
  { value: "Info", label: "Info" },
  { value: "Tip", label: "Tip" },
  { value: "Warning", label: "Warning" },
];

export function CategorySection({
  formData,
  onChange,
  mode,
}: CategorySectionProps) {
  const isReadOnly = mode === "view";

  return (
    <ModalFormSection title="Category & Type">
      <ModalFormGrid columns={2}>
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => onChange("category", e.target.value)}
          options={CATEGORIES}
          required
          disabled={isReadOnly}
        />
        <Select
          label="Type"
          value={formData.type}
          onChange={(e) => onChange("type", e.target.value)}
          options={TYPES}
          required
          disabled={isReadOnly}
        />
      </ModalFormGrid>
    </ModalFormSection>
  );
}
