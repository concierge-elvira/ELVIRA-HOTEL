import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";
import type { Database } from "../../../types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

const PRODUCTS_QUERY_KEY = "products";

/**
 * Fetch products for a specific hotel
 */
export function useProducts(hotelId: string | undefined) {
  const query = useOptimizedQuery<Product[]>({
    queryKey: [PRODUCTS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });

  // Real-time subscription
  useRealtimeSubscription({
    table: "products",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [PRODUCTS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch products for the current hotel
 */
export function useCurrentHotelProducts() {
  const [hotelId, setHotelId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getHotelId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (profile) {
          const { data: hotel } = await supabase
            .from("hotels")
            .select("id")
            .eq("owner_id", profile.id)
            .single();

          if (hotel) {
            setHotelId(hotel.id);
          }
        }
      }
    };

    getHotelId();
  }, []);

  return useProducts(hotelId);
}

/**
 * Fetch products by category
 */
export function useProductsByCategory(
  hotelId: string | undefined,
  category: string | undefined
) {
  return useOptimizedQuery<Product[]>({
    queryKey: [PRODUCTS_QUERY_KEY, hotelId, "category", category],
    queryFn: async () => {
      if (!hotelId || !category) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("category", category)
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId && !!category,
    config: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  });
}

/**
 * Create a new product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: ProductInsert) => {
      const { data, error } = await supabase
        .from("products")
        .insert(newProduct)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: Product) => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update an existing product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ProductUpdate;
    }) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: Product) => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete a product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data: { id: string; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY, data.hotelId],
      });
    },
  });
}

/**
 * Toggle product active status
 */
export function useToggleProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("products")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: Product) => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update product stock
 */
export function useUpdateProductStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      stockQuantity,
    }: {
      id: string;
      stockQuantity: number;
    }) => {
      const { data, error } = await supabase
        .from("products")
        .update({ stock_quantity: stockQuantity })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: Product) => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}
