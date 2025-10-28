import { useState } from "react";
import {
  AmenitiesTable,
  AmenityModal,
  type AmenityFormData,
} from "./components";
import { ManagementPageHeader } from "../../../../components/shared";
import { ConfirmationModal } from "../../../../components/ui";
import {
  useCreateAmenity,
  useUpdateAmenity,
  useDeleteAmenity,
} from "../../../../hooks/amenities/amenities/useAmenities";
import { useHotelId } from "../../../../hooks";
import { useAuth } from "../../../../hooks";
import type { Database } from "../../../../types/database";

type AmenityRow = Database["public"]["Tables"]["amenities"]["Row"];
type ModalMode = "create" | "edit" | "view";

interface AmenitiesManagementProps {
  searchValue: string;
}

export function AmenitiesManagement({ searchValue }: AmenitiesManagementProps) {
  const hotelId = useHotelId();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedAmenity, setSelectedAmenity] = useState<AmenityRow | null>(
    null
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [amenityToDelete, setAmenityToDelete] = useState<AmenityRow | null>(
    null
  );

  const createAmenity = useCreateAmenity();
  const updateAmenity = useUpdateAmenity();
  const deleteAmenity = useDeleteAmenity();

  const handleAdd = () => {
    setSelectedAmenity(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleView = (amenity: AmenityRow) => {
    setSelectedAmenity(amenity);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAmenity(null);
  };

  const handleEditFromView = () => {
    setModalMode("edit");
  };

  const handleDelete = (amenity?: AmenityRow) => {
    const itemToDelete = amenity || selectedAmenity;
    if (itemToDelete) {
      setAmenityToDelete(itemToDelete);
      setIsModalOpen(false);
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!amenityToDelete || !hotelId) return;

    try {
      await deleteAmenity.mutateAsync({
        id: amenityToDelete.id,
        hotelId,
      });
      setIsDeleteConfirmOpen(false);
      setAmenityToDelete(null);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleSubmit = async (data: AmenityFormData) => {
    if (!hotelId || !user?.id) return;

    if (modalMode === "create") {
      await createAmenity.mutateAsync({
        name: data.name.trim(),
        price: parseFloat(data.price),
        category: data.category,
        description: data.description.trim() || null,
        image_url: data.imageUrl,
        recommended: data.recommended,
        is_active: true,
        hotel_id: hotelId,
        created_by: user.id,
      });
    } else if (modalMode === "edit" && selectedAmenity) {
      await updateAmenity.mutateAsync({
        id: selectedAmenity.id,
        updates: {
          name: data.name.trim(),
          price: parseFloat(data.price),
          category: data.category,
          description: data.description.trim() || null,
          image_url: data.imageUrl,
          recommended: data.recommended,
        },
      });
    }
  };

  return (
    <div className="p-6">
      <ManagementPageHeader
        title="Amenities Management"
        description="Manage hotel amenities, facilities, and services available to guests."
        buttonLabel="Add Amenity"
        onButtonClick={handleAdd}
      />

      <AmenitiesTable searchValue={searchValue} onView={handleView} />

      <AmenityModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        amenity={selectedAmenity}
        onSubmit={handleSubmit}
        onEdit={modalMode === "view" ? handleEditFromView : undefined}
        onDelete={modalMode === "view" ? () => handleDelete() : undefined}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Amenity"
        message={`Are you sure you want to delete "${amenityToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
