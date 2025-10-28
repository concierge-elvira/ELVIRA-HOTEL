// Hotel-specific approved third-party places (approved_third_party_places table)
export {
  useThirdPartyPlaces as useHotelApprovedPlaces,
  useCurrentHotelThirdPartyPlaces,
  useThirdPartyPlacesByType,
  useCreateThirdPartyPlace,
  useUpdateThirdPartyPlace,
  useDeleteThirdPartyPlace as useDeleteApprovedThirdPartyPlace,
  useToggleThirdPartyPlaceRecommended,
} from "./third-party-places/useThirdPartyPlaces";

// Google Places API integration
export { useFetchAndStoreGooglePlaces } from "./google-places";

// Third-party places data (cached Google Places data - ALL places)
export {
  useThirdPartyPlaces,
  useThirdPartyPlaceByGoogleId,
  useSearchThirdPartyPlaces,
  useNearbyThirdPartyPlaces,
  useDeleteThirdPartyPlace,
  useRefreshThirdPartyPlace,
} from "./thirdparty-places";

// Approved third-party places (filtered by elvira_approved = true)
export {
  useApprovedThirdPartyPlaces,
  useApprovedPlaceByGoogleId,
  useSearchApprovedPlaces,
  useNearbyApprovedPlaces,
  useApprovedPlacesStats,
} from "./thirdparty-places";

// Hotel-specific place relationships (hotel_thirdparty_places junction table)
export {
  useHotelPlaces,
  useHotelApprovedPlaces as useHotelApprovedThirdPartyPlaces,
  useHotelRecommendedPlaces,
  useApproveHotelPlace,
  useRejectHotelPlace,
  useToggleHotelRecommended,
} from "./hotel-places";
