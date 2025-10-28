import { useState } from "react";
import { CalendarHeader } from "./header";
import { CalendarGrid } from "./CalendarGrid";
import { ScheduleModal, SchedulesListModal } from "./modals";
import { ConfirmationModal } from "../../../../../components/ui";
import type { CalendarView } from "./types";
import type { StaffScheduleWithDetails } from "../../../../../types/staff-schedules";
import { useHotelContext } from "../../../../../hooks/useHotelContext";
import { useSchedulesByDateRange } from "../../../../../hooks/staff-schedules";
import { useDeleteStaffSchedule } from "../../../../../hooks/staff-schedules";
import { useStaffPermissions } from "../../../../../hooks/hotel-staff";

export type { CalendarView };

interface CalendarProps {
  searchValue: string;
}

export function Calendar({ searchValue }: CalendarProps) {
  const { hotelId } = useHotelContext();
  const permissions = useStaffPermissions();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 21)); // October 21, 2025
  const [view, setView] = useState<CalendarView>("month");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedSchedule, setSelectedSchedule] =
    useState<StaffScheduleWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [prefilledDate, setPrefilledDate] = useState<Date | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [daySchedules, setDaySchedules] = useState<StaffScheduleWithDetails[]>(
    []
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] =
    useState<StaffScheduleWithDetails | null>(null);

  const deleteSchedule = useDeleteStaffSchedule();

  // Calculate date range based on view
  const getDateRange = () => {
    if (view === "month") {
      const start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      // Format as YYYY-MM-DD without timezone conversion
      const formatDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      return {
        start: formatDate(start),
        end: formatDate(end),
      };
    } else {
      // Week view
      const dayOfWeek = currentDate.getDay();
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - dayOfWeek);
      const end = new Date(currentDate);
      end.setDate(currentDate.getDate() + (6 - dayOfWeek));

      // Format as YYYY-MM-DD without timezone conversion
      const formatDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      return {
        start: formatDate(start),
        end: formatDate(end),
      };
    }
  };

  const dateRange = getDateRange();
  const { data: allSchedules = [], isLoading } = useSchedulesByDateRange(
    hotelId || undefined,
    dateRange.start,
    dateRange.end
  );

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date(2025, 9, 21)); // October 21, 2025
  };

  const handleScheduleClick = (schedule: StaffScheduleWithDetails) => {
    setSelectedSchedule(schedule);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleDayClick = (
    date: Date,
    schedules: StaffScheduleWithDetails[]
  ) => {
    setSelectedDate(date);
    setDaySchedules(schedules);
    setIsListModalOpen(true);
  };

  const handleCloseListModal = () => {
    setIsListModalOpen(false);
    setSelectedDate(null);
    setDaySchedules([]);
  };

  const handleScheduleSelectFromList = (schedule: StaffScheduleWithDetails) => {
    setSelectedSchedule(schedule);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleCreateSchedule = (date: Date) => {
    setPrefilledDate(date);
    setIsCreateMode(true);
    setSelectedSchedule(null);
    setIsModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsModalOpen(false);
    setIsCreateMode(false);
    setModalMode("view");
    setPrefilledDate(null);
    setSelectedSchedule(null);
  };

  const handleEdit = () => {
    setModalMode("edit");
  };

  const handleDelete = () => {
    if (selectedSchedule) {
      setScheduleToDelete(selectedSchedule);
      setIsModalOpen(false);
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!scheduleToDelete) return;

    try {
      await deleteSchedule.mutateAsync(scheduleToDelete.id);
      setIsDeleteConfirmOpen(false);
      setScheduleToDelete(null);
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      {isLoading ? (
        <div className="p-6 text-center text-gray-500">
          Loading schedules...
        </div>
      ) : (
        <CalendarGrid
          currentDate={currentDate}
          view={view}
          searchValue={searchValue}
          statusFilter={statusFilter}
          schedules={allSchedules}
          onScheduleClick={handleScheduleClick}
          onDayClick={handleDayClick}
          onCreateSchedule={handleCreateSchedule}
        />
      )}
      <SchedulesListModal
        isOpen={isListModalOpen}
        onClose={handleCloseListModal}
        date={selectedDate || new Date()}
        schedules={daySchedules}
        onScheduleSelect={handleScheduleSelectFromList}
      />
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseCreateModal}
        schedule={selectedSchedule}
        mode={isCreateMode ? "create" : modalMode}
        prefilledDate={prefilledDate}
        onEdit={!isCreateMode && selectedSchedule ? handleEdit : undefined}
        onDelete={!isCreateMode && selectedSchedule ? handleDelete : undefined}
        canEdit={permissions.canEditSchedule()}
        canDelete={permissions.canDeleteSchedule()}
        canOnlyEditStatus={permissions.canOnlyEditScheduleStatus()}
      />
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Schedule"
        message={`Are you sure you want to delete this schedule? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
