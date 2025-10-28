import { useMemo } from "react";
import {
  GoogleMap,
  type MapMarker,
} from "../../../../components/maps/GoogleMap";
import { MapLegend } from "../../../../components/maps/controls/MapLegend";
import {
  createHotelMarkerIcon,
  createPlaceMarkerIcon,
} from "../../../../components/maps/markers/MarkerIcons";
import { useCurrentUserHotel } from "../../../../hooks/useCurrentUserHotel";

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  hotel_approved?: boolean;
  hotel_recommended?: boolean;
}

interface ThirdPartyMapViewProps {
  places: Place[];
  category?: string;
  onPlaceClick?: (place: Place) => void;
}

export function ThirdPartyMapView({
  places,
  category,
  onPlaceClick,
}: ThirdPartyMapViewProps) {
  const { data: hotelData } = useCurrentUserHotel();
  const hotel = hotelData?.hotel;

  // Hotel location as center
  const hotelLocation = useMemo(() => {
    if (hotel?.latitude && hotel?.longitude) {
      return {
        lat: hotel.latitude,
        lng: hotel.longitude,
      };
    }
    // Default to Munich if no hotel location
    return { lat: 48.1351, lng: 11.582 };
  }, [hotel]);

  // Create markers for places
  const placeMarkers: MapMarker[] = useMemo(() => {
    return places.map((place) => ({
      id: place.id,
      position: {
        lat: place.latitude,
        lng: place.longitude,
      },
      title: place.name,
      icon: createPlaceMarkerIcon(
        place.category,
        place.hotel_approved || false,
        place.hotel_recommended || false
      ),
      onClick: () => {
        if (onPlaceClick) {
          onPlaceClick(place);
        }
      },
    }));
  }, [places, onPlaceClick]);

  // Create hotel marker
  const hotelMarker: MapMarker = useMemo(() => {
    return {
      id: "hotel",
      position: hotelLocation,
      title: hotel?.name || "Your Hotel",
      icon: createHotelMarkerIcon(),
    };
  }, [hotelLocation, hotel]);

  // Combine all markers
  const allMarkers = useMemo(() => {
    return [hotelMarker, ...placeMarkers];
  }, [hotelMarker, placeMarkers]);

  // Legend items
  const legendItems = useMemo(() => {
    const items = [
      { label: "Your Hotel", color: "#10b981", icon: "star" as const },
      { label: "Recommended", color: "#eab308", icon: "pin" as const },
    ];

    // Add category-specific colors based on the current view
    if (!category || category === "gastronomy") {
      items.push({
        label: "Gastronomy",
        color: "#a855f7",
        icon: "pin" as const,
      });
    }
    if (!category || category === "tours") {
      items.push({ label: "Tours", color: "#3b82f6", icon: "pin" as const });
    }
    if (!category || category === "wellness") {
      items.push({ label: "Wellness", color: "#ec4899", icon: "pin" as const });
    }

    // Add pending/not approved indicator
    items.push({
      label: "Pending Review",
      color: "#9ca3af",
      icon: "pin" as const,
    });

    return items;
  }, [category]);

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        center={hotelLocation}
        zoom={13}
        markers={allMarkers}
        fitBounds={places.length > 0}
        className="w-full h-full rounded-lg"
      />

      {/* Legend - positioned to not block map controls */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-lg shadow-lg">
          <MapLegend items={legendItems} title="Map Legend" />
        </div>
      </div>

      {/* Place count info */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md px-4 py-2 z-10">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{places.length}</span>{" "}
          {category ? category : "places"} shown
        </p>
      </div>
    </div>
  );
}
