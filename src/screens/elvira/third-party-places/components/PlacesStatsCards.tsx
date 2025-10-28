import { useThirdPartyPlacesStats } from "../../../../hooks/third-party-management/thirdparty-places/useElviraPlacesManagement";

export function PlacesStatsCards() {
  const { data: stats, isLoading } = useThirdPartyPlacesStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Total Places */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">Total Places</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
          </div>
          <div className="text-3xl">📍</div>
        </div>
      </div>

      {/* Approved */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">Approved</div>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.approved}
            </div>
          </div>
          <div className="text-3xl">✅</div>
        </div>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">Pending Review</div>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pending}
            </div>
          </div>
          <div className="text-3xl">⏳</div>
        </div>
      </div>

      {/* By Category */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div>
          <div className="text-sm text-gray-500 mb-3">By Category</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">🍽️ Gastronomy</span>
              <span className="font-semibold text-gray-900">
                {stats.by_category.gastronomy}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">🗺️ Tours</span>
              <span className="font-semibold text-gray-900">
                {stats.by_category.tours}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">💆 Wellness</span>
              <span className="font-semibold text-gray-900">
                {stats.by_category.wellness}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
