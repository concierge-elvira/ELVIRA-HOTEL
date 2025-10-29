/**
 * Guest Cart Context
 *
 * Manages cart state for shop products, restaurant menu items, and amenities
 * Supports quantity tracking for products/menu items and simple selection for amenities
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

// Cart item types
export interface ShopCartItem {
  type: "product";
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface RestaurantCartItem {
  type: "menu_item";
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  serviceType?: string[]; // "Restaurant" or "Room Service"
  restaurantIds?: string[]; // The restaurants this item is available at
}

export interface AmenityCartItem {
  type: "amenity";
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export type CartItem = ShopCartItem | RestaurantCartItem | AmenityCartItem;

interface GuestCartContextType {
  // Shop cart
  shopCart: ShopCartItem[];
  addToShopCart: (item: Omit<ShopCartItem, "type">) => void;
  removeFromShopCart: (itemId: string) => void;
  updateShopCartQuantity: (itemId: string, quantity: number) => void;
  incrementShopItem: (itemId: string) => void;
  decrementShopItem: (itemId: string) => void;
  clearShopCart: () => void;
  shopCartCount: number;
  getShopItemQuantity: (itemId: string) => number;

  // Restaurant cart
  restaurantCart: RestaurantCartItem[];
  addToRestaurantCart: (item: Omit<RestaurantCartItem, "type">) => void;
  removeFromRestaurantCart: (itemId: string) => void;
  updateRestaurantCartQuantity: (itemId: string, quantity: number) => void;
  incrementRestaurantItem: (itemId: string) => void;
  decrementRestaurantItem: (itemId: string) => void;
  clearRestaurantCart: () => void;
  restaurantCartCount: number;
  getRestaurantItemQuantity: (itemId: string) => number;
  getRestaurantCartServiceType: () => string | null; // Get locked service type
  canAddToRestaurantCart: (serviceType?: string[]) => boolean; // Check if item can be added

  // Amenity cart
  amenityCart: AmenityCartItem[];
  addToAmenityCart: (item: Omit<AmenityCartItem, "type">) => void;
  removeFromAmenityCart: (itemId: string) => void;
  clearAmenityCart: () => void;
  amenityCartCount: number;
  isAmenityInCart: (itemId: string) => boolean;
}

const GuestCartContext = createContext<GuestCartContextType | undefined>(
  undefined
);

export const GuestCartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shopCart, setShopCart] = useState<ShopCartItem[]>([]);
  const [restaurantCart, setRestaurantCart] = useState<RestaurantCartItem[]>(
    []
  );
  const [amenityCart, setAmenityCart] = useState<AmenityCartItem[]>([]);

  // Shop cart methods
  const addToShopCart = useCallback((item: Omit<ShopCartItem, "type">) => {
    setShopCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;

        return updated;
      }
      const newCart = [...prev, { ...item, type: "product" as const }];

      return newCart;
    });
  }, []);

  const removeFromShopCart = useCallback((itemId: string) => {
    setShopCart((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateShopCartQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromShopCart(itemId);
        return;
      }
      setShopCart((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    },
    [removeFromShopCart]
  );

  const clearShopCart = useCallback(() => {
    setShopCart([]);
  }, []);

  const incrementShopItem = useCallback((itemId: string) => {
    setShopCart((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (!item) return prev;
      return prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      );
    });
  }, []);

  const decrementShopItem = useCallback((itemId: string) => {
    setShopCart((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (!item) return prev;
      if (item.quantity <= 1) {
        return prev.filter((i) => i.id !== itemId);
      }
      return prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  const getShopItemQuantity = useCallback(
    (itemId: string) => {
      const item = shopCart.find((i) => i.id === itemId);
      return item ? item.quantity : 0;
    },
    [shopCart]
  );

  const shopCartCount = useMemo(() => {
    const count = shopCart.reduce((sum, item) => sum + item.quantity, 0);

    return count;
  }, [shopCart]);

  // Restaurant cart methods
  const addToRestaurantCart = useCallback(
    (item: Omit<RestaurantCartItem, "type">) => {
      setRestaurantCart((prev) => {
        const existingIndex = prev.findIndex((i) => i.id === item.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex].quantity += item.quantity;

          return updated;
        }
        const newCart = [...prev, { ...item, type: "menu_item" as const }];

        return newCart;
      });
    },
    []
  );

  const removeFromRestaurantCart = useCallback((itemId: string) => {
    setRestaurantCart((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateRestaurantCartQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromRestaurantCart(itemId);
        return;
      }
      setRestaurantCart((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    },
    [removeFromRestaurantCart]
  );

  const clearRestaurantCart = useCallback(() => {
    setRestaurantCart([]);
  }, []);

  const incrementRestaurantItem = useCallback((itemId: string) => {
    setRestaurantCart((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (!item) return prev;
      return prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      );
    });
  }, []);

  const decrementRestaurantItem = useCallback((itemId: string) => {
    setRestaurantCart((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (!item) return prev;
      if (item.quantity <= 1) {
        return prev.filter((i) => i.id !== itemId);
      }
      return prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  const getRestaurantItemQuantity = useCallback(
    (itemId: string) => {
      const item = restaurantCart.find((i) => i.id === itemId);
      return item ? item.quantity : 0;
    },
    [restaurantCart]
  );

  const restaurantCartCount = useMemo(() => {
    const count = restaurantCart.reduce((sum, item) => sum + item.quantity, 0);

    return count;
  }, [restaurantCart]);

  // Get the locked service type from cart (first item's service type)
  const getRestaurantCartServiceType = useCallback(() => {
    if (restaurantCart.length === 0) return null;
    const firstItem = restaurantCart[0];
    // Return the first service type if available
    if (firstItem.serviceType && firstItem.serviceType.length > 0) {
      return firstItem.serviceType[0];
    }
    return null;
  }, [restaurantCart]);

  // Check if an item with given service type can be added to cart
  const canAddToRestaurantCart = useCallback(
    (serviceType?: string[]) => {
      // If cart is empty, any item can be added
      if (restaurantCart.length === 0) return true;

      // If the item has no service type, it can be added
      if (!serviceType || serviceType.length === 0) return true;

      // Get the locked service type from cart
      const lockedServiceType = getRestaurantCartServiceType();

      // If no locked service type, any item can be added
      if (!lockedServiceType) return true;

      // Check if the item's service types include the locked one
      return serviceType.includes(lockedServiceType);
    },
    [restaurantCart, getRestaurantCartServiceType]
  );

  // Amenity cart methods
  const addToAmenityCart = useCallback(
    (item: Omit<AmenityCartItem, "type">) => {
      setAmenityCart((prev) => {
        const exists = prev.some((i) => i.id === item.id);
        if (exists) {
          return prev;
        }
        const newCart = [...prev, { ...item, type: "amenity" as const }];

        return newCart;
      });
    },
    []
  );

  const removeFromAmenityCart = useCallback((itemId: string) => {
    setAmenityCart((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const clearAmenityCart = useCallback(() => {
    setAmenityCart([]);
  }, []);

  const isAmenityInCart = useCallback(
    (itemId: string) => {
      return amenityCart.some((item) => item.id === itemId);
    },
    [amenityCart]
  );

  const amenityCartCount = useMemo(() => {
    const count = amenityCart.length;

    return count;
  }, [amenityCart]);

  return (
    <GuestCartContext.Provider
      value={{
        shopCart,
        addToShopCart,
        removeFromShopCart,
        updateShopCartQuantity,
        incrementShopItem,
        decrementShopItem,
        clearShopCart,
        shopCartCount,
        getShopItemQuantity,
        restaurantCart,
        addToRestaurantCart,
        removeFromRestaurantCart,
        updateRestaurantCartQuantity,
        incrementRestaurantItem,
        decrementRestaurantItem,
        clearRestaurantCart,
        restaurantCartCount,
        getRestaurantItemQuantity,
        getRestaurantCartServiceType,
        canAddToRestaurantCart,
        amenityCart,
        addToAmenityCart,
        removeFromAmenityCart,
        clearAmenityCart,
        amenityCartCount,
        isAmenityInCart,
      }}
    >
      {children}
    </GuestCartContext.Provider>
  );
};

export const useGuestCart = () => {
  const context = useContext(GuestCartContext);
  if (!context) {
    throw new Error("useGuestCart must be used within GuestCartProvider");
  }
  return context;
};

export default GuestCartProvider;
