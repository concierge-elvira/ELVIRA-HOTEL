/**
 * Amenity Requests Service
 *
 * Handles amenity request submissions to the database
 */

import { getGuestSupabaseClient } from "../guestSupabase";
import { getGuestSession } from "./guestAuth";

export interface CreateAmenityRequestData {
  amenityId: string;
  requestDate: string;
  preferredTime?: string;
  specialInstructions?: string;
}

/**
 * Create a new amenity request
 */
export async function createAmenityRequest(
  data: CreateAmenityRequestData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getGuestSupabaseClient();
    const session = getGuestSession();

    console.log("=== CREATE AMENITY REQUEST DEBUG ===");
    console.log("Session:", session);
    console.log("Request data:", data);

    if (!session) {
      console.error("❌ No session found");
      return { success: false, error: "Not authenticated" };
    }

    // Combine date and time if time is provided
    let requestTime = null;
    if (data.preferredTime) {
      requestTime = data.preferredTime;
    }

    const insertData = {
      guest_id: session.guestData.id,
      hotel_id: session.guestData.hotel_id,
      amenity_id: data.amenityId,
      request_date: data.requestDate,
      request_time: requestTime,
      special_instructions: data.specialInstructions || null,
      status: "pending",
    };

    console.log("📦 Data to insert:", insertData);

    // Check current user and JWT
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("👤 Current user:", user);

    if (user) {
      // Try to get the JWT to see the claims
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();
      console.log(
        "🔑 JWT claims:",
        authSession?.access_token ? "Token exists" : "No token"
      );

      // Decode JWT to see claims (this is just for debugging)
      if (authSession?.access_token) {
        try {
          const base64Url = authSession.access_token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );
          const claims = JSON.parse(jsonPayload);
          console.log("📋 JWT Payload:", {
            user_role: claims.user_role,
            sub: claims.sub,
            email: claims.email,
          });
        } catch (e) {
          console.log("Could not decode JWT:", e);
        }
      }
    } else {
      console.log("⚠️ No authenticated user found");
    }

    // Insert amenity request
    const { data: insertedData, error } = await supabase
      .from("amenity_requests")
      .insert(insertData)
      .select();

    if (error) {
      console.error("❌ [AmenityRequests] Error creating request:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      console.error("Error hint:", error.hint);
      return { success: false, error: error.message };
    }

    console.log("✅ Request created successfully:", insertedData);
    console.log("=== END DEBUG ===");

    return { success: true };
  } catch (error) {
    console.error("💥 [AmenityRequests] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
