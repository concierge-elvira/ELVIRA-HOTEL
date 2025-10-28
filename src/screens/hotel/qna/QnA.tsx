import { useState } from "react";
import { TabsWithSearch, type TabItem } from "../../../components/ui";
import { QnAManagement } from "./qna-management";
import { RecommendedPlaces } from "./recommended-places";
import {
  PageContent,
  PageHeader,
  TableContainer,
} from "../../../components/shared/page-layouts";

export function QnA() {
  const [activeTab, setActiveTab] = useState("qna");
  const [searchValue, setSearchValue] = useState("");

  const tabs: TabItem[] = [
    {
      id: "qna",
      label: "Q&A",
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
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "recommended-places",
      label: "Recommended Places",
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const handleSearchClear = () => {
    setSearchValue("");
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchValue(""); // Clear search when switching tabs
  };

  const getSearchPlaceholder = () => {
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    return `Search ${currentTab?.label.toLowerCase()}...`;
  };

  const getTabContent = () => {
    switch (activeTab) {
      case "qna":
        return <QnAManagement searchValue={searchValue} />;
      case "recommended-places":
        return <RecommendedPlaces searchValue={searchValue} />;
      default:
        return null;
    }
  };

  return (
    <PageContent>
      {/* Header */}
      <PageHeader
        title="Q&A"
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
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />

      {/* Tabs with Search */}
      <TabsWithSearch
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={getSearchPlaceholder()}
        onSearchClear={handleSearchClear}
      />

      {/* Content Area */}
      <TableContainer>{getTabContent()}</TableContainer>
    </PageContent>
  );
}
