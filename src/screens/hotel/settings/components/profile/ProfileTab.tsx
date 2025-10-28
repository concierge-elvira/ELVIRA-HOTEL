import {
  useAuth,
  useHotelId,
  useHotelProfile,
  useCurrentUserHotel,
} from "../../../../../hooks";

export function ProfileTab() {
  const { user } = useAuth();
  const hotelId = useHotelId();
  const { data: hotel, isLoading: hotelLoading } = useHotelProfile(
    hotelId || undefined
  );
  const { data: currentUser } = useCurrentUserHotel();

  if (hotelLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hotel Name Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <svg
              className="w-8 h-8 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Hotel Name</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {hotel?.name || "N/A"}
            </h2>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-sm text-gray-900 font-medium">
                  {hotel?.address || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="text-sm text-gray-900 font-medium">
                  {hotel?.city || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">ZIP Code</p>
                <p className="text-sm text-gray-900 font-medium">
                  {hotel?.zip_code || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="text-sm text-gray-900 font-medium">
                  {hotel?.country || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm text-gray-900 font-medium">
                  {hotel?.contact_email || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-sm text-gray-900 font-medium">
                  {hotel?.phone_number || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Reception Phone</p>
                <p className="text-sm text-gray-900 font-medium">
                  {hotel?.reception_phone || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <p className="text-sm text-gray-900 font-medium">
                  {hotel?.website || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Business</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Number of Rooms</p>
                <p className="text-sm text-gray-900 font-medium">
                  {hotel?.number_rooms || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Hotel ID</p>
                <p className="text-sm text-gray-900 font-medium break-all">
                  {hotel?.id || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-sm text-gray-900 font-medium">
                  {hotel?.created_at
                    ? new Date(hotel.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Stripe Account ID</p>
                <p className="text-sm text-gray-900 font-medium">
                  {hotel?.stripe_account_id ? (
                    <span className="text-emerald-600">Connected</span>
                  ) : (
                    <span className="text-gray-400 italic">Not specified</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Role Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Your Role</p>
            <p className="text-xl font-bold text-gray-900">
              {currentUser?.position
                ? `${currentUser.position}${
                    currentUser.department ? ` - ${currentUser.department}` : ""
                  }`
                : user?.role === "hotel"
                ? "Hotel Admin - Manager"
                : user?.role || "N/A"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-emerald-600 font-medium">
              {currentUser?.position || "Staff Member"}
            </span>
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {currentUser?.firstName?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase() ||
                  "?"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
