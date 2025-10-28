/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import {
  useGoogleMaps,
  useMapInstance,
  useMapMarkers,
  useMapBounds,
} from "../../hooks/maps";
import { LoadingSpinner } from "../ui/states/LoadingSpinner";

interface Location {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  position: Location;
  title?: string;
  icon?: string | any;
  onClick?: () => void;
}

interface GoogleMapProps {
  center: Location;
  zoom?: number;
  markers?: MapMarker[];
  fitBounds?: boolean;
  className?: string;
  onMapLoad?: (map: any) => void;
}

export function GoogleMap({
  center,
  zoom = 13,
  markers = [],
  fitBounds = false,
  className = "w-full h-full",
  onMapLoad,
}: GoogleMapProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const { mapRef, map } = useMapInstance(isLoaded, { center, zoom });

  // Add markers to map
  useMapMarkers(map, markers);

  // Fit bounds to include all markers
  const locations = fitBounds
    ? [center, ...markers.map((m) => m.position)]
    : [];
  useMapBounds(map, locations, 80);

  // Callback when map is loaded - use useEffect to avoid calling setState during render
  useEffect(() => {
    if (map && onMapLoad) {
      onMapLoad(map);
    }
  }, [map, onMapLoad]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">Failed to load map</p>
          <p className="text-sm text-gray-600">
            {loadError.message || "Please check your connection and try again"}
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
}
