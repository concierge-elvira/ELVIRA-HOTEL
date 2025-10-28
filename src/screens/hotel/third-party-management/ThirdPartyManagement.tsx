import { useState } from "react";
import { TabsWithSearch, type TabItem } from "../../../components/ui";
import { Gastronomy } from "./gastronomy";
import { Tours } from "./tours";
import { Wellness } from "./wellness";
import {
  PageContent,
  PageHeader,
  TableContainer,
} from "../../../components/shared/page-layouts";

export function ThirdPartyManagement() {
  const [activeTab, setActiveTab] = useState("gastronomy");
  const [searchValue, setSearchValue] = useState("");

  const tabs: TabItem[] = [
    {
      id: "gastronomy",
      label: "Gastronomy",
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      ),
    },
    {
      id: "tours",
      label: "Tours",
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
    {
      id: "wellness",
      label: "Wellness",
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
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
      case "gastronomy":
        return <Gastronomy searchValue={searchValue} />;
      case "tours":
        return <Tours searchValue={searchValue} />;
      case "wellness":
        return <Wellness searchValue={searchValue} />;
      default:
        return null;
    }
  };

  return (
    <PageContent>
      {/* Header */}
      <PageHeader
        title="Third Party Management"
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
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
