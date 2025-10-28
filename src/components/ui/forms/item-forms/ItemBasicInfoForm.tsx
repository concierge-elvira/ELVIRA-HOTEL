import { Input, Select } from "../index";

interface ItemBasicInfoFormProps {
  formData: {
    name: string;
    price: string;
    category: string;
  };
  errors: {
    name?: string;
    price?: string;
    category?: string;
  };
  disabled?: boolean;
  onChange: (field: string, value: string) => void;
  categories: string[]; // Categories will vary by item type
  nameLabel?: string;
  priceLabel?: string;
  categoryLabel?: string;
}

export function ItemBasicInfoForm({
  formData,
  errors,
  disabled = false,
  onChange,
  categories,
  nameLabel = "Item Name",
  priceLabel = "Price",
  categoryLabel = "Category",
}: ItemBasicInfoFormProps) {
  return (
    <div className="space-y-4">
      {/* Item Name */}
      <Input
        label={nameLabel}
        value={formData.name}
        onChange={(e) => onChange("name", e.target.value)}
        error={errors.name}
        placeholder={`Enter ${nameLabel.toLowerCase()}`}
        disabled={disabled}
        required
      />

      {/* Price & Category - 2 Columns */}
      <div className="grid grid-cols-2 gap-4">
        {/* Price */}
        <Input
          label={priceLabel}
          type="number"
          value={formData.price}
          onChange={(e) => onChange("price", e.target.value)}
          error={errors.price}
          placeholder="0.00"
          disabled={disabled}
          required
          min="0"
          step="0.01"
        />

        {/* Category */}
        <Select
          label={categoryLabel}
          value={formData.category}
          onChange={(e) => onChange("category", e.target.value)}
          error={errors.category}
          disabled={disabled}
          required
          placeholder={`Select ${categoryLabel.toLowerCase()}`}
          options={categories.map((category) => ({
            value: category,
            label: category,
          }))}
        />
      </div>
    </div>
  );
}
