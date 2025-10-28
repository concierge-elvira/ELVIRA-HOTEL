import { useState, useEffect } from "react";
import {
  ModalForm,
  ModalFormActions,
} from "../../../../../../../components/ui";
import { useCurrentHotelStaff } from "../../../../../../../hooks/hotel-staff/staff-management";
import {
  useCreateTask,
  useUpdateTask,
} from "../../../../../../../hooks/hotel-staff";
import { useTaskForm } from "../hooks";
import { TaskBasicSection } from "./TaskBasicSection";
import { TaskCategorySection } from "./TaskCategorySection";
import { TaskAssignmentSection } from "./TaskAssignmentSection";
import { TaskScheduleSection } from "./TaskScheduleSection";
import type { TaskModalProps, TaskRow } from "./types";

/**
 * TaskModal - Unified modal for creating, editing, and viewing tasks
 * Uses the new ModalForm components for consistent styling across all modes
 */
export function TaskModal({
  isOpen,
  onClose,
  task = null,
  mode = "create",
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  canOnlyEditStatus = false,
}: TaskModalProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { data: staffData, isLoading: isLoadingStaff } = useCurrentHotelStaff();
  const [internalMode, setInternalMode] = useState(mode);

  const { formData, setFormData, errors, validateForm, resetForm } =
    useTaskForm(task as TaskRow | null);

  // Update internal mode when prop changes
  useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  const isViewMode = internalMode === "view";
  const isEditMode = internalMode === "edit";

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (task) {
        // Update existing task
        await updateTask.mutateAsync({
          taskId: task.id,
          updates: {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            type: formData.type || undefined,
            priority: formData.priority as "Low" | "Medium" | "High",
            status: formData.status as
              | "PENDING"
              | "IN_PROGRESS"
              | "COMPLETED"
              | "CANCELLED",
            staff_id: formData.staffId || undefined,
            due_date: formData.dueDate || undefined,
            due_time: formData.dueTime || undefined,
          },
        });
      } else {
        // Create new task
        await createTask.mutateAsync({
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          type: formData.type || undefined,
          priority: formData.priority as "Low" | "Medium" | "High",
          staff_id: formData.staffId || undefined,
          due_date: formData.dueDate || undefined,
          due_time: formData.dueTime || undefined,
        });
      }

      handleClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleClose = () => {
    resetForm();
    setInternalMode(mode);
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
    setFormData({ ...formData, [field]: value });
  };

  const isPending = createTask.isPending || updateTask.isPending;

  // Prepare staff options for dropdown
  const staffOptions = [
    { value: "", label: "Select staff member (optional)" },
    ...(staffData?.map((staff) => {
      const personalData = staff.hotel_staff_personal_data;
      const name = personalData
        ? `${personalData.first_name || ""} ${
            personalData.last_name || ""
          }`.trim()
        : staff.employee_id;
      const department = staff.department ? ` - ${staff.department}` : "";

      return {
        value: staff.id,
        label: `${name}${department}`,
      };
    }) || []),
  ];

  // Get modal title
  const modalTitle = isViewMode
    ? "Task Details"
    : isEditMode
    ? "Edit Task"
    : "Create New Task";

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
          submitLabel={internalMode === "edit" ? "Update Task" : "Create Task"}
        />
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Task Title & Description */}
        <TaskBasicSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          errors={errors}
          disabled={isPending || (isEditMode && canOnlyEditStatus)}
        />

        {/* Task Type & Priority */}
        <TaskCategorySection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          errors={errors}
          disabled={isPending || (isEditMode && canOnlyEditStatus)}
        />

        {/* Assignment & Status */}
        <TaskAssignmentSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          disabled={isPending}
          staffOptions={staffOptions}
          isLoadingStaff={isLoadingStaff}
          canOnlyEditStatus={canOnlyEditStatus}
        />

        {/* Due Date & Time */}
        <TaskScheduleSection
          mode={internalMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          disabled={isPending || (isEditMode && canOnlyEditStatus)}
        />
      </form>
    </ModalForm>
  );
}
