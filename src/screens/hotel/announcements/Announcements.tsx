import { useState } from "react";
import {
  AnnouncementsTable,
  AnnouncementModal,
  type AnnouncementFormData,
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
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "../../../hooks/announcements/useAnnouncements";
import { useHotelId, useAuth } from "../../../hooks";

type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];
type ModalMode = "create" | "edit" | "view";

export function Announcements() {
  const hotelId = useHotelId();
  const { user } = useAuth();

  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementRow | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<AnnouncementRow | null>(null);

  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const handleSearchClear = () => {
    setSearchValue("");
  };

  const handleAdd = () => {
    setSelectedAnnouncement(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleView = (announcement: AnnouncementRow) => {
    setSelectedAnnouncement(announcement);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleEditFromView = () => {
    setModalMode("edit");
  };

  const handleDelete = (announcement?: AnnouncementRow) => {
    const itemToDelete = announcement || selectedAnnouncement;
    if (itemToDelete) {
      setAnnouncementToDelete(itemToDelete);
      setIsModalOpen(false);
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!announcementToDelete || !hotelId) return;

    try {
      await deleteAnnouncement.mutateAsync({
        id: announcementToDelete.id,
        hotelId,
      });
      setIsDeleteConfirmOpen(false);
      setAnnouncementToDelete(null);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleSubmit = async (data: AnnouncementFormData) => {
    if (!hotelId || !user?.id) return;

    if (modalMode === "create") {
      await createAnnouncement.mutateAsync({
        title: data.title.trim(),
        description: data.description.trim(),
        is_active: data.isActive,
        hotel_id: hotelId,
        created_by: user.id,
      });
    } else if (modalMode === "edit" && selectedAnnouncement) {
      await updateAnnouncement.mutateAsync({
        id: selectedAnnouncement.id,
        updates: {
          title: data.title.trim(),
          description: data.description.trim(),
          is_active: data.isActive,
        },
      });
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Announcements"
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
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
        }
      />

      {/* Toolbar with Search and Actions */}
      <PageToolbar
        description="Create and manage hotel announcements for guests and staff."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search announcements by title or description..."
        onSearchClear={handleSearchClear}
        buttonLabel="Add Announcement"
        onButtonClick={handleAdd}
      />

      <TableContainer>
        <AnnouncementsTable searchValue={searchValue} onView={handleView} />
      </TableContainer>

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        announcement={selectedAnnouncement}
        onSubmit={handleSubmit}
        onEdit={modalMode === "view" ? handleEditFromView : undefined}
        onDelete={modalMode === "view" ? () => handleDelete() : undefined}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${announcementToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </PageContent>
  );
}
