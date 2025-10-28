import { useState } from "react";
import { Modal, Button, Input } from "../../../../components/ui";
import { PLACE_TYPES } from "../../../../services/googlePlaces";
import { useFetchAndStoreGooglePlaces } from "../../../../hooks/third-party-management";

interface FetchGooglePlacesModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeType: "gastronomy" | "tours" | "wellness";
}

export function FetchGooglePlacesModal({
  isOpen,
  onClose,
  placeType,
}: FetchGooglePlacesModalProps) {
  const [latitude, setLatitude] = useState("48.1351");
  const [longitude, setLongitude] = useState("11.5820");
  const [radius, setRadius] = useState("5000");
  const [keyword, setKeyword] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const fetchPlaces = useFetchAndStoreGooglePlaces();

  const placeTypeConfig =
    PLACE_TYPES[placeType.toUpperCase() as keyof typeof PLACE_TYPES];

  const handleFetch = async () => {
    if (!latitude || !longitude) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const result = await fetchPlaces.mutateAsync({
        searchParams: {
          location: `${latitude},${longitude}`,
          radius: parseInt(radius),
          type: selectedType || placeTypeConfig.googleTypes[0],
          keyword: keyword || undefined,
        },
        category: placeTypeConfig.value,
      });

      alert(
        `Successfully processed ${result.total} places!\n` +
          `New: ${result.inserted}\n` +
          `Updated: ${result.updated}\n` +
          `Skipped (recent): ${result.skipped}`
      );

      onClose();
    } catch (error) {
alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleClose = () => {
    if (!fetchPlaces.isPending) {
      onClose();
    }
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        (error) => {
          alert("Error getting location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Fetch ${placeTypeConfig.label} from Google Places`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude *
            </label>
            <Input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="48.1351"
              disabled={fetchPlaces.isPending}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude *
            </label>
            <Input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="11.5820"
              disabled={fetchPlaces.isPending}
            />
          </div>
        </div>

        <div>
          <Button
            variant="outline"
            onClick={handleUseCurrentLocation}
            disabled={fetchPlaces.isPending}
            className="w-full"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Use Current Location
          </Button>
        </div>

        {/* Search Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Radius (meters)
          </label>
          <Input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            placeholder="5000"
            disabled={fetchPlaces.isPending}
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum radius: 50,000 meters (~31 miles)
          </p>
        </div>

        {/* Place Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specific Type (Optional)
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            disabled={fetchPlaces.isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All {placeTypeConfig.label}</option>
            {placeTypeConfig.googleTypes.map((type) => (
              <option key={type} value={type}>
                {type
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Keyword */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keyword (Optional)
          </label>
          <Input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., italian, luxury, etc."
            disabled={fetchPlaces.isPending}
          />
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>
                  Searches Google Places API for places near the specified
                  location
                </li>
                <li>Stores results in your database (status: pending)</li>
                <li>Skips places that already exist</li>
                <li>You can review and approve them after fetching</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={fetchPlaces.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleFetch}
            disabled={fetchPlaces.isPending || !latitude || !longitude}
          >
            {fetchPlaces.isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Fetching...
              </>
            ) : (
              "Fetch Places"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
