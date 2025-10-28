import { useMemo } from "react";
import {
  type TableColumn,
  DataTable,
  StatusBadge,
} from "../../../../../components/ui";
import { useCurrentHotelStaff } from "../../../../../hooks/hotel-staff";

interface StaffData {
  id: string;
  position: string;
  department: string;
  status: string;
  employee_id: string;
  hire_date: string;
  hotel_staff_personal_data?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string | null;
    date_of_birth?: string | null;
    address?: string | null;
    city?: string | null;
    zip_code?: string | null;
    country?: string | null;
  };
}

// Type for the transformed staff data
interface StaffMember extends Record<string, unknown> {
  id: string;
  status: string;
  employeeId: string;
  position: string;
  department: string;
  hireDate: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  rawData: StaffData;
}

interface StaffTableProps {
  searchValue: string;
  onRowClick?: (staff: StaffData) => void;
}

export function StaffTable({ searchValue, onRowClick }: StaffTableProps) {
  const { data: staffData, isLoading, error } = useCurrentHotelStaff();

  // Define table columns
  const columns: TableColumn<StaffMember>[] = useMemo(
    () => [
      {
        key: "status",
        label: "Status",
        sortable: true,
        render: (value) => <StatusBadge status={String(value)} />,
      },
      {
        key: "employeeId",
        label: "Employee ID",
        sortable: true,
      },
      {
        key: "fullName",
        label: "Name",
        sortable: true,
      },
      {
        key: "position",
        label: "Position",
        sortable: true,
      },
      {
        key: "department",
        label: "Department",
        sortable: true,
      },
      {
        key: "email",
        label: "Email",
      },
      {
        key: "phoneNumber",
        label: "Phone",
      },
      {
        key: "hireDate",
        label: "Hire Date",
        sortable: true,
      },
    ],
    []
  );

  // Transform raw data into table format
  const transformData = useMemo(
    () => (data: NonNullable<typeof staffData>) => {
      if (!data) return [];

      return data.map((staff) => {
        const personalData = staff.hotel_staff_personal_data;
        const firstName = personalData?.first_name || "";
        const lastName = personalData?.last_name || "";

        return {
          id: staff.id,
          status: staff.status,
          employeeId: staff.employee_id,
          position: staff.position,
          department: staff.department,
          hireDate: new Date(staff.hire_date).toLocaleDateString(),
          fullName: `${firstName} ${lastName}`.trim() || "N/A",
          email: personalData?.email || "N/A",
          phoneNumber: personalData?.phone_number || "N/A",
          rawData: staff as StaffData,
        } as StaffMember;
      });
    },
    []
  );

  return (
    <DataTable
      data={staffData}
      isLoading={isLoading}
      error={error}
      columns={columns}
      searchValue={searchValue}
      searchFields={[
        "fullName",
        "employeeId",
        "position",
        "department",
        "email",
      ]}
      transformData={transformData}
      emptyMessage="No staff members found. Click '+ Add Member' to get started."
      loadingMessage="Loading staff members..."
      errorTitle="Failed to load staff members"
      showSummary
      summaryLabel="Total staff members"
      showPagination
      itemsPerPage={10}
      onRowClick={(row) => onRowClick?.(row.rawData)}
    />
  );
}
