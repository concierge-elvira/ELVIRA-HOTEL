import { useState } from "react";
import { Button, Badge, Input } from "../../../../components/ui";
import {
  useAllThirdPartyPlaces,
  useTogglePlaceApproval,
} from "../../../../hooks/third-party-management/thirdparty-places/useElviraPlacesManagement";

export function PlacesManagementTable() {
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterApproved, setFilterApproved] = useState<boolean | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: places = [], isLoading } = useAllThirdPartyPlaces({
    category: filterCategory || undefined,
    approved: filterApproved,
    search: searchQuery || undefined,
  });

  const toggleApproval = useTogglePlaceApproval();

  const handleToggleApproval = async (
    placeId: string,
    currentStatus: boolean
  ) => {
    try {
      await toggleApproval.mutateAsync({
        placeId,
        approved: !currentStatus,
      });
    } catch (error) {
alert("Failed to update approval status");
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, { icon: string; color: string }> = {
      gastronomy: { icon: "🍽️", color: "orange" },
      tours: { icon: "🗺️", color: "blue" },
      wellness: { icon: "💆", color: "pink" },
    };
    const badge = badges[category] || { icon: "📍", color: "gray" };
    return { ...badge, label: category };
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Third-Party Places Management
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Categories</option>
              <option value="gastronomy">🍽️ Gastronomy</option>
              <option value="tours">🗺️ Tours</option>
              <option value="wellness">💆 Wellness</option>
            </select>
          </div>

          {/* Approval Filter */}
          <div>
            <select
              value={
                filterApproved === undefined
                  ? ""
                  : filterApproved
                  ? "approved"
                  : "pending"
              }
              onChange={(e) =>
                setFilterApproved(
                  e.target.value === ""
                    ? undefined
                    : e.target.value === "approved"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Status</option>
              <option value="approved">✅ Approved</option>
              <option value="pending">⏳ Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No places found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or fetch new places from Google.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Place
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {places.map((place) => {
                const categoryBadge = getCategoryBadge(place.category);
                return (
                  <tr key={place.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {place.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {place.address}
                        </div>
                        {place.website && (
                          <a
                            href={place.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 hover:text-emerald-700 mt-1"
                          >
                            🔗 Website
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline">
                        {categoryBadge.icon} {categoryBadge.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {place.rating ? (
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">⭐</span>
                          <span className="text-sm font-medium text-gray-900">
                            {place.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({place.user_ratings_total || 0})
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {place.elvira_approved ? (
                        <Badge variant="success">✅ Approved</Badge>
                      ) : (
                        <Badge variant="warning">⏳ Pending</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(place.last_updated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant={place.elvira_approved ? "outline" : "primary"}
                        size="sm"
                        onClick={() =>
                          handleToggleApproval(place.id, place.elvira_approved)
                        }
                        disabled={toggleApproval.isPending}
                      >
                        {place.elvira_approved ? "Unapprove" : "Approve"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      {places.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Showing {places.length} place{places.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
