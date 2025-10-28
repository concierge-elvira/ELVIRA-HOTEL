import { useState, useMemo } from "react";
import {
  MenuItemsTable,
  MenuItemModal,
  type MenuItemFormData,
} from "./components";
import { ManagementPageHeader } from "../../../../components/shared";
import { ConfirmationModal } from "../../../../components/ui";
import {
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "../../../../hooks/hotel-restaurant/menu-items/useMenuItems";
import { useRestaurants } from "../../../../hooks/hotel-restaurant/restaurants/useRestaurants";
import { useHotelContext } from "../../../../hooks/useHotelContext";
import { useAuth } from "../../../../hooks/useAuth";
import type { Database } from "../../../../types/database";
import type { ModalMode } from "./components/menu-item-modal";

type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

interface MenuItemsProps {
  searchValue: string;
}

export function MenuItems({ searchValue }: MenuItemsProps) {
  const { user } = useAuth();
  const { hotelId } = useHotelContext();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const { data: restaurants = [] } = useRestaurants(hotelId || undefined);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [menuItemToDelete, setMenuItemToDelete] = useState<MenuItem | null>(
    null
  );

  // Transform restaurants for the modal
  const restaurantOptions = useMemo(() => {
    return restaurants.map((r) => ({
      value: r.id,
      label: r.name,
    }));
  }, [restaurants]);

  const handleAdd = () => {
    setSelectedMenuItem(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleView = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMenuItem(null);
  };

  const handleEditFromView = () => {
    setModalMode("edit");
  };

  const handleDelete = (menuItem?: MenuItem) => {
    const itemToDelete = menuItem || selectedMenuItem;
    if (itemToDelete) {
      setMenuItemToDelete(itemToDelete);
      setIsModalOpen(false);
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!menuItemToDelete || !hotelId) return;

    try {
      await deleteMenuItem.mutateAsync({
        id: menuItemToDelete.id,
        hotelId,
      });
      setIsDeleteConfirmOpen(false);
      setMenuItemToDelete(null);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleSubmit = async (data: MenuItemFormData) => {
    if (!hotelId || !user?.id) return;

    if (modalMode === "create") {
      await createMenuItem.mutateAsync({
        name: data.name.trim(),
        price: parseFloat(data.price),
        category: data.category,
        description: data.description.trim() || null,
        image_url: data.imageUrl,
        hotel_recommended: data.hotelRecommended,
        is_active: true,
        restaurant_ids:
          data.restaurantIds.length > 0 ? data.restaurantIds : null,
        service_type: data.serviceTypes.length > 0 ? data.serviceTypes : null,
        special_type: data.dietaryInfo.length > 0 ? data.dietaryInfo : null,
        hotel_id: hotelId,
        created_by: user.id,
      });
    } else if (modalMode === "edit" && selectedMenuItem) {
      await updateMenuItem.mutateAsync({
        id: selectedMenuItem.id,
        updates: {
          name: data.name.trim(),
          price: parseFloat(data.price),
          category: data.category,
          description: data.description.trim() || null,
          image_url: data.imageUrl,
          hotel_recommended: data.hotelRecommended,
          restaurant_ids:
            data.restaurantIds.length > 0 ? data.restaurantIds : null,
          service_type: data.serviceTypes.length > 0 ? data.serviceTypes : null,
          special_type: data.dietaryInfo.length > 0 ? data.dietaryInfo : null,
        },
      });
    }
  };

  return (
    <div className="p-6">
      <ManagementPageHeader
        title="Menu Items"
        description="Manage restaurant menu items, prices, and availability."
        buttonLabel="Add Menu Item"
        onButtonClick={handleAdd}
      />

      <MenuItemsTable searchValue={searchValue} onView={handleView} />

      <MenuItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        menuItem={selectedMenuItem}
        onSubmit={handleSubmit}
        onEdit={modalMode === "view" ? handleEditFromView : undefined}
        onDelete={modalMode === "view" ? () => handleDelete() : undefined}
        restaurants={restaurantOptions}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${menuItemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleteMenuItem.isPending}
      />
    </div>
  );
}
