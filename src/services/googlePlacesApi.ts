/**
 * Google Places API Service
 * Handles all interactions with Google Places API
 */

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_URL =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const GOOGLE_PLACE_DETAILS_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";

export interface GooglePlaceType {
  value: string;
  label: string;
  types: string[];
}

/**
 * Available place types to search
 */
export const PLACE_TYPES: GooglePlaceType[] = [
  {
    value: "restaurant",
    label: "Restaurants",
    types: ["restaurant", "cafe", "bar"],
  },
  {
    value: "tourist_attraction",
    label: "Tourist Attractions",
    types: ["tourist_attraction", "museum", "art_gallery"],
  },
  {
    value: "gym",
    label: "Gyms & Fitness",
    types: ["gym", "stadium"],
  },
  {
    value: "spa",
    label: "Spas & Wellness",
    types: ["spa", "beauty_salon", "hair_care"],
  },
  {
    value: "travel_agency",
    label: "Travel Agencies",
    types: ["travel_agency"],
  },
  {
    value: "shopping",
    label: "Shopping",
    types: ["shopping_mall", "store", "clothing_store"],
  },
  {
    value: "entertainment",
    label: "Entertainment",
    types: ["movie_theater", "night_club", "casino"],
  },
];

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now?: boolean;
  };
  price_level?: number;
  business_status?: string;
}

export interface GooglePlaceDetails extends GooglePlaceResult {
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

interface NearbySearchParams {
  latitude: number;
  longitude: number;
  radius?: number;
  type?: string;
  keyword?: string;
}

/**
 * Search for nearby places using Google Places API
 */
export async function searchNearbyPlaces(
  params: NearbySearchParams
): Promise<GooglePlaceResult[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error("Google Places API key not configured");
  }

  const { latitude, longitude, radius = 5000, type, keyword } = params;

  const url = new URL(GOOGLE_PLACES_API_URL);
  url.searchParams.append("location", `${latitude},${longitude}`);
  url.searchParams.append("radius", radius.toString());
  url.searchParams.append("key", GOOGLE_PLACES_API_KEY);

  if (type) {
    url.searchParams.append("type", type);
  }

  if (keyword) {
    url.searchParams.append("keyword", keyword);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Google Places API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Google Places API error: ${data.status}`);
  }

  return data.results || [];
}

/**
 * Get detailed information about a specific place
 */
export async function getPlaceDetails(
  placeId: string
): Promise<GooglePlaceDetails> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error("Google Places API key not configured");
  }

  const url = new URL(GOOGLE_PLACE_DETAILS_URL);
  url.searchParams.append("place_id", placeId);
  url.searchParams.append("key", GOOGLE_PLACES_API_KEY);
  url.searchParams.append(
    "fields",
    "name,formatted_address,formatted_phone_number,international_phone_number,website,url,rating,user_ratings_total,reviews,photos,geometry,types,opening_hours,price_level,business_status"
  );

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Google Places API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(`Google Places API error: ${data.status}`);
  }

  return data.result;
}

/**
 * Get photo URL from photo reference
 */
export function getPhotoUrl(
  photoReference: string,
  maxWidth: number = 400
): string {
  if (!GOOGLE_PLACES_API_KEY) {
    return "";
  }

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
}

/**
 * Map Google place type to our category
 */
export function mapPlaceTypeToCategory(types: string[]): string {
  if (types.some((t) => ["restaurant", "cafe", "bar", "food"].includes(t))) {
    return "gastronomy";
  }
  if (
    types.some((t) =>
      [
        "tourist_attraction",
        "museum",
        "art_gallery",
        "point_of_interest",
      ].includes(t)
    )
  ) {
    return "tours";
  }
  if (types.some((t) => ["gym", "stadium"].includes(t))) {
    return "wellness";
  }
  if (types.some((t) => ["spa", "beauty_salon", "hair_care"].includes(t))) {
    return "wellness";
  }
  if (types.includes("travel_agency")) {
    return "tours";
  }
  if (
    types.some((t) => ["shopping_mall", "store", "clothing_store"].includes(t))
  ) {
    return "shopping";
  }
  if (
    types.some((t) => ["movie_theater", "night_club", "casino"].includes(t))
  ) {
    return "entertainment";
  }

  return "other";
}
