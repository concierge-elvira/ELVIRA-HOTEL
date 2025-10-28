interface ItemDescriptionDisplayProps {
  description: string | null;
}

export function ItemDescriptionDisplay({
  description,
}: ItemDescriptionDisplayProps) {
  if (!description) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
