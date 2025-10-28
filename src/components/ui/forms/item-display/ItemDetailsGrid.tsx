interface ItemDetail {
  label: string;
  value: string | string[] | null;
}

interface ItemDetailsGridProps {
  details: ItemDetail[];
}

export function ItemDetailsGrid({ details }: ItemDetailsGridProps) {
  const validDetails = details.filter(
    (detail) =>
      detail.value &&
      (Array.isArray(detail.value) ? detail.value.length > 0 : true)
  );

  if (validDetails.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {validDetails.map((detail, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-3 bg-gray-50"
        >
          <p className="text-xs font-medium text-gray-500 mb-1">
            {detail.label}
          </p>
          <p className="text-sm text-gray-900">
            {Array.isArray(detail.value)
              ? detail.value.join(", ")
              : detail.value}
          </p>
        </div>
      ))}
    </div>
  );
}
