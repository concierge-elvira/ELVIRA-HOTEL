import React, { useState, useMemo } from "react";
import { useGuestAuth, useGuestCart } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";
import { SearchFilterBar } from "../shared/search-filter";
import { CartButton } from "../../../components/guest/shared/cart";
import { MenuCategorySection } from "../shared/cards/menu-item";
import { useAnnouncements } from "../../../hooks/announcements/useAnnouncements";
import { useGuestProducts } from "../../../hooks/guest-management/shop";
import {
  ProductDetailBottomSheet,
  type ProductDetailData,
} from "../shared/modals";

interface GuestShopProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
  onClockClick?: () => void;
}

export const GuestShop: React.FC<GuestShopProps> = ({
  onNavigate,
  currentPath = "/guest/shop",
  onClockClick,
}) => {
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

  const { data: announcements } = useAnnouncements(
    guestSession?.guestData?.hotel_id
  );

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

  const { guestData, hotelData } = guestSession;

  // Format announcements for ticker
  const activeAnnouncements =
    announcements
      ?.filter((a) => a.is_active)
      .map((a) => ({
        id: a.id,
        message: `${a.title} • ${a.description}`,
      })) || [];

  const handleProductClick = (itemId: string) => {
    const product = products.find((p) => p.id === itemId);
    if (product) {
      setSelectedProduct(product);
      setIsDetailOpen(true);
    }
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      console.log("Adding to cart:", product.name);
      addToShopCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.image_url || undefined,
      });
      console.log("Cart count after add:", shopCartCount + 1);
    }
    setIsDetailOpen(false);
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
        price: product.price,
        quantity: 1,
        imageUrl: product.image_url || undefined,
      });
      console.log("Item added to shop cart");
    }
  };

  return (
    <GuestPageLayout
      guestName={guestData.guest_name}
      hotelName={hotelData.name}
      roomNumber={guestData.room_number}
      guestId={guestData.id}
      dndStatus={guestData.dnd_status}
      announcements={activeAnnouncements}
      currentPath={currentPath}
      onNavigate={onNavigate}
      onClockClick={onClockClick}
      headerSlot={
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => {
            // Handle filter click
            console.log("Filter clicked");
          }}
          placeholder="Search products..."
          cartButton={
            <CartButton
              itemCount={shopCartCount}
              onClick={() => console.log("View cart")}
            />
          }
        />
      }
    >
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
        onAddToCart={handleAddToCart}
      />
    </GuestPageLayout>
  );
};
