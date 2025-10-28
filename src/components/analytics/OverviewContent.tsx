import { useState } from "react";
import { TabsWithoutSearch, type TabItem } from "../ui";
import { TableContainer } from "../shared/page-layouts";
import {
  GuestAnalyticsSection,
  RevenueAnalyticsSection,
  OperationsAnalyticsSection,
  GuestBehaviorSection,
  AIAnalyticsSection,
  StaffAnalyticsSection,
} from "../../screens/hotel/overview/analytics";

interface OverviewContentProps {
  hotelId: string | undefined;
  prependTabs?: TabItem[]; // Tabs to add at the beginning
  additionalTabs?: TabItem[]; // Tabs to add at the end
  renderAdditionalTab?: (tabId: string) => React.ReactNode;
}

/**
 * Shared Overview Content Component
 * Used by both Hotel and Elvira dashboards
 */
export function OverviewContent({
  hotelId,
  prependTabs = [],
  additionalTabs = [],
  renderAdditionalTab,
}: OverviewContentProps) {
  const [activeTab, setActiveTab] = useState(
    prependTabs.length > 0 ? prependTabs[0].id : "guests"
  );

  const baseTabs: TabItem[] = [
    {
      id: "guests",
      label: "Guest Analytics",
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      id: "behavior",
      label: "Guest Behavior",
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: "revenue",
      label: "Revenue Analytics",
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "operations",
      label: "Operations Analytics",
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      id: "staff-analytics",
      label: "Staff Analytics",
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
    {
      id: "ai-analytics",
      label: "AI Analytics",
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
  ];

  const tabs = [...prependTabs, ...baseTabs, ...additionalTabs];

  const renderTabContent = () => {
    // Check if it's a prepended or additional tab
    if (
      renderAdditionalTab &&
      (prependTabs.some((tab) => tab.id === activeTab) ||
        additionalTabs.some((tab) => tab.id === activeTab))
    ) {
      return renderAdditionalTab(activeTab);
    }

    // Render base tabs
    switch (activeTab) {
      case "guests":
        return <GuestAnalyticsSection hotelId={hotelId} />;
      case "behavior":
        return <GuestBehaviorSection hotelId={hotelId} />;
      case "revenue":
        return <RevenueAnalyticsSection hotelId={hotelId} />;
      case "operations":
        return <OperationsAnalyticsSection hotelId={hotelId} />;
      case "staff-analytics":
        return <StaffAnalyticsSection hotelId={hotelId} />;
      case "ai-analytics":
        return <AIAnalyticsSection hotelId={hotelId} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Tabs Navigation */}
      <TabsWithoutSearch
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Analytics Content */}
      <TableContainer>{renderTabContent()}</TableContainer>
    </>
  );
}
