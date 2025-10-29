import { useState, useMemo } from "react";
import { TabsWithoutSearch, type TabItem } from "../../../components/ui";
import { ProfileTab, ControlPanel, AppearanceTab } from "./components";
import { AppearanceActions } from "./components/appearance/settings/AppearanceSettings";
import { AppearanceProvider } from "./components/appearance/contexts/AppearanceContext";
import {
  PageContent,
  PageHeader,
  TableContainer,
} from "../../../components/shared/page-layouts";
import { useCurrentUserHotel } from "../../../hooks";

export function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: currentUser } = useCurrentUserHotel();

  const allTabs = useMemo<TabItem[]>(
    () => [
      {
        id: "profile",
        label: "Profile",
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
      },
      {
        id: "appearance",
        label: "Appearance",
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
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        ),
      },
      {
        id: "control-panel",
        label: "Control Panel",
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
      },
    ],
    []
  );

  // Filter tabs based on user position
  const tabs = useMemo(() => {
    if (currentUser?.position === "Hotel Staff") {
      // Hide Appearance and Control Panel for Hotel Staff
      return allTabs.filter(
        (tab) => tab.id !== "appearance" && tab.id !== "control-panel"
      );
    }
    return allTabs;
  }, [currentUser, allTabs]);

  const getTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <TableContainer>
            <div className="p-6">
              <ProfileTab />
            </div>
          </TableContainer>
        );
      case "appearance":
        // Don't wrap here - will be wrapped in the return statement
        return <AppearanceTab hotelName={currentUser?.hotel?.name} />;
      case "control-panel":
        return (
          <TableContainer>
            <ControlPanel />
          </TableContainer>
        );
      default:
        return null;
    }
  };

  return (
    <PageContent>
      {/* Header */}
      <PageHeader
        title="Settings"
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        }
      />

      {activeTab === "appearance" ? (
        <AppearanceProvider>
          {/* Tabs without Search */}
          <TabsWithoutSearch
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            actions={<AppearanceActions />}
          />

          {/* Content Area */}
          {getTabContent()}
        </AppearanceProvider>
      ) : (
        <>
          {/* Tabs without Search */}
          <TabsWithoutSearch
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Content Area */}
          {getTabContent()}
        </>
      )}
    </PageContent>
  );
}
