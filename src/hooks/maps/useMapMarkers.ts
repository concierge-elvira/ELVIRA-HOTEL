/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface MarkerData {
  id: string;
  position: Location;
  title?: string;
  icon?: string | any;
  onClick?: () => void;
}

/**
 * Hook to manage multiple markers on a Google Map
 */
export function useMapMarkers(map: any | null, markers: MarkerData[]) {
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!map) return;

    const currentMarkers = markersRef.current;

    // Remove markers that are no longer in the list
    const currentIds = new Set(markers.map((m) => m.id));
    currentMarkers.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.setMap(null);
        currentMarkers.delete(id);
      }
    });

    // Add or update markers
    markers.forEach((markerData) => {
      let marker = currentMarkers.get(markerData.id);

      if (!marker) {
        // Create new marker
        marker = new (window as any).google.maps.Marker({
          position: markerData.position,
          map: map,
          title: markerData.title,
          icon: markerData.icon,
        });

        if (markerData.onClick) {
          marker.addListener("click", markerData.onClick);
        }

        currentMarkers.set(markerData.id, marker);
      } else {
        // Update existing marker
        marker.setPosition(markerData.position);
        if (markerData.title) marker.setTitle(markerData.title);
        if (markerData.icon) marker.setIcon(markerData.icon);
      }
    });

    // Cleanup function
    return () => {
      currentMarkers.forEach((marker) => {
        marker.setMap(null);
      });
      currentMarkers.clear();
    };
  }, [map, markers]);

  return markersRef.current;
}
