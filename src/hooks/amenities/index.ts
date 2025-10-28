export {
  useAmenities,
  useCurrentHotelAmenities,
  useCreateAmenity,
  useUpdateAmenity,
  useDeleteAmenity,
  useToggleAmenityStatus,
} from "./amenities/useAmenities";

export {
  useAmenityRequests,
  useCurrentHotelAmenityRequests,
  useCreateAmenityRequest,
  useUpdateAmenityRequest,
  useUpdateAmenityRequestStatus,
  useDeleteAmenityRequest,
  type AmenityRequestWithDetails,
} from "./amenity-requests/useAmenityRequests";
