import { useMemo, useState } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
} from "../../../../components/ui";
import {
  useEmergencyContacts,
  useUpdateEmergencyContact,
} from "../../../../hooks/emergency-contacts/useEmergencyContacts";
import { useHotelId } from "../../../../hooks/useHotelContext";
import type { Database } from "../../../../types/database";

type EmergencyContactRow =
  Database["public"]["Tables"]["emergency_contacts"]["Row"];

interface EmergencyContact extends Record<string, unknown> {
  id: string;
  status: string;
  isActive: boolean;
  contactName: string;
  contactPhone: string;
  created: string;
}

interface EmergencyContactsTableProps {
  searchValue: string;
  onView: (contact: EmergencyContactRow) => void;
}

export function EmergencyContactsTable({
  searchValue,
  onView,
}: EmergencyContactsTableProps) {
  const hotelId = useHotelId();
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch emergency contacts using the hook
  const {
    data: emergencyContacts,
    isLoading,
    error,
  } = useEmergencyContacts(hotelId || undefined);

  // Get the mutations
  const updateEmergencyContact = useUpdateEmergencyContact();

  // Define table columns for emergency contacts
  const columns: TableColumn<EmergencyContact>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={async (newStatus) => {
            await updateEmergencyContact.mutateAsync({
              id: row.id,
              updates: { is_active: newStatus },
            });
          }}
        />
      ),
    },
    {
      key: "contactName",
      label: "Contact Name",
      sortable: true,
    },
    {
      key: "contactPhone",
      label: "Contact Phone",
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
    },
  ];

  // Handler for row click
  const handleRowClick = (row: EmergencyContact) => {
    const contact = emergencyContacts?.find((c) => c.id === row.id);
    if (contact) {
      onView(contact);
    }
  };

  // Transform database data to table format with search filtering
  const contactData: EmergencyContact[] = useMemo(() => {
    if (!emergencyContacts) {
      return [];
    }

    let filtered = emergencyContacts
      .filter((contact: EmergencyContactRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          contact.contact_name.toLowerCase().includes(search) ||
          contact.phone_number.toLowerCase().includes(search)
        );
      })
      .map((contact: EmergencyContactRow) => ({
        id: contact.id,
        status: contact.is_active ? "Active" : "Inactive",
        isActive: contact.is_active,
        contactName: contact.contact_name,
        contactPhone: contact.phone_number,
        created: contact.created_at
          ? new Date(contact.created_at).toLocaleDateString()
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

        const comparison = aStr.localeCompare(bStr);
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [emergencyContacts, searchValue, sortColumn, sortDirection]);

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
          Error loading emergency contacts: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {contactData.length} result(s)
        </p>
      )}

      {/* Emergency Contacts Table */}
      <Table
        columns={columns}
        data={contactData}
        loading={isLoading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage={
          searchValue
            ? `No emergency contacts found matching "${searchValue}".`
            : "No emergency contacts found. Add new contacts to get started."
        }
        itemsPerPage={10}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
