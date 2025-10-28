import { useState } from "react";
import { TabsWithSearch, type TabItem } from "../../../components/ui";
import { StaffManagement } from "./staff-management";
import { TaskAssignment } from "./task-assignment";
import { Schedule } from "./schedule";
import { Absences } from "./absences";
import {
  PageContent,
  PageHeader,
  TableContainer,
} from "../../../components/shared/page-layouts";

export function HotelStaff() {
  const [activeTab, setActiveTab] = useState("staff-management");
  const [searchValue, setSearchValue] = useState("");

  const tabs: TabItem[] = [
    {
      id: "staff-management",
      label: "Staff Management",
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
      id: "task-assignment",
      label: "Task Assignment",
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
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      id: "schedule",
      label: "Schedule",
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "absences",
      label: "Absences",
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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
      case "staff-management":
        return <StaffManagement searchValue={searchValue} />;
      case "task-assignment":
        return <TaskAssignment searchValue={searchValue} />;
      case "schedule":
        return <Schedule searchValue={searchValue} />;
      case "absences":
        return <Absences searchValue={searchValue} />;
      default:
        return null;
    }
  };

  return (
    <PageContent>
      {/* Header */}
      <PageHeader
        title="Hotel Staff"
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
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
