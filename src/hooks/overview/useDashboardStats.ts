import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useOptimizedQuery } from "../api/useOptimizedQuery";

const DASHBOARD_STATS_QUERY_KEY = "dashboard-stats";

export interface DashboardStats {
  // Guest statistics
  totalGuests: number;
  activeGuests: number;

  // Order statistics
  pendingDineInOrders: number;
  pendingShopOrders: number;
  totalDineInOrders: number;
  totalShopOrders: number;

  // Request statistics
  pendingAmenityRequests: number;
  totalAmenityRequests: number;

  // Staff statistics
  totalStaff: number;
  activeStaff: number;
  pendingTasks: number;
  pendingAbsenceRequests: number;

  // Chat statistics
  openConversations: number;
  unreadMessages: number;

  // Content statistics
  totalMenuItems: number;
  activeMenuItems: number;
  totalProducts: number;
  activeProducts: number;
  totalAnnouncements: number;
  activeAnnouncements: number;
}

/**
 * Fetch comprehensive dashboard statistics for a hotel
 */
export function useDashboardStats(hotelId: string | undefined) {
  return useOptimizedQuery<DashboardStats>({
    queryKey: [DASHBOARD_STATS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) {
        return {
          totalGuests: 0,
          activeGuests: 0,
          pendingDineInOrders: 0,
          pendingShopOrders: 0,
          totalDineInOrders: 0,
          totalShopOrders: 0,
          pendingAmenityRequests: 0,
          totalAmenityRequests: 0,
          totalStaff: 0,
          activeStaff: 0,
          pendingTasks: 0,
          pendingAbsenceRequests: 0,
          openConversations: 0,
          unreadMessages: 0,
          totalMenuItems: 0,
          activeMenuItems: 0,
          totalProducts: 0,
          activeProducts: 0,
          totalAnnouncements: 0,
          activeAnnouncements: 0,
        };
      }

      // Fetch all stats in parallel
      const [
        guestsResult,
        activeGuestsResult,
        pendingDineInOrdersResult,
        pendingShopOrdersResult,
        totalDineInOrdersResult,
        totalShopOrdersResult,
        pendingAmenityRequestsResult,
        totalAmenityRequestsResult,
        staffResult,
        activeStaffResult,
        pendingTasksResult,
        pendingAbsenceRequestsResult,
        openConversationsResult,
        unreadMessagesResult,
        menuItemsResult,
        activeMenuItemsResult,
        productsResult,
        activeProductsResult,
        announcementsResult,
        activeAnnouncementsResult,
      ] = await Promise.all([
        // Guests
        supabase
          .from("guests")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId),
        supabase
          .from("guests")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("is_active", true),

        // Orders
        supabase
          .from("dine_in_orders")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("status", "pending"),
        supabase
          .from("shop_orders")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("status", "pending"),
        supabase
          .from("dine_in_orders")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId),
        supabase
          .from("shop_orders")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId),

        // Amenity requests
        supabase
          .from("amenity_requests")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("status", "pending"),
        supabase
          .from("amenity_requests")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId),

        // Staff
        supabase
          .from("hotel_staff")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId),
        supabase
          .from("hotel_staff")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("status", "active"),
        supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("status", "pending"),
        supabase
          .from("absence_requests")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("status", "pending"),

        // Conversations
        supabase
          .from("guest_conversation")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("status", "open"),
        supabase
          .from("guest_messages")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("is_read", false)
          .eq("sender_type", "guest"),

        // Content
        supabase
          .from("menu_items")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId),
        supabase
          .from("menu_items")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("is_active", true),
        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId),
        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("is_active", true),
        supabase
          .from("announcements")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId),
        supabase
          .from("announcements")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("is_active", true),
      ]);

      return {
        totalGuests: guestsResult.count || 0,
        activeGuests: activeGuestsResult.count || 0,
        pendingDineInOrders: pendingDineInOrdersResult.count || 0,
        pendingShopOrders: pendingShopOrdersResult.count || 0,
        totalDineInOrders: totalDineInOrdersResult.count || 0,
        totalShopOrders: totalShopOrdersResult.count || 0,
        pendingAmenityRequests: pendingAmenityRequestsResult.count || 0,
        totalAmenityRequests: totalAmenityRequestsResult.count || 0,
        totalStaff: staffResult.count || 0,
        activeStaff: activeStaffResult.count || 0,
        pendingTasks: pendingTasksResult.count || 0,
        pendingAbsenceRequests: pendingAbsenceRequestsResult.count || 0,
        openConversations: openConversationsResult.count || 0,
        unreadMessages: unreadMessagesResult.count || 0,
        totalMenuItems: menuItemsResult.count || 0,
        activeMenuItems: activeMenuItemsResult.count || 0,
        totalProducts: productsResult.count || 0,
        activeProducts: activeProductsResult.count || 0,
        totalAnnouncements: announcementsResult.count || 0,
        activeAnnouncements: activeAnnouncementsResult.count || 0,
      };
    },
    enabled: !!hotelId,
    config: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    },
  });
}

/**
 * Fetch dashboard stats for the current hotel
 */
export function useCurrentHotelDashboardStats() {
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

  return useDashboardStats(hotelId);
}
