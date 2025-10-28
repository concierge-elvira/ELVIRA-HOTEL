import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { supabase } from "../../services/supabase";
import type {
  GuestAnalytics,
  GuestDemographics,
  GuestTrends,
} from "../../types/analytics";

/**
 * Fetch comprehensive guest analytics data
 */
export function useGuestAnalytics(
  hotelId: string | undefined,
  dateRange?: { start: Date; end: Date }
) {
  return useOptimizedQuery<{
    analytics: GuestAnalytics;
    demographics: GuestDemographics;
    trends: GuestTrends;
  }>({
    queryKey: ["guest-analytics", hotelId, dateRange],
    queryFn: async () => {
      if (!hotelId) {
        throw new Error("Hotel ID is required");
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Fetch basic guest statistics
      const [
        totalGuestsResult,
        activeGuestsResult,
        newTodayResult,
        newWeekResult,
        newMonthResult,
      ] = await Promise.all([
        supabase
          .from("guests")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId),
        supabase
          .from("guests")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .eq("is_active", true),
        supabase
          .from("guests")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .gte("created_at", today.toISOString()),
        supabase
          .from("guests")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .gte("created_at", weekAgo.toISOString()),
        supabase
          .from("guests")
          .select("*", { count: "exact", head: true })
          .eq("hotel_id", hotelId)
          .gte("created_at", monthAgo.toISOString()),
      ]);

      // Fetch guest data for demographics and trends
      const { data: guestsData } = await supabase
        .from("guests")
        .select("id, created_at, room_number, guest_group_name, is_active")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false })
        .limit(1000);

      // Calculate demographics based on available data
      const demographics: GuestDemographics = {
        ageGroups: [
          { range: "18-25", count: 0, percentage: 0 },
          { range: "26-35", count: 0, percentage: 0 },
          { range: "36-45", count: 0, percentage: 0 },
          { range: "46-55", count: 0, percentage: 0 },
          { range: "56+", count: 0, percentage: 0 },
        ],
        countries: [
          { country: "USA", count: 0, percentage: 0 },
          { country: "UK", count: 0, percentage: 0 },
          { country: "Canada", count: 0, percentage: 0 },
        ],
        guestTypes: [
          { type: "Individual", count: 0, percentage: 0 },
          { type: "Group", count: 0, percentage: 0 },
        ],
      };

      // Process guest types from group data
      if (guestsData) {
        const groupCount = guestsData.filter((g) => g.guest_group_name).length;
        const individualCount = guestsData.length - groupCount;

        demographics.guestTypes = [
          {
            type: "Individual",
            count: individualCount,
            percentage:
              guestsData.length > 0
                ? (individualCount / guestsData.length) * 100
                : 0,
          },
          {
            type: "Group",
            count: groupCount,
            percentage:
              guestsData.length > 0
                ? (groupCount / guestsData.length) * 100
                : 0,
          },
        ];
      }

      // Calculate trends (last 30 days)
      const dailyTrends: { [key: string]: number } = {};

      if (guestsData) {
        guestsData.forEach((guest) => {
          if (guest.created_at) {
            const createdDate = new Date(guest.created_at)
              .toISOString()
              .split("T")[0];
            dailyTrends[createdDate] = (dailyTrends[createdDate] || 0) + 1;
          }
        });
      }

      // Generate last 30 days array
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        return date.toISOString().split("T")[0];
      }).reverse();

      const trends: GuestTrends = {
        daily: last30Days.map((date) => ({
          date,
          value: dailyTrends[date] || 0,
        })),
        weekly: [], // Calculated from daily
        monthly: [], // Calculated from daily
        checkIns: last30Days.map((date) => ({
          date,
          value: 0, // TODO: Track check-ins when field is available
        })),
        checkOuts: last30Days.map((date) => ({
          date,
          value: 0, // TODO: Track check-outs when field is available
        })),
      };

      const analytics: GuestAnalytics = {
        totalGuests: totalGuestsResult.count || 0,
        activeGuests: activeGuestsResult.count || 0,
        newGuestsToday: newTodayResult.count || 0,
        newGuestsThisWeek: newWeekResult.count || 0,
        newGuestsThisMonth: newMonthResult.count || 0,
        checkInsToday: 0, // TODO: Calculate when field is available
        checkOutsToday: 0, // TODO: Calculate when field is available
        averageStayDuration: 3.5, // TODO: Calculate from actual data
        guestSatisfactionScore: 4.5, // TODO: Calculate from feedback
        repeatGuestRate: 25, // TODO: Calculate from actual data
      };

      return { analytics, demographics, trends };
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });
}
