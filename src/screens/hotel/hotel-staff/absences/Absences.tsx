import { useState } from "react";
import { Button, ConfirmationModal } from "../../../../components/ui";
import { AbsencesTable, AbsenceModal } from "./components";
import type { AbsenceWithStaff } from "./components/modals";
import { useDeleteAbsenceRequest } from "../../../../hooks/hotel-staff";
import { useCurrentUserHotel } from "../../../../hooks";

interface AbsencesProps {
  searchValue: string;
}

export function Absences({ searchValue }: AbsencesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedAbsence, setSelectedAbsence] =
    useState<AbsenceWithStaff | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const deleteAbsenceRequest = useDeleteAbsenceRequest();
  const { data: currentUser } = useCurrentUserHotel();

  const isHotelStaff = currentUser?.position === "Hotel Staff";
  const isOwnAbsence = selectedAbsence?.staff_id === currentUser?.staffId;

  // Log for debugging
  console.log("[Absences] Current user:", {
    staffId: currentUser?.staffId,
    position: currentUser?.position,
    isHotelStaff,
  });

  console.log("[Absences] Selected absence:", {
    absenceId: selectedAbsence?.id,
    absenceStaffId: selectedAbsence?.staff_id,
    isOwnAbsence,
  });

  // Hotel Staff can only edit/delete their own absences
  // They CANNOT edit the status field (only managers can approve/reject)
  const canEdit = !isHotelStaff || isOwnAbsence;
  const canDelete = !isHotelStaff || isOwnAbsence;

  console.log("[Absences] Permissions:", {
    canEdit,
    canDelete,
    isHotelStaff,
    isOwnAbsence,
  });

  const handleAddNew = () => {
    setSelectedAbsence(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleRowClick = (absence: AbsenceWithStaff) => {
    setSelectedAbsence(absence);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    if (canEdit) {
      setModalMode("edit");
    }
  };

  const handleDelete = () => {
    if (canDelete) {
      setIsModalOpen(false);
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedAbsence) {
      try {
        await deleteAbsenceRequest.mutateAsync(selectedAbsence.id);
        setIsDeleteConfirmOpen(false);
        setIsModalOpen(false);
        setSelectedAbsence(null);
      } catch (error) {
        console.error("Error deleting absence request:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAbsence(null);
    setModalMode("create");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Absences</h2>
        <Button variant="primary" onClick={handleAddNew}>
          + Add Request
        </Button>
      </div>
      <p className="text-gray-500">
        Track staff absences, leaves, and time-off requests.
      </p>

      <AbsencesTable
        searchValue={searchValue}
        onRowClick={handleRowClick}
        filterByStaffId={isHotelStaff ? currentUser?.staffId : undefined}
        canEditStatus={!isHotelStaff} // Hotel Staff cannot edit status
      />

      {/* Unified Absence Modal */}
      <AbsenceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        absence={selectedAbsence}
        mode={modalMode}
        onEdit={canEdit ? handleEdit : undefined}
        onDelete={canDelete ? handleDelete : undefined}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Absence Request"
        message="Are you sure you want to delete this absence request? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
