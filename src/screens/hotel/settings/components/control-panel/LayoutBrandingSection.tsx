import { ToggleCard } from "./ToggleCard";

interface LayoutBrandingSectionProps {
  settings: {
    aboutSection: boolean;
    doNotDisturb: boolean;
    hotelPhotoGallery: boolean;
  };
  onToggle: (
    key: keyof LayoutBrandingSectionProps["settings"],
    value: boolean
  ) => void;
  onManagePhotos?: () => void;
  onEditAbout?: () => void;
}

export function LayoutBrandingSection({
  settings,
  onToggle,
  onManagePhotos,
  onEditAbout,
}: LayoutBrandingSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">
        Layout & Branding
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <ToggleCard
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="About Section"
          description="Display hotel information and custom content"
          isEnabled={settings.aboutSection}
          onToggle={(value) => onToggle("aboutSection", value)}
          actionButton={
            onEditAbout
              ? {
                  label: "Edit",
                  onClick: onEditAbout,
                }
              : undefined
          }
        />

        <ToggleCard
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          }
          title="Do Not Disturb"
          description="Allow guests to toggle do not disturb status"
          isEnabled={settings.doNotDisturb}
          onToggle={(value) => onToggle("doNotDisturb", value)}
        />

        <ToggleCard
          icon={
            <svg
              className="w-5 h-5"
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
          }
          title="Hotel Photo Gallery"
          description="Upload and manage up to 8 photos"
          isEnabled={settings.hotelPhotoGallery}
          onToggle={(value) => onToggle("hotelPhotoGallery", value)}
          actionButton={
            onManagePhotos
              ? {
                  label: "Manage Photos",
                  onClick: onManagePhotos,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
