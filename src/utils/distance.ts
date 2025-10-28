/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Filter places by distance from a reference point
 * @param places - Array of places with latitude and longitude
 * @param refLat - Reference latitude (e.g., hotel latitude)
 * @param refLon - Reference longitude (e.g., hotel longitude)
 * @param maxDistance - Maximum distance in kilometers
 * @returns Filtered array of places within the distance
 */
export function filterPlacesByDistance<
  T extends { latitude: number | null; longitude: number | null }
>(places: T[], refLat: number, refLon: number, maxDistance: number): T[] {
  return places.filter((place) => {
    if (!place.latitude || !place.longitude) {
      return false;
    }

    const distance = calculateDistance(
      refLat,
      refLon,
      place.latitude,
      place.longitude
    );

    return distance <= maxDistance;
  });
}
