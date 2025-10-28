import { useState } from "react";

interface UseItemTableModalsReturn<T> {
  // Detail Modal
  selectedItem: T | null;
  isDetailModalOpen: boolean;
  openDetailModal: (item: T) => void;
  closeDetailModal: () => void;

  // Edit Modal
  itemToEdit: T | null;
  isEditModalOpen: boolean;
  openEditModal: (item: T) => void;
  closeEditModal: () => void;

  // Delete Confirmation
  itemToDelete: T | null;
  isDeleteConfirmOpen: boolean;
  openDeleteConfirm: (item: T) => void;
  closeDeleteConfirm: () => void;

  // Combined handlers for detail modal actions
  handleEdit: () => void;
  handleDelete: () => void;
}

/**
 * Shared hook for managing table modals (detail, edit, delete)
 * Used across Products, Menu Items, and Amenities tables
 */
export function useItemTableModals<T>(): UseItemTableModalsReturn<T> {
  // Detail modal state
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Edit modal state
  const [itemToEdit, setItemToEdit] = useState<T | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete confirmation state
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Detail modal handlers
  const openDetailModal = (item: T) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedItem(null);
  };

  // Edit modal handlers
  const openEditModal = (item: T) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setItemToEdit(null);
  };

  // Delete confirmation handlers
  const openDeleteConfirm = (item: T) => {
    setItemToDelete(item);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // Combined handlers for detail modal actions
  const handleEdit = () => {
    if (selectedItem) {
      setItemToEdit(selectedItem);
      setIsEditModalOpen(true);
      setIsDetailModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      setItemToDelete(selectedItem);
      setIsDeleteConfirmOpen(true);
      setIsDetailModalOpen(false);
    }
  };

  return {
    selectedItem,
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,

    itemToEdit,
    isEditModalOpen,
    openEditModal,
    closeEditModal,

    itemToDelete,
    isDeleteConfirmOpen,
    openDeleteConfirm,
    closeDeleteConfirm,

    handleEdit,
    handleDelete,
  };
}
