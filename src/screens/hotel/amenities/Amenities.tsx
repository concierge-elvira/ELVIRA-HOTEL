import { useState } from "react";
import { TabsWithSearch, type TabItem } from "../../../components/ui";
import { AmenitiesManagement } from "./amenities-management";
import { AmenityOrders } from "./orders";
import {
  PageContent,
  PageHeader,
  TableContainer,
} from "../../../components/shared/page-layouts";

export function Amenities() {
  const [activeTab, setActiveTab] = useState("amenities");
  const [searchValue, setSearchValue] = useState("");

  const tabs: TabItem[] = [
    {
      id: "amenities",
      label: "Amenities",
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
            d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
          />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "Orders",
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
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
      case "amenities":
        return <AmenitiesManagement searchValue={searchValue} />;
      case "orders":
        return <AmenityOrders searchValue={searchValue} />;
      default:
        return null;
    }
  };

  return (
    <PageContent>
      {/* Header */}
      <PageHeader
        title="Amenities"
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
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
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
