import { useMemo, useCallback } from "react";
import {
  type TableColumn,
  DataTable,
  StatusBadge,
} from "../../../../../components/ui";
import { useCurrentHotelTasks } from "../../../../../hooks/hotel-staff";
import { useUpdateTask } from "../../../../../hooks/hotel-staff/task-assignment/useTaskAssignment";
import type { Database } from "../../../../../types/database";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];

// Extended type with staff relationship
interface TaskWithStaff extends TaskRow {
  assigned_staff?: {
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

// Type for the transformed task data
interface Task extends Record<string, unknown> {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  assignedTo: string;
  dueDate: string;
  rawData: TaskWithStaff;
}

interface TasksTableProps {
  searchValue: string;
  onRowClick?: (task: TaskWithStaff) => void;
  filterByStaffId?: string;
}

export function TasksTable({
  searchValue,
  onRowClick,
  filterByStaffId,
}: TasksTableProps) {
  const { data: tasksData, isLoading, error } = useCurrentHotelTasks();
  const updateTask = useUpdateTask();

  // Status options for tasks (memoized to prevent re-creation)
  const taskStatusOptions = useMemo(
    () => ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
    []
  );

  // Handle status change (wrapped in useCallback)
  const handleStatusChange = useCallback(
    async (taskId: string, newStatus: string) => {
      await updateTask.mutateAsync({
        taskId,
        updates: {
          status: newStatus as
            | "PENDING"
            | "IN_PROGRESS"
            | "COMPLETED"
            | "CANCELLED",
        },
      });
    },
    [updateTask]
  );

  // Define table columns
  const columns: TableColumn<Task>[] = useMemo(
    () => [
      {
        key: "title",
        label: "Task",
        sortable: true,
      },
      {
        key: "type",
        label: "Type",
        sortable: true,
        render: (value) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {String(value || "General")}
          </span>
        ),
      },
      {
        key: "priority",
        label: "Priority",
        sortable: true,
        render: (value) => {
          const colors = {
            High: "bg-red-100 text-red-800",
            Medium: "bg-yellow-100 text-yellow-800",
            Low: "bg-green-100 text-green-800",
          };
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                colors[value as keyof typeof colors] || colors.Low
              }`}
            >
              {String(value)}
            </span>
          );
        },
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        render: (value, row) => (
          <StatusBadge
            status={String(value)}
            statusOptions={taskStatusOptions}
            onStatusChange={(newStatus) =>
              handleStatusChange(row.id, newStatus)
            }
          />
        ),
      },
      {
        key: "assignedTo",
        label: "Assigned To",
        sortable: true,
      },
      {
        key: "dueDate",
        label: "Due Date",
        sortable: true,
      },
    ],
    [taskStatusOptions, handleStatusChange]
  );

  // Transform raw data into table format
  const transformData = useMemo(
    () => (data: NonNullable<typeof tasksData>) => {
      if (!data) return [];

      // Filter by staff ID if provided (for Hotel Staff users)
      const filteredData = filterByStaffId
        ? data.filter((task) => task.staff_id === filterByStaffId)
        : data;

      return filteredData.map((task) => {
        const staff = task.assigned_staff;
        const personalData = staff?.hotel_staff_personal_data;
        const assignedName = personalData
          ? `${personalData.first_name || ""} ${
              personalData.last_name || ""
            }`.trim()
          : "Unassigned";

        return {
          id: task.id,
          title: task.title,
          type: task.type || "General",
          priority: task.priority,
          status: task.status,
          assignedTo: assignedName,
          dueDate: task.due_date
            ? new Date(task.due_date).toLocaleDateString()
            : "No due date",
          rawData: task,
        } as Task;
      });
    },
    [filterByStaffId]
  );

  return (
    <DataTable
      data={tasksData}
      isLoading={isLoading}
      error={error}
      columns={columns}
      searchValue={searchValue}
      searchFields={["title", "type", "assignedTo"]}
      transformData={transformData}
      emptyMessage="No tasks found. Click '+ New Task' to create one."
      loadingMessage="Loading tasks..."
      errorTitle="Failed to load tasks"
      showSummary
      summaryLabel="Total tasks"
      showPagination
      itemsPerPage={10}
      onRowClick={(row) => onRowClick?.(row.rawData)}
    />
  );
}
