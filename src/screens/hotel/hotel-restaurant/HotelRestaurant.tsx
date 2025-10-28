import { useState } from "react";
import { TabsWithSearch, type TabItem } from "../../../components/ui";
import { Restaurants } from "./restaurants";
import { MenuItems } from "./menu-items";
import { RestaurantOrders } from "./orders";
import {
  PageContent,
  PageHeader,
  TableContainer,
} from "../../../components/shared/page-layouts";

export function HotelRestaurant() {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [searchValue, setSearchValue] = useState("");

  const tabs: TabItem[] = [
    {
      id: "restaurants",
      label: "Restaurant/s",
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      id: "menu-items",
      label: "Menu Items",
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
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
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
      case "restaurants":
        return <Restaurants searchValue={searchValue} />;
      case "menu-items":
        return <MenuItems searchValue={searchValue} />;
      case "orders":
        return <RestaurantOrders searchValue={searchValue} />;
      default:
        return null;
    }
  };

  return (
    <PageContent>
      {/* Header */}
      <PageHeader
        title="Hotel Restaurant"
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
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
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
