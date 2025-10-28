interface ItemMetadataDisplayProps {
  createdAt: string | null;
  updatedAt: string | null;
}

export function ItemMetadataDisplay({
  createdAt,
  updatedAt,
}: ItemMetadataDisplayProps) {
  return (
    <div className="pt-2 border-t border-gray-200">
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <div>
          <span className="font-medium">Created:</span>{" "}
          {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
        </div>
        <span>•</span>
        <div>
          <span className="font-medium">Updated:</span>{" "}
          {updatedAt ? new Date(updatedAt).toLocaleDateString() : "N/A"}
        </div>
      </div>
    </div>
  );
}
