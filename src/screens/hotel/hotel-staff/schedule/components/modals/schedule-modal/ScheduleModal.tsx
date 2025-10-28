import { useState, useEffect } from "react";
import {
  ModalForm,
  ModalFormActions,
} from "../../../../../../../components/ui";
import { useCurrentHotelStaff } from "../../../../../../../hooks/hotel-staff/staff-management";
import { useHotelContext } from "../../../../../../../hooks";
import {
  useCreateStaffSchedule,
  useUpdateStaffSchedule,
  useDeleteStaffSchedule,
} from "../../../../../../../hooks/staff-schedules";
import { ScheduleStaffSection } from "./ScheduleStaffSection";
import { ScheduleDatesSection } from "./ScheduleDatesSection";
import { ScheduleShiftSection } from "./ScheduleShiftSection";
import { ScheduleStatusSection } from "./ScheduleStatusSection";
import { ScheduleNotesSection } from "./ScheduleNotesSection";
import type { ScheduleModalProps, ScheduleFormData } from "./types";

export function ScheduleModal({
  isOpen,
  onClose,
  schedule = null,
  mode: initialMode = "create",
  onEdit,
  onDelete,
  prefilledDate,
  canEdit = true,
  canDelete = true,
  canOnlyEditStatus = false,
}: ScheduleModalProps) {
  const [internalMode, setInternalMode] = useState(initialMode);
  const { hotelId } = useHotelContext();
  const createSchedule = useCreateStaffSchedule();
  const updateSchedule = useUpdateStaffSchedule();
  const deleteSchedule = useDeleteStaffSchedule();
  const { data: staffData, isLoading: isLoadingStaff } = useCurrentHotelStaff();

  const [formData, setFormData] = useState<ScheduleFormData>({
    staffId: "",
    scheduleStartDate: "",
    scheduleFinishDate: "",
    shiftStart: "",
    shiftEnd: "",
    status: "SCHEDULED",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Update internal mode when prop changes
  useEffect(() => {
    setInternalMode(initialMode);
  }, [initialMode]);

  // Populate form when editing or viewing
  useEffect(() => {
    if (schedule && (internalMode === "edit" || internalMode === "view")) {
      setFormData({
        staffId: schedule.staff_id,
        scheduleStartDate: schedule.schedule_start_date,
        scheduleFinishDate: schedule.schedule_finish_date,
        shiftStart: schedule.shift_start,
        shiftEnd: schedule.shift_end,
        status: schedule.status,
        notes: schedule.notes || "",
      });
    } else if (internalMode === "create") {
      // Format prefilled date if provided
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const prefilledStartDate = prefilledDate ? formatDate(prefilledDate) : "";

      setFormData({
        staffId: "",
        scheduleStartDate: prefilledStartDate,
        scheduleFinishDate: prefilledStartDate,
        shiftStart: "",
        shiftEnd: "",
        status: "SCHEDULED",
        notes: "",
      });
    }
  }, [schedule, internalMode, isOpen, prefilledDate]);

  const validateForm = () => {
    const newErrors: Record<string, string | undefined> = {};
    let isValid = true;

    if (!formData.staffId) {
      newErrors.staffId = "Please select a staff member";
      isValid = false;
    }

    if (!formData.scheduleStartDate) {
      newErrors.scheduleStartDate = "Start date is required";
      isValid = false;
    }

    if (!formData.scheduleFinishDate) {
      newErrors.scheduleFinishDate = "Finish date is required";
      isValid = false;
    } else if (
      formData.scheduleStartDate &&
      formData.scheduleFinishDate < formData.scheduleStartDate
    ) {
      newErrors.scheduleFinishDate = "Finish date cannot be before start date";
      isValid = false;
    }

    if (!formData.shiftStart) {
      newErrors.shiftStart = "Shift start time is required";
      isValid = false;
    }

    if (!formData.shiftEnd) {
      newErrors.shiftEnd = "Shift end time is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!hotelId) {
      console.error("Hotel ID is required");
      return;
    }

    try {
      if (internalMode === "edit" && schedule) {
        await updateSchedule.mutateAsync({
          id: schedule.id,
          updates: {
            schedule_start_date: formData.scheduleStartDate,
            schedule_finish_date: formData.scheduleFinishDate,
            shift_start: formData.shiftStart,
            shift_end: formData.shiftEnd,
            status: formData.status,
            notes: formData.notes.trim() || undefined,
          },
        });
      } else if (internalMode === "create") {
        await createSchedule.mutateAsync({
          staff_id: formData.staffId,
          hotel_id: hotelId,
          schedule_start_date: formData.scheduleStartDate,
          schedule_finish_date: formData.scheduleFinishDate,
          shift_start: formData.shiftStart,
          shift_end: formData.shiftEnd,
          status: formData.status,
          notes: formData.notes.trim() || undefined,
        });
      }

      handleClose();
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      staffId: "",
      scheduleStartDate: "",
      scheduleFinishDate: "",
      shiftStart: "",
      shiftEnd: "",
      status: "SCHEDULED",
      notes: "",
    });
    setErrors({});
    setInternalMode(initialMode);
    onClose();
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    } else {
      setInternalMode("edit");
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isPending =
    createSchedule.isPending ||
    updateSchedule.isPending ||
    deleteSchedule.isPending;

  // Prepare staff options
  const staffOptions = [
    { value: "", label: "Select staff member" },
    ...(staffData?.map((staff) => {
      const personalData = staff.hotel_staff_personal_data;
      const name = personalData
        ? `${personalData.first_name || ""} ${
            personalData.last_name || ""
          }`.trim()
        : "Unknown";
      return {
        value: staff.id,
        label: `${name} - ${staff.position || "No Position"}`,
      };
    }) || []),
  ];

  const modalTitle =
    internalMode === "view"
      ? "Schedule Details"
      : internalMode === "edit"
      ? "Edit Schedule"
      : "New Schedule";

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      size="lg"
      footer={
        <ModalFormActions
          mode={internalMode}
          onCancel={handleClose}
          onEdit={canEdit && onEdit ? handleEditClick : undefined}
          onDelete={canDelete && onDelete ? handleDeleteClick : undefined}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel={
            internalMode === "edit" ? "Update Schedule" : "Create Schedule"
          }
        />
      }
    >
      <form onSubmit={handleSubmit}>
        <ScheduleStaffSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          errors={errors}
          disabled={isPending || (internalMode === "edit" && canOnlyEditStatus)}
          staffOptions={staffOptions}
          isLoadingStaff={isLoadingStaff}
        />

        <ScheduleDatesSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          errors={errors}
          disabled={isPending || (internalMode === "edit" && canOnlyEditStatus)}
        />

        <ScheduleShiftSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          errors={errors}
          disabled={isPending || (internalMode === "edit" && canOnlyEditStatus)}
        />

        <ScheduleStatusSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          errors={errors}
          disabled={isPending}
        />

        <ScheduleNotesSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          disabled={isPending || (internalMode === "edit" && canOnlyEditStatus)}
        />
      </form>
    </ModalForm>
  );
}
