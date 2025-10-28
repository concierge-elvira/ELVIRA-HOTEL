/**
 * Google Places API Service
 * Handles fetching data from Google Places API
 */

import { supabase } from "./supabase";

/**
 * Fetch Google Places API key from Supabase Vault or environment variable
 */
async function getGooglePlacesApiKey(): Promise<string> {
  // Try to get from Vault first
  try {
    const { data, error } = await supabase.rpc("vault_get_secret", {
      secret_name: "GOOGLE_PLACE_API",
    });

    if (!error && data) {
      return data;
    }
  } catch (vaultError) {}

  // Fallback to environment variable
  const envKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  if (envKey) {
    return envKey;
  }

  // If both fail, throw error
  throw new Error(
    "Google Places API key not found. Please add it to Vault as 'GOOGLE_PLACE_API' or set VITE_GOOGLE_PLACES_API_KEY in .env.local and restart the dev server"
  );
}

export interface GooglePlaceType {
  value: string;
  label: string;
  googleTypes: string[];
}

// Define place types we want to fetch
export const PLACE_TYPES: Record<string, GooglePlaceType> = {
  GASTRONOMY: {
    value: "gastronomy",
    label: "Gastronomy",
    googleTypes: ["restaurant", "cafe", "bar", "bakery", "meal_takeaway"],
  },
  TOURS: {
    value: "tours",
    label: "Tours & Excursions",
    googleTypes: ["travel_agency", "tourist_attraction", "point_of_interest"],
  },
  WELLNESS: {
    value: "wellness",
    label: "Wellness & Fitness",
    googleTypes: ["gym", "spa", "beauty_salon", "hair_care"],
  },
};

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now?: boolean;
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  types?: string[];
  vicinity?: string;
  business_status?: string;
  price_level?: number;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string;
  reviews?: Array<{
    author_name: string;
    author_url?: string;
    language?: string;
    profile_photo_url?: string;
    rating: number;
    relative_time_description?: string;
    text: string;
    time: number;
  }>;
}

export interface NearbySearchParams {
  location: string; // "lat,lng"
  radius: number; // in meters
  type: string;
  keyword?: string;
}

/**
 * Fetch nearby places from Google Places API using PlacesService
 * Supports pagination to fetch up to 60 results (3 pages of 20)
 */
export async function fetchNearbyPlaces(
  params: NearbySearchParams
): Promise<GooglePlaceResult[]> {
  return new Promise((resolve, reject) => {
    // Wait for Google Maps API to load
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      reject(
        new Error("Google Maps API not loaded. Please wait and try again.")
      );
      return;
    }

    // Create a temporary div for PlacesService (required by Google API)
    const tempDiv = document.createElement("div");
    const service = new window.google.maps.places.PlacesService(tempDiv);

    const [lat, lng] = params.location.split(",").map(Number);

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: params.radius,
      type: params.type,
      keyword: params.keyword,
    };
    let allResults: GooglePlaceResult[] = [];
    let pagesProcessed = 0;
    const maxPages = 3; // Google Places API supports up to 3 pages (60 results total)

    const fetchPage = (pageToken?: string) => {
      const pageRequest = pageToken ? { ...request, pageToken } : request;

      service.nearbySearch(
        pageRequest as any,
        (results, status, pagination) => {
          pagesProcessed++;
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            // Transform and add results
            const transformedResults: GooglePlaceResult[] = results.map(
              (place: any) => ({
                place_id: place.place_id,
                name: place.name,
                formatted_address: place.vicinity || place.formatted_address,
                geometry: place.geometry
                  ? {
                      location: {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                      },
                    }
                  : undefined,
                rating: place.rating,
                user_ratings_total: place.user_ratings_total,
                opening_hours: place.opening_hours
                  ? {
                      open_now: place.opening_hours.open_now,
                    }
                  : undefined,
                photos: place.photos?.map((photo: any) => ({
                  photo_reference: photo.getUrl ? photo.getUrl() : "",
                  height: photo.height,
                  width: photo.width,
                })),
                types: place.types,
                vicinity: place.vicinity,
                business_status: place.business_status,
                price_level: place.price_level,
              })
            );

            allResults = [...allResults, ...transformedResults];

            // Check if there are more pages and we haven't reached the limit
            if (pagination?.hasNextPage && pagesProcessed < maxPages) {
              // Google requires a delay before fetching the next page
              setTimeout(() => {
                pagination.nextPage();
              }, 2000); // 2 second delay as required by Google
            } else {
              resolve(allResults);
            }
          } else if (
            status ===
            window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
          ) {
            resolve(allResults.length > 0 ? allResults : []);
          } else {
            // If we have some results from previous pages, return those
            if (allResults.length > 0) {
              resolve(allResults);
            } else {
              reject(new Error(`Google Places API error: ${status}`));
            }
          }
        }
      );
    };

    // Start fetching from the first page
    fetchPage();
  });
}

/**
 * Fetch place details from Google Places API using PlacesService
 */
export async function fetchPlaceDetails(
  placeId: string
): Promise<GooglePlaceResult> {
  return new Promise((resolve, reject) => {
    // Wait for Google Maps API to load
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      reject(
        new Error("Google Maps API not loaded. Please wait and try again.")
      );
      return;
    }

    // Create a temporary div for PlacesService (required by Google API)
    const tempDiv = document.createElement("div");
    const service = new window.google.maps.places.PlacesService(tempDiv);

    const request = {
      placeId: placeId,
      fields: [
        "place_id",
        "name",
        "formatted_address",
        "geometry",
        "rating",
        "user_ratings_total",
        "opening_hours",
        "photos",
        "types",
        "vicinity",
        "business_status",
        "price_level",
        "formatted_phone_number",
        "international_phone_number",
        "website",
        "url",
        "reviews",
      ],
    };

    service.getDetails(request, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place
      ) {
        // Transform the result to match our interface
        const result: GooglePlaceResult = {
          place_id: place.place_id || placeId,
          name: place.name || "",
          formatted_address: place.formatted_address,
          geometry: place.geometry
            ? {
                location: {
                  lat: place.geometry.location?.lat() || 0,
                  lng: place.geometry.location?.lng() || 0,
                },
              }
            : undefined,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          opening_hours: place.opening_hours
            ? {
                open_now: place.opening_hours.open_now,
              }
            : undefined,
          photos: place.photos?.map((photo) => ({
            photo_reference: photo.getUrl
              ? photo.getUrl({ maxWidth: 400 })
              : "",
            height: photo.height || 0,
            width: photo.width || 0,
          })),
          types: place.types,
          vicinity: place.vicinity,
          business_status: place.business_status,
          price_level: place.price_level,
          formatted_phone_number: place.formatted_phone_number,
          international_phone_number: place.international_phone_number,
          website: place.website,
          url: place.url,
          reviews: place.reviews?.map((review) => ({
            author_name: review.author_name,
            author_url: review.author_url,
            language: review.language,
            profile_photo_url: review.profile_photo_url,
            rating: review.rating,
            relative_time_description: review.relative_time_description,
            text: review.text,
            time: review.time,
          })),
        };

        resolve(result);
      } else {
        reject(new Error(`Google Places API error: ${status}`));
      }
    });
  });
}

/**
 * Get photo URL from photo reference
 */
export async function getGooglePlacePhotoUrl(
  photoReference: string,
  maxWidth: number = 400
): Promise<string> {
  const apiKey = await getGooglePlacesApiKey();
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${apiKey}`;
}
