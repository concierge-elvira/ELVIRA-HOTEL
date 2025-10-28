import { useState } from "react";
import {
  RecommendedPlacesTable,
  RecommendedPlaceModal,
  type RecommendedPlaceFormData,
} from "./components";
import { Button, ConfirmationModal } from "../../../../components/ui";
import { useHotelContext } from "../../../../hooks/useHotelContext";
import {
  useCreateHotelRecommendedPlace,
  useUpdateHotelRecommendedPlace,
  useDeleteHotelRecommendedPlace,
} from "../../../../hooks/qna";
import { supabase } from "../../../../services/supabase";
import type { Database } from "../../../../types/database";

type HotelRecommendedPlaceRow =
  Database["public"]["Tables"]["hotel_recommended_places"]["Row"];

interface RecommendedPlacesProps {
  searchValue: string;
}

type ModalMode = "create" | "edit" | "view";

export function RecommendedPlaces({ searchValue }: RecommendedPlacesProps) {
  const { hotelId } = useHotelContext();
  const createPlace = useCreateHotelRecommendedPlace();
  const updatePlace = useUpdateHotelRecommendedPlace();
  const deletePlace = useDeleteHotelRecommendedPlace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedPlace, setSelectedPlace] =
    useState<HotelRecommendedPlaceRow | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [placeToDelete, setPlaceToDelete] =
    useState<HotelRecommendedPlaceRow | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedPlace(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (place: HotelRecommendedPlaceRow) => {
    setSelectedPlace(place);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = () => {
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  const handleDelete = () => {
    if (selectedPlace) {
      setPlaceToDelete(selectedPlace);
      setIsModalOpen(false);
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!placeToDelete || !hotelId) return;

    try {
      await deletePlace.mutateAsync({
        id: placeToDelete.id,
        hotelId,
      });
      setIsDeleteConfirmOpen(false);
      setPlaceToDelete(null);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleSubmit = async (data: RecommendedPlaceFormData) => {
    if (!hotelId) return;

    // Get current user ID for created_by field
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Convert imageUrls array to JSON string for storage
    const imageUrlJson =
      data.imageUrls.length > 0 ? JSON.stringify(data.imageUrls) : null;

    if (modalMode === "create") {
      await createPlace.mutateAsync({
        hotel_id: hotelId,
        place_name: data.placeName,
        address: data.address,
        description: data.description || null,
        latitud: data.latitude,
        longitud: data.longitude,
        is_active: data.isActive,
        created_by: user?.id || null,
        image_url: imageUrlJson,
      });
    } else if (modalMode === "edit" && selectedPlace) {
      await updatePlace.mutateAsync({
        id: selectedPlace.id,
        updates: {
          place_name: data.placeName,
          address: data.address,
          description: data.description || null,
          latitud: data.latitude,
          longitud: data.longitude,
          is_active: data.isActive,
          image_url: imageUrlJson,
        },
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Recommended Places
          </h2>
          <p className="text-gray-500">
            Manage recommended places and attractions for hotel guests.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenCreateModal}>
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Place
        </Button>
      </div>

      <RecommendedPlacesTable
        searchValue={searchValue}
        onRowClick={handleOpenViewModal}
      />

      <RecommendedPlaceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        place={selectedPlace}
        onSubmit={handleSubmit}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Recommended Place"
        message={`Are you sure you want to delete "${placeToDelete?.place_name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
