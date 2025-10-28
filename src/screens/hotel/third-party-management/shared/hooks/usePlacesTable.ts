import { useMemo, useState } from "react";
import {
  useApprovedThirdPartyPlaces,
  useHotelPlaces,
  useApproveHotelPlace,
  useRejectHotelPlace,
  useToggleHotelRecommended,
} from "../../../../../hooks/third-party-management";
import { useCurrentUserHotel } from "../../../../../hooks/useCurrentUserHotel";
import { filterPlacesByDistance } from "../../../../../utils/distance";

type Category = "gastronomy" | "tours" | "wellness";

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  formatted_address?: string;
  vicinity?: string;
  hotel_approved?: boolean;
  hotel_recommended?: boolean;
}

interface UsePlacesTableOptions {
  category: Category;
  searchValue?: string;
}

/**
 * Custom hook to handle all the logic for places tables
 * Shared across gastronomy, tours, and wellness tabs
 */
export function usePlacesTable({
  category,
  searchValue = "",
}: UsePlacesTableOptions) {
  // Get current hotel with location
  const { data: hotelInfo } = useCurrentUserHotel();
  const hotelId = hotelInfo?.hotelId || null;

  // Filter states
  const [maxDistance, setMaxDistance] = useState(999999); // Default: any distance
  const [priceLevel, setPriceLevel] = useState("all"); // Default: all price levels
  const [actionFilter, setActionFilter] = useState("all"); // Default: all actions

  // Sorting states
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Modal states
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Fetch Elvira-approved places
  const { data: places, isLoading } = useApprovedThirdPartyPlaces(category);

  // Fetch hotel's relationship with places
  const { data: hotelPlaces } = useHotelPlaces(hotelId || undefined, category);

  // Mutations for hotel actions
  const approvePlace = useApproveHotelPlace();
  const rejectPlace = useRejectHotelPlace();
  const toggleRecommended = useToggleHotelRecommended();

  // Create a map of place ID to hotel relationship status
  const hotelPlaceMap = useMemo(() => {
    const map = new Map();
    hotelPlaces?.forEach((hp: any) => {
      map.set(hp.thirdparty_place_id, {
        approved: hp.hotel_approved,
        recommended: hp.hotel_recommended,
      });
    });
    return map;
  }, [hotelPlaces]);

  // Filter and sort places
  const filteredPlaces = useMemo(() => {
    if (!places) return [];

    let filtered = places;

    // Apply distance filter if hotel has location
    if (
      hotelInfo?.hotel?.latitude &&
      hotelInfo?.hotel?.longitude &&
      maxDistance !== 999999
    ) {
      filtered = filterPlacesByDistance(
        filtered,
        hotelInfo.hotel.latitude,
        hotelInfo.hotel.longitude,
        maxDistance
      );
    }

    // Apply search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter((place) => {
        return (
          place.name.toLowerCase().includes(searchLower) ||
          place.formatted_address?.toLowerCase().includes(searchLower) ||
          place.vicinity?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Enrich places with hotel relationship status
    const enriched = filtered.map((place) => {
      const hotelStatus = hotelPlaceMap.get(place.id);
      return {
        ...place,
        hotel_approved: hotelStatus?.approved || false,
        hotel_recommended: hotelStatus?.recommended || false,
      };
    });

    // Apply price level filter
    let priceFiltered = enriched;
    if (priceLevel !== "all") {
      const targetPriceLevel = parseInt(priceLevel);
      priceFiltered = enriched.filter(
        (place: any) => place.price_level === targetPriceLevel
      );
    }

    // Apply action filter
    let actionFiltered = priceFiltered;
    if (actionFilter === "approved") {
      actionFiltered = priceFiltered.filter(
        (place: any) => place.hotel_approved === true
      );
    } else if (actionFilter === "pending") {
      actionFiltered = priceFiltered.filter(
        (place: any) => place.hotel_approved === false
      );
    } else if (actionFilter === "recommended") {
      actionFiltered = priceFiltered.filter(
        (place: any) => place.hotel_recommended === true
      );
    }

    // Apply sorting
    if (sortColumn) {
      actionFiltered.sort((a, b) => {
        let aValue = a[sortColumn as keyof typeof a];
        let bValue = b[sortColumn as keyof typeof b];

        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Convert to comparable values
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        // Compare
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return actionFiltered;
  }, [
    places,
    searchValue,
    hotelInfo?.hotel?.latitude,
    hotelInfo?.hotel?.longitude,
    maxDistance,
    hotelPlaceMap,
    priceLevel,
    actionFilter,
    sortColumn,
    sortDirection,
  ]);

  // Calculate statistics based on filtered places
  const statistics = useMemo(() => {
    const total = filteredPlaces.length;
    const approved = filteredPlaces.filter((p: any) => p.hotel_approved).length;
    const recommended = filteredPlaces.filter(
      (p: any) => p.hotel_recommended
    ).length;
    const pending = filteredPlaces.filter((p: any) => !p.hotel_approved).length;

    return { total, approved, recommended, pending };
  }, [filteredPlaces]);

  // Handlers
  const handleRowClick = (place: Place) => {
    setSelectedPlace(place);
    setIsDetailsModalOpen(true);
  };

  const handleApprove = async (placeId: string) => {
    if (!hotelId) return;
    await approvePlace.mutateAsync({
      hotelId,
      placeId,
    });
  };

  const handleReject = async (placeId: string) => {
    if (!hotelId) return;
    await rejectPlace.mutateAsync({
      hotelId,
      placeId,
    });
  };

  const handleToggleRecommended = async (placeId: string) => {
    if (!hotelId) return;
    const currentStatus = hotelPlaceMap.get(placeId);
    await toggleRecommended.mutateAsync({
      hotelId,
      placeId,
      recommended: !currentStatus?.recommended,
    });
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return {
    // Data
    places: filteredPlaces,
    isLoading,
    hotelPlaceMap,
    hotelInfo,
    hotelId,
    statistics,

    // Filter state
    maxDistance,
    setMaxDistance,
    priceLevel,
    setPriceLevel,
    actionFilter,
    setActionFilter,

    // Sorting state
    sortColumn,
    sortDirection,
    handleSort,

    // Modal state
    selectedPlace,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isMapModalOpen,
    setIsMapModalOpen,

    // Handlers
    handleRowClick,
    handleApprove,
    handleReject,
    handleToggleRecommended,
  };
}
