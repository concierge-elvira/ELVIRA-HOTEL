import { ModalFormSection, Textarea } from "../../../../../../components/ui";
import type { QAFormData } from "./types";

interface AnswerSectionProps {
  formData: QAFormData;
  onChange: (field: keyof QAFormData, value: string | boolean) => void;
  mode: "create" | "edit" | "view";
}

export function AnswerSection({
  formData,
  onChange,
  mode,
}: AnswerSectionProps) {
  const isReadOnly = mode === "view";

  return (
    <ModalFormSection title="Answer">
      <Textarea
        label="Answer"
        value={formData.answer}
        onChange={(e) => onChange("answer", e.target.value)}
        placeholder="Enter the answer..."
        rows={4}
        required
        disabled={isReadOnly}
      />
    </ModalFormSection>
  );
}
