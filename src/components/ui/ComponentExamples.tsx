// Example usage of the UI components
// This file demonstrates how to use the various UI components

import { useState } from "react";
import {
  Button,
  IconButton,
  Input,
  SearchBox,
  Select,
  Textarea,
  Modal,
  LoadingState,
  EmptyState,
  ErrorState,
  Table,
  Pagination,
  Card,
  StatCard,
  InfoCard,
  TabsWithSearch,
  TabsWithoutSearch,
  type TableColumn,
  type TabItem,
} from "../ui";

// Example data for table
interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
  },
];

const userColumns: TableColumn<User>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "role", label: "Role" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          String(value) === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {String(value)}
      </span>
    ),
  },
];

export function ComponentExamples() {
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("staff-management");
  const [tabSearchValue, setTabSearchValue] = useState("");
  const [activeSimpleTab, setActiveSimpleTab] = useState("overview");

  // Example tabs for TabsWithSearch
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
      id: "absence-tracker",
      label: "Absence Tracker",
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

  // Example tabs for TabsWithoutSearch
  const simpleTabs: TabItem[] = [
    {
      id: "overview",
      label: "Overview",
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
      id: "analytics",
      label: "Analytics",
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
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
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
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Tabs with Search */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Tabs with Search</h2>
        <TabsWithSearch
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchValue={tabSearchValue}
          onSearchChange={setTabSearchValue}
          searchPlaceholder="Search staff members..."
          onSearchClear={() => setTabSearchValue("")}
        />
        <div className="p-4 bg-gray-50">
          <p className="text-sm text-gray-600">
            Active tab: <strong>{tabs.find(tab => tab.id === activeTab)?.label}</strong>
          </p>
          {tabSearchValue && (
            <p className="text-sm text-gray-600">
              Search query: <strong>"{tabSearchValue}"</strong>
            </p>
          )}
        </div>
      </Card>

      {/* Tabs without Search */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Tabs without Search</h2>
        <TabsWithoutSearch
          tabs={simpleTabs}
          activeTab={activeSimpleTab}
          onTabChange={setActiveSimpleTab}
        />
        <div className="p-4 bg-gray-50">
          <p className="text-sm text-gray-600">
            Active tab: <strong>{simpleTabs.find(tab => tab.id === activeSimpleTab)?.label}</strong>
          </p>
        </div>
      </Card>
          </p>
        </div>
      </Card>

      {/* Buttons */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button loading>Loading</Button>
          <IconButton
            icon={<span>🔍</span>}
            onClick={() => console.log("Search clicked")}
          />
        </div>
      </Card>

      {/* Forms */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Form Elements</h2>
        <div className="space-y-4 max-w-md">
          <Input
            label="Name"
            placeholder="Enter your name"
            hint="This is a helpful hint"
          />
          <SearchBox
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search users..."
          />
          <Select
            label="Role"
            options={[
              { value: "admin", label: "Administrator" },
              { value: "user", label: "User" },
              { value: "guest", label: "Guest" },
            ]}
            placeholder="Select a role"
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            rows={3}
          />
        </div>
      </Card>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value="1,234"
          change={{ value: "+12%", type: "increase" }}
          icon={<span>👥</span>}
        />
        <StatCard
          title="Revenue"
          value="$45,678"
          change={{ value: "-5%", type: "decrease" }}
          icon={<span>💰</span>}
        />
        <StatCard
          title="Orders"
          value="567"
          change={{ value: "0%", type: "neutral" }}
          icon={<span>📦</span>}
        />
      </div>

      {/* Info Card */}
      <InfoCard
        title="Hotel Information"
        description="Manage your hotel details and settings"
        icon={<span>🏨</span>}
        actions={
          <Button size="sm" onClick={() => setShowModal(true)}>
            Edit
          </Button>
        }
      >
        <p>
          Here you can add additional content or controls for the hotel
          information.
        </p>
      </InfoCard>

      {/* Table */}
      <Card padding="none">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Users Table</h2>
        </div>
        <Table
          columns={userColumns}
          data={sampleUsers}
          actions={[
            {
              label: "Edit",
              icon: <span>✏️</span>,
              onClick: (user) => console.log("Edit", user),
              variant: "primary",
            },
            {
              label: "Delete",
              icon: <span>🗑️</span>,
              onClick: (user) => console.log("Delete", user),
              variant: "danger",
            },
          ]}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
          totalItems={50}
          itemsPerPage={10}
        />
      </Card>

      {/* States */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <LoadingState message="Loading data..." />
        </Card>
        <Card>
          <EmptyState
            title="No data"
            message="There's nothing to show here yet."
            actionText="Add Item"
            onAction={() => console.log("Add item")}
          />
        </Card>
        <Card>
          <ErrorState
            message="Something went wrong while loading the data."
            onRetry={() => console.log("Retry")}
          />
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Example Modal"
      >
        <p>This is an example modal with consistent styling.</p>
        <div className="mt-4 flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowModal(false)}>Save</Button>
        </div>
      </Modal>
    </div>
  );
}
