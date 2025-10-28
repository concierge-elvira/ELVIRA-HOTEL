import { Modal } from "../../../../components/ui/modals";
import { RecommendedToggle } from "../../../../components/ui";

// Type definition for third party place
interface ThirdPartyPlace {
  id: string;
  google_place_id: string;
  name: string;
  formatted_address: string | null;
  vicinity: string | null;
  latitude: number | null;
  longitude: number | null;
  formatted_phone_number: string | null;
  international_phone_number: string | null;
  website: string | null;
  google_maps_url: string | null;
  rating: number | null;
  user_ratings_total: number | null;
  price_level: number | null;
  types: string[] | null;
  category: string | null;
  business_status: string | null;
  opening_hours: unknown;
  photo_reference: string | null;
  photos: unknown;
  reviews: unknown;
  elvira_approved: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

interface Photo {
  photo_reference: string;
  height?: number;
  width?: number;
}

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description?: string;
}

interface PlaceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: ThirdPartyPlace | null;
  hotelPlaceMap?: Map<string, { approved: boolean; recommended: boolean }>;
  hotelId?: string | null;
  onApprove?: (placeId: string) => void;
  onReject?: (placeId: string) => void;
  onToggleRecommended?: (placeId: string) => void;
}

export function PlaceDetailsModal({
  isOpen,
  onClose,
  place,
  hotelPlaceMap,
  hotelId,
  onApprove,
  onReject,
  onToggleRecommended,
}: PlaceDetailsModalProps) {
  if (!place) return null;

  // Parse photos from JSONB - handle multiple possible structures
  const photos = (() => {
    if (!place.photos) return [];

    // If photos is an array
    if (Array.isArray(place.photos)) {
      return place.photos;
    }

    // If photos is an object with array
    if (typeof place.photos === "object") {
      const photosObj = place.photos as Record<string, unknown>;
      if (Array.isArray(photosObj)) return photosObj;
      if (photosObj.photos && Array.isArray(photosObj.photos))
        return photosObj.photos;
    }

    return [];
  })();

  // Parse reviews from JSONB
  const reviews =
    typeof place.reviews === "object" && place.reviews
      ? (place.reviews as Review[])
      : [];

  // Get the primary photo reference if available
  const primaryPhoto =
    place.photo_reference ||
    (photos[0] as Record<string, unknown>)?.photo_reference;

  // Helper function to get photo URL
  const getPhotoUrl = (photoRef: string | unknown): string | null => {
    if (!photoRef) return null;

    // If it's already a full URL, return it
    if (typeof photoRef === "string") {
      if (photoRef.startsWith("http")) {
        return photoRef;
      }
      // Otherwise, it's a reference ID, build the URL
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${
        import.meta.env.VITE_GOOGLE_PLACES_API_KEY
      }`;
    }

    return null;
  };

  // Get unique photos (avoid duplicates if primary photo is in the array)
  const uniquePhotos = photos.filter((photo: unknown) => {
    const photoObj = photo as Record<string, unknown>;
    const photoRef = photoObj.photo_reference || photoObj.photoRef || photo;
    const photoUrl = getPhotoUrl(photoRef);
    const primaryUrl = getPhotoUrl(primaryPhoto);
    return photoUrl !== primaryUrl;
  });

  // Total available photos
  const totalPhotos = primaryPhoto
    ? 1 + uniquePhotos.length
    : uniquePhotos.length;
  const photosToShow = primaryPhoto
    ? uniquePhotos.slice(0, 2)
    : uniquePhotos.slice(0, 3);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={place.name}
      zIndex="z-[60]"
    >
      <div className="space-y-4">
        {/* Photos Section - Single large photo if only one, grid if multiple */}
        {(primaryPhoto || (photos && photos.length > 0)) && (
          <div
            className={totalPhotos === 1 ? "w-full" : "grid grid-cols-3 gap-2"}
          >
            {/* Show primary photo first if available */}
            {primaryPhoto && getPhotoUrl(primaryPhoto) && (
              <div
                className={`${
                  totalPhotos === 1 ? "aspect-video" : "aspect-video"
                } rounded-lg overflow-hidden bg-gray-100 ${
                  totalPhotos === 1 ? "col-span-full" : ""
                }`}
              >
                <img
                  src={getPhotoUrl(primaryPhoto) || ""}
                  alt={`${place.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.display = "none";
                    }
                  }}
                />
              </div>
            )}

            {/* Show additional photos from array */}
            {photosToShow.map((photo: unknown, index: number) => {
              const photoObj = photo as Record<string, unknown>;
              const photoRef =
                photoObj.photo_reference || photoObj.photoRef || photo;
              const photoUrl = getPhotoUrl(photoRef);

              if (!photoUrl) return null;

              return (
                <div
                  key={index}
                  className="aspect-video rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={photoUrl}
                    alt={`${place.name} - ${index + 2}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      if (parent) {
                        parent.style.display = "none";
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Basic Information - Compact Grid */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          <InfoItem label="Category" value={place.category} />
          <InfoItem
            label="Status"
            value={
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  place.business_status === "OPERATIONAL"
                    ? "bg-green-100 text-green-800"
                    : place.business_status === "CLOSED_TEMPORARILY"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {place.business_status || "Unknown"}
              </span>
            }
          />
          {hotelPlaceMap &&
            hotelId &&
            onApprove &&
            onReject &&
            onToggleRecommended && (
              <InfoItem
                label="Actions"
                value={(() => {
                  const hotelStatus = hotelPlaceMap.get(place.id);
                  const isApproved = hotelStatus?.approved || false;
                  const isRecommended = hotelStatus?.recommended || false;

                  return (
                    <div className="flex items-center gap-2">
                      {/* Approve/Reject Button */}
                      {!isApproved ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onApprove(place.id);
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onReject(place.id);
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                        >
                          Reject
                        </button>
                      )}

                      {/* Recommend Toggle */}
                      {isApproved && (
                        <RecommendedToggle
                          isRecommended={isRecommended}
                          onToggle={() => onToggleRecommended(place.id)}
                          disabled={false}
                        />
                      )}
                    </div>
                  );
                })()}
              />
            )}
          {place.rating && (
            <InfoItem
              label="Rating"
              value={
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-yellow-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium text-sm">{place.rating}</span>
                  {place.user_ratings_total && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({place.user_ratings_total})
                    </span>
                  )}
                </div>
              }
            />
          )}
          {place.price_level !== null && (
            <InfoItem
              label="Price Level"
              value={"$".repeat(place.price_level)}
            />
          )}

          {/* Address */}
          {place.formatted_address && (
            <InfoItem
              label="Address"
              value={place.formatted_address}
              fullWidth
            />
          )}

          {/* Website - Prominent Display */}
          {place.website && (
            <InfoItem
              label="Website"
              value={
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center"
                >
                  Visit Website
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              }
              fullWidth
            />
          )}
        </div>

        {/* Tags - Compact */}
        {place.types &&
          Array.isArray(place.types) &&
          place.types.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {place.types.slice(0, 5).map((type: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"
                >
                  {type.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}

        {/* Reviews - Compact and Always Show */}
        {reviews && reviews.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">
              Comments
            </h4>
            <div className="space-y-2">
              {reviews.slice(0, 3).map((review: Review, index: number) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {review.author_name}
                    </span>
                    <div className="flex items-center">
                      <svg
                        className="w-3 h-3 text-yellow-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-medium">
                        {review.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {review.text}
                  </p>
                  {review.relative_time_description && (
                    <p className="text-xs text-gray-400">
                      {review.relative_time_description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coordinates - Compact */}
        {place.latitude && place.longitude && (
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xs text-gray-600 flex gap-4">
              <span>
                <span className="font-medium">Lat:</span> {place.latitude}
              </span>
              <span>
                <span className="font-medium">Lng:</span> {place.longitude}
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Helper component for info items
interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

function InfoItem({ label, value, fullWidth = false }: InfoItemProps) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <dt className="text-xs font-medium text-gray-500 mb-1">{label}</dt>
      <dd className="text-sm text-gray-900">{value || "-"}</dd>
    </div>
  );
}
