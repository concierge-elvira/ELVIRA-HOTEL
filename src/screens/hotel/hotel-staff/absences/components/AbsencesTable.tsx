import { useMemo, useCallback } from "react";
import {
  type TableColumn,
  DataTable,
  StatusBadge,
} from "../../../../../components/ui";
import { useCurrentHotelAbsences } from "../../../../../hooks/hotel-staff";
import { useUpdateAbsenceRequest } from "../../../../../hooks/hotel-staff/absences/useAbsences";
import type { Database } from "../../../../../types/database";

type AbsenceRequestRow =
  Database["public"]["Tables"]["absence_requests"]["Row"];

// Extended type with staff relationship
interface AbsenceWithStaff extends AbsenceRequestRow {
  staff?: {
    id: string;
    position: string;
    department: string;
    hotel_staff_personal_data?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

// Type for the transformed absence data
interface AbsenceRequest extends Record<string, unknown> {
  id: string;
  staffName: string;
  requestType: string;
  startDate: string;
  endDate: string;
  status: string;
  days: number;
  rawData: AbsenceWithStaff;
}

interface AbsencesTableProps {
  searchValue: string;
  onRowClick?: (absence: AbsenceWithStaff) => void;
  filterByStaffId?: string;
  canEditStatus?: boolean; // Whether the current user can edit status
}

export function AbsencesTable({
  searchValue,
  onRowClick,
  filterByStaffId,
  canEditStatus = true, // Default to true for backward compatibility
}: AbsencesTableProps) {
  const { data: absencesData, isLoading, error } = useCurrentHotelAbsences();
  const updateAbsenceRequest = useUpdateAbsenceRequest();

  console.log("[AbsencesTable] Props:", {
    filterByStaffId,
    canEditStatus,
    dataLength: absencesData?.length || 0,
  });

  // Status options for absence requests (memoized)
  const absenceStatusOptions = useMemo(
    () => ["pending", "approved", "rejected", "cancelled"],
    []
  );

  // Handle status change (wrapped in useCallback)
  const handleStatusChange = useCallback(
    async (requestId: string, newStatus: string) => {
      console.log("[AbsencesTable] Status change attempt:", {
        requestId,
        newStatus,
        canEditStatus,
      });

      if (!canEditStatus) {
        console.warn(
          "[AbsencesTable] Status change blocked: User does not have permission"
        );
        return;
      }

      await updateAbsenceRequest.mutateAsync({
        requestId,
        updates: { status: newStatus },
      });
    },
    [updateAbsenceRequest, canEditStatus]
  );

  // Define table columns
  const columns: TableColumn<AbsenceRequest>[] = useMemo(
    () => [
      {
        key: "staffName",
        label: "Staff Member",
        sortable: true,
      },
      {
        key: "requestType",
        label: "Type",
        sortable: true,
        render: (value) => {
          const labels: Record<string, string> = {
            vacation: "Vacation",
            sick: "Sick Leave",
            personal: "Personal",
            training: "Training",
            other: "Other",
          };
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
              {labels[String(value)] || String(value)}
            </span>
          );
        },
      },
      {
        key: "startDate",
        label: "Start Date",
        sortable: true,
      },
      {
        key: "endDate",
        label: "End Date",
        sortable: true,
      },
      {
        key: "days",
        label: "Days",
        sortable: true,
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        render: (value, row) => (
          <StatusBadge
            status={String(value)}
            statusOptions={absenceStatusOptions}
            onStatusChange={
              canEditStatus
                ? (newStatus: string) => handleStatusChange(row.id, newStatus)
                : undefined // Disable status change when undefined
            }
          />
        ),
      },
    ],
    [absenceStatusOptions, handleStatusChange, canEditStatus]
  );

  // Transform raw data into table format
  const transformData = useMemo(
    () => (data: NonNullable<typeof absencesData>) => {
      if (!data) return [];

      console.log("[AbsencesTable] Transform data:", {
        totalRecords: data.length,
        filterByStaffId,
      });

      // Filter by staff ID if provided (for Hotel Staff users)
      const filteredData = filterByStaffId
        ? data.filter((absence) => absence.staff_id === filterByStaffId)
        : data;

      console.log("[AbsencesTable] After filtering:", {
        filteredCount: filteredData.length,
      });

      return filteredData.map((absence) => {
        const staff = absence.staff;
        const personalData = staff?.hotel_staff_personal_data;
        const staffName = personalData
          ? `${personalData.first_name || ""} ${
              personalData.last_name || ""
            }`.trim()
          : "Unknown";

        // Calculate days
        const start = new Date(absence.start_date);
        const end = new Date(absence.end_date);
        const days =
          Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
          1;

        return {
          id: absence.id,
          staffName,
          requestType: absence.request_type,
          startDate: start.toLocaleDateString(),
          endDate: end.toLocaleDateString(),
          status: absence.status,
          days,
          rawData: absence,
        } as AbsenceRequest;
      });
    },
    [filterByStaffId]
  );

  return (
    <DataTable
      data={absencesData}
      isLoading={isLoading}
      error={error}
      columns={columns}
      searchValue={searchValue}
      searchFields={["staffName", "requestType"]}
      transformData={transformData}
      emptyMessage="No absence requests found."
      loadingMessage="Loading absence requests..."
      errorTitle="Failed to load absence requests"
      showSummary
      summaryLabel="Total absence requests"
      showPagination
      itemsPerPage={10}
      onRowClick={(row) => onRowClick?.(row.rawData)}
    />
  );
}
