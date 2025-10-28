import { useState } from "react";
import {
  RestaurantsTable,
  RestaurantModal,
  type RestaurantFormData,
} from "./components";
import { ManagementPageHeader } from "../../../../components/shared";
import { ConfirmationModal } from "../../../../components/ui";
import {
  useCreateRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
} from "../../../../hooks/hotel-restaurant/restaurants/useRestaurants";
import { useHotelContext } from "../../../../hooks/useHotelContext";
import { useAuth } from "../../../../hooks/useAuth";
import type { Database } from "../../../../types/database";
import type { ModalMode } from "./components/restaurant-modal";

type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

interface RestaurantsProps {
  searchValue: string;
}

export function Restaurants({ searchValue }: RestaurantsProps) {
  const { user } = useAuth();
  const { hotelId } = useHotelContext();
  const createRestaurant = useCreateRestaurant();
  const updateRestaurant = useUpdateRestaurant();
  const deleteRestaurant = useDeleteRestaurant();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] =
    useState<Restaurant | null>(null);

  const handleAdd = () => {
    setSelectedRestaurant(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleView = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
  };

  const handleEditFromView = () => {
    setModalMode("edit");
  };

  const handleDelete = (restaurant?: Restaurant) => {
    const restaurantToDelete = restaurant || selectedRestaurant;
    if (restaurantToDelete) {
      setRestaurantToDelete(restaurantToDelete);
      setIsModalOpen(false);
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!restaurantToDelete || !hotelId) return;

    try {
      await deleteRestaurant.mutateAsync({
        id: restaurantToDelete.id,
        hotelId,
      });
      setIsDeleteConfirmOpen(false);
      setRestaurantToDelete(null);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleSubmit = async (data: RestaurantFormData) => {
    if (!hotelId || !user?.id) return;

    if (modalMode === "create") {
      await createRestaurant.mutateAsync({
        name: data.name.trim(),
        cuisine: data.cuisine.trim(),
        description: data.description.trim() || null,
        food_types: data.foodTypes.length > 0 ? data.foodTypes : null,
        hotel_id: hotelId,
        created_by: user.id,
        is_active: true,
      });
    } else if (modalMode === "edit" && selectedRestaurant) {
      await updateRestaurant.mutateAsync({
        id: selectedRestaurant.id,
        updates: {
          name: data.name.trim(),
          cuisine: data.cuisine.trim(),
          description: data.description.trim() || null,
          food_types: data.foodTypes.length > 0 ? data.foodTypes : null,
        },
      });
    }
  };

  return (
    <div className="p-6">
      <ManagementPageHeader
        title="Restaurant Management"
        description="Manage restaurant information, operating hours, and settings."
        buttonLabel="Add Restaurant"
        onButtonClick={handleAdd}
      />

      <RestaurantsTable
        searchValue={searchValue}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      <RestaurantModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        restaurant={selectedRestaurant}
        onSubmit={handleSubmit}
        onEdit={modalMode === "view" ? handleEditFromView : undefined}
        onDelete={modalMode === "view" ? () => handleDelete() : undefined}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Restaurant"
        message={`Are you sure you want to delete "${restaurantToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleteRestaurant.isPending}
      />
    </div>
  );
}
