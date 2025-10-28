import { useState } from "react";
import { Button, ConfirmationModal } from "../../../../components/ui";
import { TasksTable } from "./components";
import { TaskModal } from "./components/modals/task-modal";
import {
  useDeleteTask,
  useStaffPermissions,
} from "../../../../hooks/hotel-staff";
import type { Database } from "../../../../types/database";

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

interface TaskAssignmentProps {
  searchValue: string;
}

export function TaskAssignment({ searchValue }: TaskAssignmentProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithStaff | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const deleteTask = useDeleteTask();
  const permissions = useStaffPermissions();

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleRowClick = (task: TaskWithStaff) => {
    setSelectedTask(task);
    setModalMode("view");
    setIsDetailModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTask(null);
    setModalMode("view");
  };

  const handleEdit = () => {
    setModalMode("edit");
  };

  const handleDelete = () => {
    setIsDetailModalOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTask) {
      try {
        await deleteTask.mutateAsync(selectedTask.id);
        setIsDeleteConfirmOpen(false);
        handleCloseDetailModal();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Task Assignment</h2>
        {permissions.canAddTask && (
          <Button variant="primary" onClick={handleAddNew}>
            + Add Task
          </Button>
        )}
      </div>
      <p className="text-gray-500">
        Assign and track tasks for hotel staff members.
      </p>

      <TasksTable searchValue={searchValue} onRowClick={handleRowClick} />

      {/* Add New Task Modal */}
      <TaskModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        mode="create"
      />

      {/* Task Detail/Edit Modal */}
      <TaskModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        task={selectedTask}
        mode={modalMode}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={permissions.canEditTask()}
        canDelete={permissions.canDeleteTask()}
        canOnlyEditStatus={permissions.canOnlyEditTaskStatus()}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteTask.isPending}
      />
    </div>
  );
}
