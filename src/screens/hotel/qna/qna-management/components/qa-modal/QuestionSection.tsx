import { ModalFormSection, Input } from "../../../../../../components/ui";
import type { QAFormData } from "./types";

interface QuestionSectionProps {
  formData: QAFormData;
  onChange: (field: keyof QAFormData, value: string | boolean) => void;
  mode: "create" | "edit" | "view";
}

export function QuestionSection({
  formData,
  onChange,
  mode,
}: QuestionSectionProps) {
  const isReadOnly = mode === "view";

  return (
    <ModalFormSection title="Question">
      <Input
        label="Question"
        value={formData.question}
        onChange={(e) => onChange("question", e.target.value)}
        placeholder="Enter the question..."
        required
        disabled={isReadOnly}
      />
    </ModalFormSection>
  );
}
