import { useState } from "react";
import {
  EmergencyContactsTable,
  EmergencyContactModal,
  type EmergencyContactFormData,
} from "./components";
import type { Database } from "../../../types/database";
import {
  PageContent,
  PageHeader,
  PageToolbar,
  TableContainer,
} from "../../../components/shared/page-layouts";
import { ConfirmationModal } from "../../../components/ui";
import {
  useCreateEmergencyContact,
  useUpdateEmergencyContact,
  useDeleteEmergencyContact,
} from "../../../hooks/emergency-contacts/useEmergencyContacts";
import { useHotelId, useAuth } from "../../../hooks";

type EmergencyContact =
  Database["public"]["Tables"]["emergency_contacts"]["Row"];
type ModalMode = "create" | "edit" | "view";

export function EmergencyContacts() {
  const hotelId = useHotelId();
  const { user } = useAuth();

  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedContact, setSelectedContact] =
    useState<EmergencyContact | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] =
    useState<EmergencyContact | null>(null);

  const createContact = useCreateEmergencyContact();
  const updateContact = useUpdateEmergencyContact();
  const deleteContact = useDeleteEmergencyContact();

  const handleSearchClear = () => {
    setSearchValue("");
  };

  const handleAdd = () => {
    setSelectedContact(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleView = (contact: EmergencyContact) => {
    setSelectedContact(contact);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleEditFromView = () => {
    setModalMode("edit");
  };

  const handleDelete = (contact?: EmergencyContact) => {
    const itemToDelete = contact || selectedContact;
    if (itemToDelete) {
      setContactToDelete(itemToDelete);
      setIsModalOpen(false);
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!contactToDelete || !hotelId) return;

    try {
      await deleteContact.mutateAsync({
        id: contactToDelete.id,
        hotelId,
      });
      setIsDeleteConfirmOpen(false);
      setContactToDelete(null);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleSubmit = async (data: EmergencyContactFormData) => {
    if (!hotelId || !user?.id) return;

    if (modalMode === "create") {
      await createContact.mutateAsync({
        contact_name: data.contactName.trim(),
        phone_number: data.phoneNumber.trim(),
        is_active: true,
        hotel_id: hotelId,
        created_by: user.id,
      });
    } else if (modalMode === "edit" && selectedContact) {
      await updateContact.mutateAsync({
        id: selectedContact.id,
        updates: {
          contact_name: data.contactName.trim(),
          phone_number: data.phoneNumber.trim(),
        },
      });
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Emergency Contacts"
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        }
      />

      {/* Toolbar with Search and Actions */}
      <PageToolbar
        description="Maintain a list of important emergency contacts for hotel operations."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search emergency contacts by name or phone..."
        onSearchClear={handleSearchClear}
        buttonLabel="Add Contact"
        onButtonClick={handleAdd}
      />

      <TableContainer>
        <EmergencyContactsTable searchValue={searchValue} onView={handleView} />
      </TableContainer>

      <EmergencyContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        contact={selectedContact}
        onSubmit={handleSubmit}
        onEdit={modalMode === "view" ? handleEditFromView : undefined}
        onDelete={modalMode === "view" ? () => handleDelete() : undefined}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Emergency Contact"
        message={`Are you sure you want to delete "${contactToDelete?.contact_name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </PageContent>
  );
}
