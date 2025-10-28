interface ItemBasicInfoDisplayProps {
  name: string;
  category: string;
  hotelRecommended?: boolean | null;
  categoryLabel?: string;
}

export function ItemBasicInfoDisplay({
  name,
  category,
  hotelRecommended,
  categoryLabel = "Category",
}: ItemBasicInfoDisplayProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        {hotelRecommended && (
          <span
            className="text-xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            title="Hotel Recommended"
          >
            ⭐
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-0.5">
        {categoryLabel}: {category}
      </p>
    </div>
  );
}
