import { useMemo, useState } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
} from "../../../../components/ui";
import {
  useAnnouncements,
  useUpdateAnnouncement,
} from "../../../../hooks/announcements/useAnnouncements";
import { useHotelId } from "../../../../hooks";
import type { Database } from "../../../../types/database";

type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];

interface Announcement extends Record<string, unknown> {
  id: string;
  status: string;
  isActive: boolean;
  title: string;
  description: string;
  created: string;
}

interface AnnouncementsTableProps {
  searchValue: string;
  onView: (announcement: AnnouncementRow) => void;
}

export function AnnouncementsTable({
  searchValue,
  onView,
}: AnnouncementsTableProps) {
  const hotelId = useHotelId();
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch announcements using the hook
  const {
    data: announcements,
    isLoading,
    error,
  } = useAnnouncements(hotelId || undefined);

  // Get the mutation
  const updateAnnouncement = useUpdateAnnouncement();

  // Define table columns for announcements
  const columns: TableColumn<Announcement>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={async (newStatus) => {
            await updateAnnouncement.mutateAsync({
              id: row.id,
              updates: { is_active: newStatus },
            });
          }}
        />
      ),
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
    },
  ];

  // Handler for row click
  const handleRowClick = (row: Announcement) => {
    const announcement = announcements?.find((a) => a.id === row.id);
    if (announcement) {
      onView(announcement);
    }
  };

  // Transform database data to table format with search filtering
  const announcementData: Announcement[] = useMemo(() => {
    if (!announcements) {
      return [];
    }

    let filtered = announcements
      .filter((announcement: AnnouncementRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          announcement.title.toLowerCase().includes(search) ||
          announcement.description.toLowerCase().includes(search)
        );
      })
      .map((announcement: AnnouncementRow) => ({
        id: announcement.id,
        status: announcement.is_active ? "Active" : "Inactive",
        isActive: announcement.is_active,
        title: announcement.title,
        description: announcement.description,
        created: announcement.created_at
          ? new Date(announcement.created_at).toLocaleDateString()
          : "N/A",
      }));

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[sortColumn];
        const bValue = (b as Record<string, unknown>)[sortColumn];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();

        const aNum = parseFloat(aStr);
        const bNum = parseFloat(bStr);

        let comparison = 0;
        if (!isNaN(aNum) && !isNaN(bNum)) {
          comparison = aNum - bNum;
        } else {
          comparison = aStr.localeCompare(bStr);
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [announcements, searchValue, sortColumn, sortDirection]);

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading announcements: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {announcementData.length}{" "}
          result(s)
        </p>
      )}

      {/* Announcements Table */}
      <Table
        columns={columns}
        data={announcementData}
        loading={isLoading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage={
          searchValue
            ? `No announcements found matching "${searchValue}".`
            : "No announcements found. Create new announcements to get started."
        }
        itemsPerPage={10}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
