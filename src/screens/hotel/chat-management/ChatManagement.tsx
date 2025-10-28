import { useState } from "react";
import { TabsWithoutSearch, type TabItem } from "../../../components/ui";
import { GuestCommunication, StaffCommunication } from "./components";
import { useConversations } from "../../../hooks/chat-management/useConversations";
import { useHotelId } from "../../../hooks/useHotelContext";
import { PageHeader } from "../../../components/shared/page-layouts";
import { colors, typography, spacing } from "../../../utils/theme";

export function ChatManagement() {
  const [activeTab, setActiveTab] = useState("guest-communication");

  // Get the current user's hotel ID from context
  const hotelId = useHotelId();

  // Real-time conversations data with React Query
  const { data: conversations } = useConversations(hotelId || undefined);

  const tabs: TabItem[] = [
    {
      id: "guest-communication",
      label: "Guest Communication",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
    },
    {
      id: "staff-communication",
      label: "Staff Communication",
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case "guest-communication":
        return <GuestCommunication />;
      case "staff-communication":
        return <StaffCommunication />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Standardized Page Header */}
      <PageHeader
        title="Chat Management"
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        }
        rightContent={
          <div className="flex items-center" style={{ gap: spacing[2] }}>
            <div className="flex items-center">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.success.DEFAULT }}
              ></div>
              <span
                style={{
                  marginLeft: spacing[2],
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                }}
              >
                Real-time enabled
              </span>
            </div>
            {conversations && (
              <span
                style={{
                  backgroundColor: colors.primary[100],
                  color: colors.primary[800],
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  padding: `${spacing[1]} ${spacing[2.5]}`,
                  borderRadius: "9999px",
                }}
              >
                {conversations.length} active conversations
              </span>
            )}
          </div>
        }
      />

      {/* Tabs without Search */}
      <TabsWithoutSearch
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content Area - Flex to fill remaining space */}
      <div className="flex-1 overflow-hidden">{getTabContent()}</div>
    </div>
  );
}
