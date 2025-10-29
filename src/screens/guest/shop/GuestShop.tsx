import React, { useState, useMemo } from "react";
import { useGuestAuth, useGuestCart } from "../../../contexts/guest";
import { GuestShopHeader } from "./GuestShopHeader";
import { MenuCategorySection } from "../shared/cards/menu-item";
import { useGuestProducts } from "../../../hooks/guest-management/shop";
import {
  ProductDetailBottomSheet,
  type ProductDetailData,
} from "../shared/modals";
import { ShopCartBottomSheet } from "../cart";

interface GuestShopProps {
  onNavigate?: (path: string) => void;
}

export const GuestShop: React.FC<GuestShopProps> = ({ onNavigate }) => {
  const { guestSession } = useGuestAuth();
  const {
    shopCartCount,
    addToShopCart,
    incrementShopItem,
    decrementShopItem,
    getShopItemQuantity,
  } = useGuestCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDetailData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch active products for the hotel
  const { data: products = [], isLoading } = useGuestProducts(
    guestSession?.guestData?.hotel_id
  );

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, typeof products> = {};

    products.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  }, [products]);

  // Filter by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return productsByCategory;
    }

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, typeof products> = {};

    Object.entries(productsByCategory).forEach(([category, items]) => {
      const filteredItems = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query)
      );

      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });

    return filtered;
  }, [productsByCategory, searchQuery]);

  if (!guestSession) {
    return null;
  }

  const handleProductClick = (itemId: string) => {
    const product = products.find((p) => p.id === itemId);
    if (product) {
      setSelectedProduct(product);
      setIsDetailOpen(true);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedProduct(null);
  };

  const handleAddItem = (itemId: string) => {
    const product = products.find((p) => p.id === itemId);
    if (product) {
      addToShopCart({
        id: product.id,
        name: product.name,
        description: product.description || undefined,
        price: product.price,
        quantity: 1,
        imageUrl: product.image_url || undefined,
      });
      console.log("Item added to shop cart");
    }
  };

  return (
    <>
      {/* Search Bar with Cart */}
      <GuestShopHeader
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={shopCartCount}
        onCartClick={() => setIsCartOpen(true)}
        onBackClick={() => onNavigate?.("/guest/home")}
      />

      {/* Product Categories */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : Object.keys(filteredCategories).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery
              ? "No products found matching your search."
              : "No products available at the moment."}
          </p>
        </div>
      ) : (
        Object.entries(filteredCategories).map(([category, items]) => (
          <MenuCategorySection
            key={category}
            categoryName={category}
            items={items.map((item) => ({
              id: item.id,
              title: item.name,
              description: item.description || "",
              price: item.price,
              imageUrl: item.image_url || undefined,
              isRecommended: item.recommended || false,
              quantity: getShopItemQuantity(item.id),
            }))}
            onCardClick={handleProductClick}
            onAddClick={handleAddItem}
            onIncrement={incrementShopItem}
            onDecrement={decrementShopItem}
          />
        ))
      )}

      {/* Product Detail Bottom Sheet */}
      <ProductDetailBottomSheet
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        product={selectedProduct}
      />

      {/* Shop Cart Bottom Sheet */}
      <ShopCartBottomSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};
