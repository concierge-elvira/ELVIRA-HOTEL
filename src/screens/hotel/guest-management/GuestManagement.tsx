import { useState, useMemo } from "react";
import { Table, type TableColumn, StatusBadge } from "../../../components/ui";
import {
  useGuests,
  useUpdateGuest,
} from "../../../hooks/guest-management/useGuests";
import { useHotelContext } from "../../../hooks/useHotelContext";
import {
  PageContent,
  PageHeader,
  PageToolbar,
  TableContainer,
} from "../../../components/shared/page-layouts";

interface GuestTableData extends Record<string, unknown> {
  id: string;
  room: string;
  status: string;
  isActive: boolean;
  dnd: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  language: string;
}

interface GuestManagementProps {
  searchValue?: string;
}

export function GuestManagement({
  searchValue: externalSearchValue,
}: GuestManagementProps) {
  const [internalSearchValue, setInternalSearchValue] = useState("");
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get hotel ID from context
  const { hotelId } = useHotelContext();

  // Fetch guests data
  const {
    data: guests = [],
    isLoading,
    error,
  } = useGuests(hotelId || undefined);

  // Get the update mutation
  const updateGuest = useUpdateGuest();

  // Use external search value if provided (for tab-based usage), otherwise use internal state
  const searchValue =
    externalSearchValue !== undefined
      ? externalSearchValue
      : internalSearchValue;
  const setSearchValue =
    externalSearchValue !== undefined ? () => {} : setInternalSearchValue;

  const handleSearchClear = () => {
    setSearchValue("");
  };

  // Transform and filter guest data
  const guestData = useMemo(() => {
    const transformedData: GuestTableData[] = guests.map((guest) => ({
      id: guest.id,
      room: guest.room_number,
      status: guest.is_active ? "Active" : "Inactive",
      isActive: guest.is_active,
      dnd: guest.dnd_status ? "Yes" : "No",
      firstName: guest.guest_personal_data?.first_name || "N/A",
      lastName: guest.guest_personal_data?.last_name || "N/A",
      email: guest.guest_personal_data?.guest_email || "N/A",
      phone: guest.guest_personal_data?.phone_number || "N/A",
      country: guest.guest_personal_data?.country || "N/A",
      language: guest.guest_personal_data?.language || "N/A",
    }));

    // Apply search filter
    let filtered = transformedData;
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = transformedData.filter(
        (guest) =>
          guest.firstName.toLowerCase().includes(searchLower) ||
          guest.lastName.toLowerCase().includes(searchLower) ||
          guest.email.toLowerCase().includes(searchLower) ||
          guest.room.toLowerCase().includes(searchLower) ||
          guest.phone.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

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
  }, [guests, searchValue, sortColumn, sortDirection]);

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Define table columns
  const columns: TableColumn<GuestTableData>[] = [
    {
      key: "room",
      label: "Room",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={async (newStatus) => {
            await updateGuest.mutateAsync({
              id: row.id,
              updates: { is_active: newStatus },
            });
          }}
        />
      ),
    },
    {
      key: "dnd",
      label: "DND",
      sortable: true,
    },
    {
      key: "firstName",
      label: "First Name",
      sortable: true,
    },
    {
      key: "lastName",
      label: "Last Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
    },
    {
      key: "country",
      label: "Country",
      sortable: true,
    },
    {
      key: "language",
      label: "Language",
      sortable: true,
    },
  ];

  return (
    <PageContent>
      <PageHeader
        title="Guest Management"
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
      />

      {/* Toolbar with Search and Actions */}
      <PageToolbar
        description="Manage hotel guests, track room assignments, and monitor guest preferences and status."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search guests by name, room, or email..."
        onSearchClear={handleSearchClear}
        buttonLabel="Add Guest"
        onButtonClick={() => {
          // TODO: Open add guest modal
        }}
      />

      {/* Guest Management Table */}
      <TableContainer>
        {searchValue && (
          <p className="text-sm text-gray-600 mb-4">
            Searching for: "{searchValue}"
          </p>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              Error loading guests: {error.message}
            </p>
          </div>
        )}

        <Table
          columns={columns}
          data={guestData}
          loading={isLoading}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyMessage="No guests found. Guest information will appear here once check-ins begin."
        />
      </TableContainer>
    </PageContent>
  );
}
