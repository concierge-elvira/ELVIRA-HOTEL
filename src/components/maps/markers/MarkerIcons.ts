/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Creates a custom hotel marker icon
 */
export function createHotelMarkerIcon(): any {
  return {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    fillColor: "#10b981", // emerald-500
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale: 1.5,
    anchor: new (window as any).google.maps.Point(12, 22),
  };
}

/**
 * Creates a custom place marker icon with category-based colors
 * Priority: Recommended (yellow/gold star) > Approved (category color) > Not approved (gray)
 */
export function createPlaceMarkerIcon(
  category: string,
  isApproved: boolean = false,
  isRecommended: boolean = false
): any {
  let fillColor = "#9ca3af"; // gray-400 (not approved/pending)

  // If approved, use category colors
  if (isApproved) {
    if (category === "gastronomy") {
      fillColor = "#a855f7"; // purple-500
    } else if (category === "tours") {
      fillColor = "#3b82f6"; // blue-500
    } else if (category === "wellness") {
      fillColor = "#ec4899"; // pink-500
    } else {
      fillColor = "#10b981"; // emerald-500 (default approved)
    }
  }

  // Recommended places get yellow/gold color (highest priority)
  if (isRecommended) {
    fillColor = "#eab308"; // yellow-500 (gold)
  }

  return {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    fillColor,
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale: 1.2,
    anchor: new (window as any).google.maps.Point(12, 22),
  };
}

/**
 * Creates a numbered marker icon for multiple locations
 */
export function createNumberedMarkerIcon(
  number: number,
  color: string = "#3b82f6"
): any {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
        <path d="M20 0C11.7 0 5 6.7 5 15c0 11.3 15 35 15 35s15-23.7 15-35c0-8.3-6.7-15-15-15z" 
              fill="${color}" stroke="#fff" stroke-width="2"/>
        <circle cx="20" cy="15" r="8" fill="#fff"/>
        <text x="20" y="20" font-family="Arial" font-size="12" font-weight="bold" 
              text-anchor="middle" fill="${color}">${number}</text>
      </svg>
    `)}`,
    scaledSize: new (window as any).google.maps.Size(40, 50),
    anchor: new (window as any).google.maps.Point(20, 50),
  };
}
