/**
 * Guest Recommendations Hook
 *
 * Fetches active products, menu items, and amenities for guest recommendations
 */

import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { supabase } from "../../../services/supabase";
import type { RecommendedItem } from "../../../screens/guest/shared/recommended";
import type { Database } from "../../../types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];
type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
type Amenity = Database["public"]["Tables"]["amenities"]["Row"];

interface RecommendationsData {
  products: RecommendedItem[];
  menuItems: RecommendedItem[];
  amenities: RecommendedItem[];
  all: RecommendedItem[];
}

/**
 * Fetch active recommended items for a hotel
 * Returns products, menu items, and amenities that are active
 */
export function useGuestRecommendations(
  hotelId: string | undefined,
  limit: number = 10
) {
  return useOptimizedQuery<RecommendationsData>({
    queryKey: ["guest-recommendations", hotelId, limit],
    queryFn: async () => {
      if (!hotelId) {
        return { products: [], menuItems: [], amenities: [], all: [] };
      }

      // Fetch active products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .limit(limit);

      if (productsError) throw productsError;

      // Fetch active menu items
      const { data: menuItems, error: menuItemsError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .limit(limit);

      if (menuItemsError) throw menuItemsError;

      // Fetch active amenities
      const { data: amenities, error: amenitiesError } = await supabase
        .from("amenities")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .limit(limit);

      if (amenitiesError) throw amenitiesError;

      // Transform products to RecommendedItem format
      const productItems: RecommendedItem[] = (products || []).map(
        (p: Product) => ({
          id: p.id,
          title: p.name,
          description: p.description || "",
          price: p.price ? Number(p.price) : undefined,
          imageUrl: p.image_url || undefined,
          category: "Product Shop",
        })
      );

      // Transform menu items to RecommendedItem format
      const menuItemItems: RecommendedItem[] = (menuItems || []).map(
        (m: MenuItem) => ({
          id: m.id,
          title: m.name,
          description: m.description || "",
          price: m.price ? Number(m.price) : undefined,
          imageUrl: m.image_url || undefined,
          category: "Restaurant",
        })
      );

      // Transform amenities to RecommendedItem format
      const amenityItems: RecommendedItem[] = (amenities || []).map(
        (a: Amenity) => ({
          id: a.id,
          title: a.name,
          description: a.description || "",
          imageUrl: a.image_url || undefined,
          category: "Amenity",
        })
      );

      // Combine all items and shuffle
      const allItems = [...productItems, ...menuItemItems, ...amenityItems]
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);

      return {
        products: productItems,
        menuItems: menuItemItems,
        amenities: amenityItems,
        all: allItems,
      };
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });
}
