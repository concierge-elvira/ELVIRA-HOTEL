import { ToggleCard } from "./ToggleCard";

interface InformationCommunicationSectionProps {
  settings: {
    hotelAnnouncements: boolean;
    qaRecommendations: boolean;
    emergencyContacts: boolean;
    publicTransport: boolean;
  };
  onToggle: (
    key: keyof InformationCommunicationSectionProps["settings"],
    value: boolean
  ) => void;
}

export function InformationCommunicationSection({
  settings,
  onToggle,
}: InformationCommunicationSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">
        Information & Communication
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          }
          title="Hotel Announcements"
          description="Display important hotel news and updates"
          isEnabled={settings.hotelAnnouncements}
          onToggle={(value) => onToggle("hotelAnnouncements", value)}
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="Q&A - Recommendations"
          description="Frequently asked questions and recommendations"
          isEnabled={settings.qaRecommendations}
          onToggle={(value) => onToggle("qaRecommendations", value)}
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
          title="Emergency Contacts"
          description="Essential emergency contact information"
          isEnabled={settings.emergencyContacts}
          onToggle={(value) => onToggle("emergencyContacts", value)}
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          }
          title="Public Transport"
          description="Show public transport information"
          isEnabled={settings.publicTransport}
          onToggle={(value) => onToggle("publicTransport", value)}
        />
      </div>
    </div>
  );
}
