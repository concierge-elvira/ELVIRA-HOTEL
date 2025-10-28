/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * Hook to fit map bounds to include all markers
 */
export function useMapBounds(
  map: any | null,
  locations: Location[],
  padding: number = 50
) {
  const [bounds, setBounds] = useState<Bounds | null>(null);

  useEffect(() => {
    if (!map || !locations || locations.length === 0) return;

    const googleBounds = new (window as any).google.maps.LatLngBounds();

    locations.forEach((location) => {
      googleBounds.extend(
        new (window as any).google.maps.LatLng(location.lat, location.lng)
      );
    });

    map.fitBounds(googleBounds, padding);

    setBounds({
      north: googleBounds.getNorthEast().lat(),
      south: googleBounds.getSouthWest().lat(),
      east: googleBounds.getNorthEast().lng(),
      west: googleBounds.getSouthWest().lng(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, locations.length, padding]); // Only depend on length, not the array itself

  return bounds;
}
