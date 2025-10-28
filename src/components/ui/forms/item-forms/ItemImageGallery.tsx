import { useState } from "react";
import { supabase } from "../../../../services/supabase";

interface ItemImageGalleryProps {
  value: string[]; // Array of image URLs
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  bucketPath: string; // e.g., "hotel-gallery/hotel-123"
  maxImages?: number;
  label?: string;
  hideUploadButton?: boolean; // Allow hiding the upload button
  uploadButtonId?: string; // Custom ID for the file input
}

export function ItemImageGallery({
  value,
  onChange,
  disabled = false,
  bucketPath,
  maxImages = 8,
  label = "Image Gallery",
  hideUploadButton = false,
  uploadButtonId = "gallery-image-upload",
}: ItemImageGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Calculate how many images we can still add
    const remainingSlots = maxImages - value.length;
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Convert FileList to Array and limit to remaining slots
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    // Validate all files first
    for (const file of filesToUpload) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`File "${file.name}" is too large. Max size is 5MB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError(`File "${file.name}" is not an image`);
        return;
      }
    }

    setError(null);
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      // Upload all files
      for (const file of filesToUpload) {
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

        uploadedUrls.push(publicUrl);
      }

      // Add all uploaded images to array
      onChange([...value, ...uploadedUrls]);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const handleRemove = async (index: number) => {
    const imageUrl = value[index];

    try {
      // Extract file path from URL
      const urlParts = imageUrl.split(
        "/storage/v1/object/public/hotel-assets/"
      );
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("hotel-assets").remove([filePath]);
      }
    } catch (err) {
      console.error("Error deleting image:", err);
    }

    // Remove from array
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        <span className="text-gray-500 text-xs ml-2">
          ({value.length}/{maxImages} images)
        </span>
      </label>

      {/* Image Grid */}
      <div className="grid grid-cols-4 gap-3">
        {value.map((imageUrl, index) => (
          <div
            key={index}
            className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <img
              src={imageUrl}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              disabled={disabled || uploading}
              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Remove image"
            >
              <svg
                className="w-3.5 h-3.5"
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
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: maxImages - value.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="aspect-square border border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center"
          >
            <svg
              className="w-6 h-6 text-gray-400"
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
        ))}
      </div>

      {/* Hidden file input - always rendered */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={disabled || uploading || value.length >= maxImages}
        className="hidden"
        id={uploadButtonId}
      />

      {/* Upload Button - conditionally rendered */}
      {!hideUploadButton && (
        <div className="mt-3">
          <label htmlFor={uploadButtonId}>
            <button
              type="button"
              disabled={disabled || uploading || value.length >= maxImages}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(uploadButtonId)?.click();
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Add Images"}
            </button>
          </label>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Max size: 5MB per image. Select multiple images at once. Supported
            formats: JPG, PNG, GIF
          </p>
        </div>
      )}
    </div>
  );
}
