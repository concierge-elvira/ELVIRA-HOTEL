import { useState } from "react";
import {
  ProductsTable,
  ProductModal,
  type ProductFormData,
} from "./components";
import { ManagementPageHeader } from "../../../../components/shared";
import { ConfirmationModal } from "../../../../components/ui";
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../../../hooks/hotel-shop/products/useProducts";
import { useHotelId } from "../../../../hooks";
import { useAuth } from "../../../../hooks";
import type { Database } from "../../../../types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ModalMode = "create" | "edit" | "view";

interface ProductsProps {
  searchValue: string;
}

export function Products({ searchValue }: ProductsProps) {
  const hotelId = useHotelId();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(
    null
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductRow | null>(
    null
  );

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleAdd = () => {
    setSelectedProduct(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleView = (product: ProductRow) => {
    setSelectedProduct(product);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEditFromView = () => {
    setModalMode("edit");
  };

  const handleDelete = (product?: ProductRow) => {
    const itemToDelete = product || selectedProduct;
    if (itemToDelete) {
      setProductToDelete(itemToDelete);
      setIsModalOpen(false);
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete || !hotelId) return;

    try {
      await deleteProduct.mutateAsync({
        id: productToDelete.id,
        hotelId,
      });
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    if (!hotelId || !user?.id) return;

    if (modalMode === "create") {
      await createProduct.mutateAsync({
        name: data.name.trim(),
        price: parseFloat(data.price),
        category: data.category,
        description: data.description.trim() || null,
        image_url: data.imageUrl,
        recommended: data.recommended,
        mini_bar: data.miniBar,
        is_unlimited_stock: data.isUnlimitedStock,
        stock_quantity: data.isUnlimitedStock
          ? null
          : parseInt(data.stockQuantity),
        is_active: true,
        hotel_id: hotelId,
        created_by: user.id,
      });
    } else if (modalMode === "edit" && selectedProduct) {
      await updateProduct.mutateAsync({
        id: selectedProduct.id,
        updates: {
          name: data.name.trim(),
          price: parseFloat(data.price),
          category: data.category,
          description: data.description.trim() || null,
          image_url: data.imageUrl,
          recommended: data.recommended,
          mini_bar: data.miniBar,
          is_unlimited_stock: data.isUnlimitedStock,
          stock_quantity: data.isUnlimitedStock
            ? null
            : parseInt(data.stockQuantity),
        },
      });
    }
  };

  return (
    <div className="p-6">
      <ManagementPageHeader
        title="Products Management"
        description="Manage hotel shop products, inventory, and pricing."
        buttonLabel="Add Product"
        onButtonClick={handleAdd}
      />

      <ProductsTable searchValue={searchValue} onView={handleView} />

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        product={selectedProduct}
        onSubmit={handleSubmit}
        onEdit={modalMode === "view" ? handleEditFromView : undefined}
        onDelete={modalMode === "view" ? () => handleDelete() : undefined}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
