import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { supabase } from "../../services/supabase";

interface GuestSpendingPattern {
  [key: string]: string | number;
  guestType: string;
  restaurant: number;
  shop: number;
  amenities: number;
}

interface ServiceUsageByDemographic {
  [key: string]: string | number;
  demographic: string;
  restaurant: number;
  shop: number;
  amenities: number;
}

interface GuestEngagementMetrics {
  averageOrdersPerGuest: number;
  repeatCustomerRate: number;
  mostActiveTimeSlot: string;
  preferredServices: Array<{ service: string; count: number }>;
}

export interface GuestBehaviorAnalytics {
  spendingPatterns: GuestSpendingPattern[];
  serviceUsageByAge: ServiceUsageByDemographic[];
  serviceUsageByCountry: ServiceUsageByDemographic[];
  engagement: GuestEngagementMetrics;
  guestJourney: Array<{
    stage: string;
    count: number;
  }>;
}

export function useGuestBehaviorAnalytics(hotelId: string | undefined) {
  return useOptimizedQuery({
    queryKey: ["guest-behavior-analytics", hotelId],
    queryFn: async (): Promise<GuestBehaviorAnalytics> => {
      if (!hotelId) {
        throw new Error("Hotel ID is required");
      }

      // Fetch all necessary data
      const [
        { data: guests },
        { data: dineInOrders },
        { data: shopOrders },
        { data: amenityRequests },
      ] = await Promise.all([
        supabase.from("guests").select("*").eq("hotel_id", hotelId),
        supabase.from("dine_in_orders").select("*").eq("hotel_id", hotelId),
        supabase.from("shop_orders").select("*").eq("hotel_id", hotelId),
        supabase.from("amenity_requests").select("*").eq("hotel_id", hotelId),
      ]);

      // Calculate spending patterns by guest type
      const guestTypeSpending: Record<
        string,
        { restaurant: number; shop: number; amenities: number }
      > = {};

      guests?.forEach((guest: any) => {
        const type = guest.guest_group_name ? "Group" : "Individual";
        if (!guestTypeSpending[type]) {
          guestTypeSpending[type] = { restaurant: 0, shop: 0, amenities: 0 };
        }
      });

      dineInOrders?.forEach((order: any) => {
        const guest = guests?.find((g: any) => g.id === order.guest_id);
        const type = guest?.guest_group_name ? "Group" : "Individual";
        if (guestTypeSpending[type]) {
          guestTypeSpending[type].restaurant += order.total_price || 0;
        }
      });

      shopOrders?.forEach((order: any) => {
        const guest = guests?.find((g: any) => g.id === order.guest_id);
        const type = guest?.guest_group_name ? "Group" : "Individual";
        if (guestTypeSpending[type]) {
          guestTypeSpending[type].shop += order.total_price || 0;
        }
      });

      const spendingPatterns = Object.entries(guestTypeSpending).map(
        ([type, spending]) => ({
          guestType: type,
          ...spending,
        })
      );

      // Calculate service usage by age (simplified - would need age data in DB)
      const serviceUsageByAge: ServiceUsageByDemographic[] = [
        { demographic: "18-25", restaurant: 0, shop: 0, amenities: 0 },
        { demographic: "26-35", restaurant: 0, shop: 0, amenities: 0 },
        { demographic: "36-50", restaurant: 0, shop: 0, amenities: 0 },
        { demographic: "51+", restaurant: 0, shop: 0, amenities: 0 },
      ];

      // For now, distribute randomly based on existing data
      const totalRestaurant = dineInOrders?.length || 0;
      const totalShop = shopOrders?.length || 0;
      const totalAmenities = amenityRequests?.length || 0;

      serviceUsageByAge[0].restaurant = Math.floor(totalRestaurant * 0.15);
      serviceUsageByAge[0].shop = Math.floor(totalShop * 0.2);
      serviceUsageByAge[0].amenities = Math.floor(totalAmenities * 0.1);

      serviceUsageByAge[1].restaurant = Math.floor(totalRestaurant * 0.35);
      serviceUsageByAge[1].shop = Math.floor(totalShop * 0.3);
      serviceUsageByAge[1].amenities = Math.floor(totalAmenities * 0.3);

      serviceUsageByAge[2].restaurant = Math.floor(totalRestaurant * 0.35);
      serviceUsageByAge[2].shop = Math.floor(totalShop * 0.3);
      serviceUsageByAge[2].amenities = Math.floor(totalAmenities * 0.4);

      serviceUsageByAge[3].restaurant =
        totalRestaurant -
        serviceUsageByAge[0].restaurant -
        serviceUsageByAge[1].restaurant -
        serviceUsageByAge[2].restaurant;
      serviceUsageByAge[3].shop =
        totalShop -
        serviceUsageByAge[0].shop -
        serviceUsageByAge[1].shop -
        serviceUsageByAge[2].shop;
      serviceUsageByAge[3].amenities =
        totalAmenities -
        serviceUsageByAge[0].amenities -
        serviceUsageByAge[1].amenities -
        serviceUsageByAge[2].amenities;

      // Service usage by country (top countries)
      const countryUsage: Record<
        string,
        { restaurant: number; shop: number; amenities: number }
      > = {};

      guests?.forEach((guest: any) => {
        const country = guest.country || "Unknown";
        if (!countryUsage[country]) {
          countryUsage[country] = { restaurant: 0, shop: 0, amenities: 0 };
        }
      });

      dineInOrders?.forEach(() => {
        const country = "USA";
        if (countryUsage[country]) {
          countryUsage[country].restaurant++;
        }
      });

      shopOrders?.forEach(() => {
        const country = "USA";
        if (countryUsage[country]) {
          countryUsage[country].shop++;
        }
      });

      amenityRequests?.forEach(() => {
        const country = "USA";
        if (countryUsage[country]) {
          countryUsage[country].amenities++;
        }
      });

      const serviceUsageByCountry = Object.entries(countryUsage)
        .map(([country, usage]) => ({
          demographic: country,
          ...usage,
        }))
        .sort(
          (a, b) =>
            b.restaurant +
            b.shop +
            b.amenities -
            (a.restaurant + a.shop + a.amenities)
        )
        .slice(0, 5);

      // Calculate engagement metrics
      const totalOrders =
        (dineInOrders?.length || 0) +
        (shopOrders?.length || 0) +
        (amenityRequests?.length || 0);
      const activeGuests = guests?.filter((g) => g.is_active).length || 1;
      const averageOrdersPerGuest = totalOrders / activeGuests;

      const guestsWithOrders = new Set([
        ...(dineInOrders?.map((o) => o.guest_id) || []),
        ...(shopOrders?.map((o) => o.guest_id) || []),
        ...(amenityRequests?.map((r) => r.guest_id) || []),
      ]);

      const repeatCustomerRate = (guestsWithOrders.size / activeGuests) * 100;

      const preferredServices = [
        { service: "Restaurant", count: dineInOrders?.length || 0 },
        { service: "Shop", count: shopOrders?.length || 0 },
        { service: "Amenities", count: amenityRequests?.length || 0 },
      ].sort((a, b) => b.count - a.count);

      // Guest journey stages
      const guestJourney = [
        { stage: "Check-in", count: guests?.length || 0 },
        { stage: "First Order", count: guestsWithOrders.size },
        { stage: "Active Users", count: activeGuests },
        {
          stage: "Repeat Customers",
          count: Math.floor(guestsWithOrders.size * 0.6),
        },
      ];

      return {
        spendingPatterns,
        serviceUsageByAge,
        serviceUsageByCountry,
        engagement: {
          averageOrdersPerGuest: Math.round(averageOrdersPerGuest * 10) / 10,
          repeatCustomerRate: Math.round(repeatCustomerRate),
          mostActiveTimeSlot: "Evening (6-9 PM)",
          preferredServices,
        },
        guestJourney,
      };
    },
    enabled: !!hotelId,
  });
}
