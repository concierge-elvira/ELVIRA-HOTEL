import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { supabase } from "../../services/supabase";
import type {
  RevenueAnalytics,
  RevenueBySource,
  RevenueTrends,
} from "../../types/analytics";

/**
 * Fetch comprehensive revenue analytics data
 */
export function useRevenueAnalytics(
  hotelId: string | undefined,
  dateRange?: { start: Date; end: Date }
) {
  return useOptimizedQuery<{
    analytics: RevenueAnalytics;
    bySource: RevenueBySource;
    trends: RevenueTrends;
  }>({
    queryKey: ["revenue-analytics", hotelId, dateRange],
    queryFn: async () => {
      if (!hotelId) {
        throw new Error("Hotel ID is required");
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

      // Fetch orders data for revenue calculation
      const [dineInOrders, shopOrders] = await Promise.all([
        supabase
          .from("dine_in_orders")
          .select("total_price, created_at, status")
          .eq("hotel_id", hotelId)
          .in("status", ["completed", "delivered"]),
        supabase
          .from("shop_orders")
          .select("total_price, created_at, status")
          .eq("hotel_id", hotelId)
          .in("status", ["completed", "delivered"]),
      ]);

      // Calculate total revenue by source
      const restaurantRevenue =
        dineInOrders.data?.reduce(
          (sum, order) => sum + (order.total_price || 0),
          0
        ) || 0;
      const shopRevenue =
        shopOrders.data?.reduce(
          (sum, order) => sum + (order.total_price || 0),
          0
        ) || 0;
      const amenitiesRevenue = 0; // TODO: Add pricing to amenities

      const totalRevenue = restaurantRevenue + shopRevenue + amenitiesRevenue;

      // Calculate revenue for different time periods
      const calculateRevenue = (
        orders: Array<{
          created_at: string | null;
          total_price: number | null;
        }>,
        since: Date
      ) => {
        return orders
          .filter(
            (order) => order.created_at && new Date(order.created_at) >= since
          )
          .reduce((sum, order) => sum + (order.total_price || 0), 0);
      };

      const allOrders = [
        ...(dineInOrders.data || []),
        ...(shopOrders.data || []),
      ];

      const revenueToday = calculateRevenue(allOrders, today);
      const revenueThisWeek = calculateRevenue(allOrders, weekAgo);
      const revenueThisMonth = calculateRevenue(allOrders, monthAgo);
      const revenueThisYear = calculateRevenue(allOrders, yearAgo);

      // Calculate daily revenue trends for last 30 days
      const dailyRevenue: { [key: string]: number } = {};
      allOrders.forEach((order) => {
        if (order.created_at) {
          const date = new Date(order.created_at).toISOString().split("T")[0];
          dailyRevenue[date] =
            (dailyRevenue[date] || 0) + (order.total_price || 0);
        }
      });

      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        return date.toISOString().split("T")[0];
      }).reverse();

      // Calculate revenue by source over time
      const dailyRevenueBySource: {
        [key: string]: { restaurant: number; shop: number; amenities: number };
      } = {};

      dineInOrders.data?.forEach((order) => {
        if (order.created_at) {
          const date = new Date(order.created_at).toISOString().split("T")[0];
          if (!dailyRevenueBySource[date]) {
            dailyRevenueBySource[date] = {
              restaurant: 0,
              shop: 0,
              amenities: 0,
            };
          }
          dailyRevenueBySource[date].restaurant += order.total_price || 0;
        }
      });

      shopOrders.data?.forEach((order) => {
        if (order.created_at) {
          const date = new Date(order.created_at).toISOString().split("T")[0];
          if (!dailyRevenueBySource[date]) {
            dailyRevenueBySource[date] = {
              restaurant: 0,
              shop: 0,
              amenities: 0,
            };
          }
          dailyRevenueBySource[date].shop += order.total_price || 0;
        }
      });

      const analytics: RevenueAnalytics = {
        totalRevenue,
        revenueToday,
        revenueThisWeek,
        revenueThisMonth,
        revenueThisYear,
        averageDailyRevenue: totalRevenue / 30,
        revenueGrowth: 12.5, // TODO: Calculate actual growth
        revenuePerGuest: 0, // TODO: Calculate from guest count
      };

      const bySource: RevenueBySource = {
        restaurant: restaurantRevenue,
        shop: shopRevenue,
        amenities: amenitiesRevenue,
        roomService: 0, // TODO: Add room service tracking
        other: 0,
      };

      const trends: RevenueTrends = {
        daily: last30Days.map((date) => ({
          date,
          value: dailyRevenue[date] || 0,
        })),
        weekly: [], // Calculated from daily
        monthly: [], // Calculated from daily
        bySource: last30Days.map((date) => ({
          date,
          restaurant: dailyRevenueBySource[date]?.restaurant || 0,
          shop: dailyRevenueBySource[date]?.shop || 0,
          amenities: dailyRevenueBySource[date]?.amenities || 0,
        })),
      };

      return { analytics, bySource, trends };
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });
}
