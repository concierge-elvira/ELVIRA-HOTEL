import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";

interface HotelThirdPartyPlacesStats {
  total: number;
  approved: number;
  pending: number;
  recommended: number;
  by_category: {
    gastronomy: number;
    tours: number;
    wellness: number;
  };
}

interface HotelPlaceWithCategory {
  id: string;
  hotel_approved: boolean;
  hotel_recommended: boolean;
  thirdparty_place: {
    category: string;
  } | null;
}

/**
 * Fetch stats for hotel's third-party places
 * Shows total places in system, how many are approved/pending for this hotel
 * Optional category filter to get stats for specific category
 */
export function useHotelThirdPartyPlacesStats(
  hotelId: string | undefined,
  category?: string
) {
  return useQuery({
    queryKey: ["hotel-thirdparty-places", "stats", hotelId, category],
    queryFn: async (): Promise<HotelThirdPartyPlacesStats> => {
      if (!hotelId) {
        return {
          total: 0,
          approved: 0,
          pending: 0,
          recommended: 0,
          by_category: {
            gastronomy: 0,
            tours: 0,
            wellness: 0,
          },
        };
      }

      // Build query for total Elvira-approved places
      let totalQuery = supabase
        // @ts-expect-error - Table not yet in generated types
        .from("thirdparty_places")
        .select("id", { count: "exact", head: true })
        .eq("elvira_approved", true);

      // Filter by category if provided
      if (category) {
        totalQuery = totalQuery.eq("category", category);
      }

      const { count: totalCount } = await totalQuery;

      // Build query for hotel's places with category info
      const hotelQuery = supabase
        // @ts-expect-error - Table not yet in generated types
        .from("hotel_thirdparty_places")
        .select(
          `
          id,
          hotel_approved,
          hotel_recommended,
          thirdparty_place:thirdparty_places (
            category
          )
        `
        )
        .eq("hotel_id", hotelId);

      const { data: hotelPlaces } = await hotelQuery;

      const typedHotelPlaces = hotelPlaces as unknown as
        | HotelPlaceWithCategory[]
        | null;

      // Filter by category if provided
      let filteredPlaces = typedHotelPlaces || [];
      if (category) {
        filteredPlaces = filteredPlaces.filter(
          (p) => p.thirdparty_place?.category === category
        );
      }

      const approved = filteredPlaces.filter(
        (p) => p.hotel_approved === true
      ).length;
      const recommended = filteredPlaces.filter(
        (p) => p.hotel_approved === true && p.hotel_recommended === true
      ).length;
      const pending = (totalCount || 0) - approved;

      // Count by category (only if no category filter)
      const byCategory = {
        gastronomy: 0,
        tours: 0,
        wellness: 0,
      };

      if (!category) {
        const approvedPlaces = (typedHotelPlaces || []).filter(
          (p) => p.hotel_approved === true
        );
        approvedPlaces.forEach((place) => {
          const placeCategory = place.thirdparty_place?.category;
          if (placeCategory && placeCategory in byCategory) {
            byCategory[placeCategory as keyof typeof byCategory]++;
          }
        });
      }

      return {
        total: totalCount || 0,
        approved,
        pending,
        recommended,
        by_category: byCategory,
      };
    },
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
