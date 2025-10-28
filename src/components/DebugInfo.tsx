import { useAuth } from "../hooks/useAuth";
import {
  useCurrentUserHotel,
  useCurrentUserHotelId,
} from "../hooks/useCurrentUserHotel";
import { useStaffManagement } from "../hooks/hotel-staff/staff-management/useStaffManagement";

export function DebugInfo() {
  const { user, loading: authLoading } = useAuth();
  const {
    data: userHotel,
    isLoading: hotelLoading,
    error: hotelError,
  } = useCurrentUserHotel();
  const {
    hotelId,
    isLoading: hotelIdLoading,
    error: hotelIdError,
  } = useCurrentUserHotelId();
  const {
    data: staffData,
    isLoading: staffLoading,
    error: staffError,
  } = useStaffManagement();

  // Log current values for debugging
return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="font-bold text-lg mb-3">🔍 Debug Info</h3>

      <div className="space-y-3 text-sm">
        <div>
          <strong>Auth State:</strong>
          <div className="ml-2 text-xs">
            <div>Loading: {authLoading ? "Yes" : "No"}</div>
            <div>User ID: {user?.id || "None"}</div>
            <div>Email: {user?.email || "None"}</div>
            <div>Role: {user?.role || "None"}</div>
          </div>
        </div>

        <div>
          <strong>Hotel Info:</strong>
          <div className="ml-2 text-xs">
            <div>Loading: {hotelLoading ? "Yes" : "No"}</div>
            <div>Hotel ID: {userHotel?.hotelId || "None"}</div>
            <div>Hotel Name: {userHotel?.hotel?.name || "None"}</div>
            <div>Position: {userHotel?.position || "None"}</div>
            <div>Department: {userHotel?.department || "None"}</div>
            <div>Error: {hotelError?.message || "None"}</div>
          </div>
        </div>

        <div>
          <strong>Hotel ID Hook:</strong>
          <div className="ml-2 text-xs">
            <div>Loading: {hotelIdLoading ? "Yes" : "No"}</div>
            <div>Hotel ID: {hotelId || "None"}</div>
            <div>Error: {hotelIdError?.message || "None"}</div>
          </div>
        </div>

        <div>
          <strong>Staff Data:</strong>
          <div className="ml-2 text-xs">
            <div>Loading: {staffLoading ? "Yes" : "No"}</div>
            <div>Staff Count: {staffData?.length || 0}</div>
            <div>Error: {staffError?.message || "None"}</div>
            <div>
              Sample Data:{" "}
              {staffData?.[0]
                ? JSON.stringify(staffData[0], null, 2).substring(0, 100) +
                  "..."
                : "None"}
            </div>
          </div>
        </div>

        <div>
          <strong>Local Storage:</strong>
          <div className="ml-2 text-xs">
            <div>
              Supabase Keys:{" "}
              {
                Object.keys(localStorage).filter((k) => k.includes("supabase"))
                  .length
              }
            </div>
            <div>
              Auth Token:{" "}
              {localStorage.getItem("supabase.auth.token")
                ? "Present"
                : "Missing"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
