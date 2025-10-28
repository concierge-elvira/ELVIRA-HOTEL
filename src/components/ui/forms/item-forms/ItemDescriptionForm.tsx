import { Textarea } from "../index";

interface ItemDescriptionFormProps {
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export function ItemDescriptionForm({
  value,
  error,
  disabled = false,
  onChange,
  label = "Description",
  placeholder = "Enter description...",
  rows = 3,
}: ItemDescriptionFormProps) {
  return (
    <Textarea
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      hint="Optional"
    />
  );
}
