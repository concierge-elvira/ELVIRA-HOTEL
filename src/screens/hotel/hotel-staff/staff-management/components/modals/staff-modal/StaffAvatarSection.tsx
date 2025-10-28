import { supabase } from "../../../../../../../services/supabase";

interface StaffAvatarSectionProps {
  avatarUrl?: string;
  fullName?: string;
}

export function StaffAvatarSection({
  avatarUrl,
  fullName,
}: StaffAvatarSectionProps) {
  if (!avatarUrl) {
    return null;
  }

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

  const publicAvatarUrl = getAvatarUrl(avatarUrl);

  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        <img
          src={publicAvatarUrl}
          alt={fullName || "Staff member"}
          className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLDivElement;
            if (fallback) {
              fallback.style.display = "flex";
            }
          }}
        />
        <div
          className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-semibold border-4 border-emerald-100"
          style={{ display: "none" }}
        >
          {initials}
        </div>
      </div>
    </div>
  );
}
