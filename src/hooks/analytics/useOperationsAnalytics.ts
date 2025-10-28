import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { supabase } from "../../services/supabase";
import type {
  OperationsAnalytics,
  OrderAnalytics,
  OrderTrends,
} from "../../types/analytics";

/**
 * Fetch comprehensive operations and order analytics
 */
export function useOperationsAnalytics(
  hotelId: string | undefined,
  dateRange?: { start: Date; end: Date }
) {
  return useOptimizedQuery<{
    operations: OperationsAnalytics;
    orders: OrderAnalytics;
    trends: OrderTrends;
  }>({
    queryKey: ["operations-analytics", hotelId, dateRange],
    queryFn: async () => {
      if (!hotelId) {
        throw new Error("Hotel ID is required");
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Fetch all orders
      const [dineInOrders, shopOrders, amenityRequests] = await Promise.all([
        supabase
          .from("dine_in_orders")
          .select("id, status, total_price, created_at, updated_at")
          .eq("hotel_id", hotelId),
        supabase
          .from("shop_orders")
          .select("id, status, total_price, created_at, updated_at")
          .eq("hotel_id", hotelId),
        supabase
          .from("amenity_requests")
          .select("id, status, created_at, updated_at")
          .eq("hotel_id", hotelId),
      ]);

      const allOrders = [
        ...(dineInOrders.data || []),
        ...(shopOrders.data || []),
      ];

      // Calculate operations metrics
      const totalOrders = allOrders.length;
      const pendingOrders = allOrders.filter(
        (o) => o.status === "pending"
      ).length;
      const completedOrders = allOrders.filter(
        (o) => o.status === "completed" || o.status === "delivered"
      ).length;
      const cancelledOrders = allOrders.filter(
        (o) => o.status === "cancelled"
      ).length;

      const totalRevenue = allOrders.reduce(
        (sum, o) => sum + (o.total_price || 0),
        0
      );
      const averageOrderValue =
        totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate average order time (in minutes)
      const orderTimes = allOrders
        .filter(
          (o) =>
            o.created_at &&
            o.updated_at &&
            (o.status === "completed" || o.status === "delivered")
        )
        .map((o) => {
          const created = new Date(o.created_at!).getTime();
          const updated = new Date(o.updated_at!).getTime();
          return (updated - created) / (1000 * 60); // Convert to minutes
        });

      const averageOrderTime =
        orderTimes.length > 0
          ? orderTimes.reduce((sum, time) => sum + time, 0) / orderTimes.length
          : 0;

      const orderCompletionRate =
        totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

      const operations: OperationsAnalytics = {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        averageOrderValue,
        averageOrderTime,
        orderCompletionRate,
      };

      // Detailed order analytics by type
      const orders: OrderAnalytics = {
        dineIn: {
          total: dineInOrders.data?.length || 0,
          pending:
            dineInOrders.data?.filter((o) => o.status === "pending").length ||
            0,
          completed:
            dineInOrders.data?.filter(
              (o) => o.status === "completed" || o.status === "delivered"
            ).length || 0,
          cancelled:
            dineInOrders.data?.filter((o) => o.status === "cancelled").length ||
            0,
          revenue:
            dineInOrders.data?.reduce(
              (sum, o) => sum + (o.total_price || 0),
              0
            ) || 0,
        },
        shop: {
          total: shopOrders.data?.length || 0,
          pending:
            shopOrders.data?.filter((o) => o.status === "pending").length || 0,
          completed:
            shopOrders.data?.filter(
              (o) => o.status === "completed" || o.status === "delivered"
            ).length || 0,
          cancelled:
            shopOrders.data?.filter((o) => o.status === "cancelled").length ||
            0,
          revenue:
            shopOrders.data?.reduce(
              (sum, o) => sum + (o.total_price || 0),
              0
            ) || 0,
        },
        amenities: {
          total: amenityRequests.data?.length || 0,
          pending:
            amenityRequests.data?.filter((o) => o.status === "pending")
              .length || 0,
          completed:
            amenityRequests.data?.filter((o) => o.status === "completed")
              .length || 0,
          cancelled:
            amenityRequests.data?.filter((o) => o.status === "cancelled")
              .length || 0,
          revenue: 0, // TODO: Add pricing to amenities
        },
      };

      // Calculate trends
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        return date.toISOString().split("T")[0];
      }).reverse();

      const dailyOrders: {
        [key: string]: { dineIn: number; shop: number; amenities: number };
      } = {};

      dineInOrders.data?.forEach((order) => {
        if (order.created_at) {
          const date = new Date(order.created_at).toISOString().split("T")[0];
          if (!dailyOrders[date]) {
            dailyOrders[date] = { dineIn: 0, shop: 0, amenities: 0 };
          }
          dailyOrders[date].dineIn++;
        }
      });

      shopOrders.data?.forEach((order) => {
        if (order.created_at) {
          const date = new Date(order.created_at).toISOString().split("T")[0];
          if (!dailyOrders[date]) {
            dailyOrders[date] = { dineIn: 0, shop: 0, amenities: 0 };
          }
          dailyOrders[date].shop++;
        }
      });

      amenityRequests.data?.forEach((req) => {
        if (req.created_at) {
          const date = new Date(req.created_at).toISOString().split("T")[0];
          if (!dailyOrders[date]) {
            dailyOrders[date] = { dineIn: 0, shop: 0, amenities: 0 };
          }
          dailyOrders[date].amenities++;
        }
      });

      const trends: OrderTrends = {
        daily: last30Days.map((date) => ({
          date,
          dineIn: dailyOrders[date]?.dineIn || 0,
          shop: dailyOrders[date]?.shop || 0,
          amenities: dailyOrders[date]?.amenities || 0,
        })),
        hourly: [], // TODO: Calculate hourly trends
        byType: [
          {
            type: "Restaurant",
            count: orders.dineIn.total,
            revenue: orders.dineIn.revenue,
          },
          {
            type: "Shop",
            count: orders.shop.total,
            revenue: orders.shop.revenue,
          },
          {
            type: "Amenities",
            count: orders.amenities.total,
            revenue: orders.amenities.revenue,
          },
        ],
      };

      return { operations, orders, trends };
    },
    enabled: !!hotelId,
    config: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 10 * 60 * 1000,
    },
  });
}
