import { useState } from "react";
import { Button, ConfirmationModal } from "../../../../components/ui";
import { StaffTable } from "./components";
import { StaffModal } from "./components/modals/staff-modal";
import {
  useDeleteStaff,
  useStaffPermissions,
} from "../../../../hooks/hotel-staff";

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

interface StaffManagementProps {
  searchValue: string;
}

export function StaffManagement({ searchValue }: StaffManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const deleteStaff = useDeleteStaff();
  const permissions = useStaffPermissions();

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleRowClick = (staff: StaffData) => {
    setSelectedStaff(staff);
    setModalMode("view");
    setIsDetailModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedStaff(null);
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
    if (selectedStaff) {
      try {
        await deleteStaff.mutateAsync(selectedStaff.id);
        setIsDeleteConfirmOpen(false);
        handleCloseDetailModal();
      } catch (error) {
        console.error("Error deleting staff:", error);
      }
    }
  };

  const personalData = selectedStaff?.hotel_staff_personal_data;
  const fullName = personalData
    ? `${personalData.first_name || ""} ${personalData.last_name || ""}`.trim()
    : "N/A";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Staff Management
        </h2>
        {permissions.canAddStaff && (
          <Button variant="primary" onClick={handleAddNew}>
            + Add Member
          </Button>
        )}
      </div>
      <p className="text-gray-500">
        Manage hotel staff members, their roles, and permissions.
      </p>

      <StaffTable searchValue={searchValue} onRowClick={handleRowClick} />

      {/* Add New Staff Modal */}
      <StaffModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        mode="create"
      />

      {/* Staff Detail/Edit Modal */}
      <StaffModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        staff={selectedStaff}
        mode={modalMode}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={
          selectedStaff ? permissions.canEditStaff(selectedStaff.id) : false
        }
        canDelete={
          selectedStaff ? permissions.canDeleteStaff(selectedStaff.id) : false
        }
        canEditEmployment={
          !permissions.canOnlyEditPersonalData(selectedStaff?.id || "")
        }
        isOwnProfile={selectedStaff?.id === permissions.currentUserId}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${fullName}? This action cannot be undone and will remove the staff member from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteStaff.isPending}
      />
    </div>
  );
}
