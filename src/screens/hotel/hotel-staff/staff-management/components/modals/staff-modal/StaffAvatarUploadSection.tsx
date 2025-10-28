import { useState } from "react";
import { supabase } from "../../../../../../../services/supabase";
import { Button } from "../../../../../../../components/ui";

interface StaffAvatarUploadSectionProps {
  avatarUrl?: string;
  fullName?: string;
  onAvatarChange: (url: string | null) => void;
  disabled?: boolean;
}

export function StaffAvatarUploadSection({
  avatarUrl,
  fullName,
  onAvatarChange,
  disabled = false,
}: StaffAvatarUploadSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  // Get the public URL from Supabase Storage
  const getAvatarUrl = (path: string) => {
    // If it's already a full URL, return it
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // If path doesn't include the folder, prepend 'users-avatar/'
    const storagePath = path.includes("/") ? path : `users-avatar/${path}`;

    // Construct the Supabase Storage URL
    const { data } = supabase.storage
      .from("hotel-assets")
      .getPublicUrl(storagePath);

    return data.publicUrl;
  };

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
      const fileName = `avatar-${crypto.randomUUID()}-${Date.now()}.${fileExt}`;
      const filePath = `users-avatar/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("hotel-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Store just the filename (not the full path) to match existing pattern
      onAvatarChange(fileName);
    } catch (err) {
      console.error("Avatar upload error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onAvatarChange(null);
    setError(null);
  };

  const publicAvatarUrl = avatarUrl ? getAvatarUrl(avatarUrl) : null;
  const hasAvatar = !!publicAvatarUrl;

  return (
    <div className="flex flex-col items-center mb-6">
      {/* Avatar Display */}
      <div className="relative mb-4">
        {hasAvatar ? (
          <>
            <img
              src={publicAvatarUrl}
              alt={fullName || "Staff member"}
              className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
              onError={() => {
                // If image fails to load, show initials
                onAvatarChange(null);
              }}
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove avatar"
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
            )}
          </>
        ) : (
          <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-semibold border-4 border-emerald-100">
            {initials}
          </div>
        )}
      </div>

      {/* Upload Controls */}
      {!disabled && (
        <div className="flex flex-col items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="staff-avatar-upload"
          />
          <label htmlFor="staff-avatar-upload">
            <Button
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("staff-avatar-upload")?.click();
              }}
            >
              {uploading
                ? "Uploading..."
                : hasAvatar
                ? "Change Photo"
                : "Upload Photo"}
            </Button>
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <p className="text-xs text-gray-500 text-center">
            Max size: 5MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>
      )}
    </div>
  );
}
