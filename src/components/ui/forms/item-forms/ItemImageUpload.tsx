import { useState } from "react";
import { supabase } from "../../../../services/supabase";
import { Button, IconButton } from "../../buttons";

interface ItemImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  bucketPath: string; // e.g., "menu-items", "products", "amenities"
  label?: string;
}

export function ItemImageUpload({
  value,
  onChange,
  disabled = false,
  bucketPath,
  label = "Item Image",
}: ItemImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `${bucketPath}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("hotel-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("hotel-assets").getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err) {
setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-gray-400">(Optional)</span>
      </label>
      <div className="flex items-start gap-4">
        {/* Image Preview */}
        <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden shrink-0">
          {value ? (
            <>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* X icon to remove image */}
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || uploading}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove image"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled || uploading}
              className="hidden"
              id="item-image-upload"
            />
            <label htmlFor="item-image-upload">
              <Button
                variant="outline"
                size="sm"
                disabled={disabled || uploading}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("item-image-upload")?.click();
                }}
              >
                {uploading
                  ? "Uploading..."
                  : value
                  ? "Change Image"
                  : "Upload Image"}
              </Button>
            </label>
          </div>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Max size: 5MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>
      </div>
    </div>
  );
}
