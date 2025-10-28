import { useState } from "react";
import { Button } from "../../components/ui";
import { FetchGooglePlacesModal } from "../hotel/third-party-management/components";
import {
  PlacesStatsCards,
  PlacesManagementTable,
} from "./third-party-places/components";

export function ElviraDashboard() {
  const [isFetchModalOpen, setIsFetchModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    "gastronomy" | "tours" | "wellness"
  >("gastronomy");

  const handleOpenFetchModal = (
    category: "gastronomy" | "tours" | "wellness"
  ) => {
    setSelectedCategory(category);
    setIsFetchModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Elvira System</h1>
      <p className="text-gray-600 mb-8">Access Elvira management interface.</p>

      {/* Stats Cards */}
      <PlacesStatsCards />

      {/* Fetch Google Places Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center mb-6">
          <svg
            className="w-5 h-5 text-emerald-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Fetch New Places from Google
            </h2>
            <p className="text-sm text-gray-500">
              Add new third-party places to the database
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gastronomy */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
            <div className="flex items-center mb-3">
              <svg
                className="w-6 h-6 text-orange-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
              <h3 className="font-medium text-gray-900">Gastronomy</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Restaurants, cafes, bars, and bakeries
            </p>
            <Button
              variant="outline"
              onClick={() => handleOpenFetchModal("gastronomy")}
              className="w-full"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Fetch Places
            </Button>
          </div>

          {/* Tours */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
            <div className="flex items-center mb-3">
              <svg
                className="w-6 h-6 text-blue-600 mr-2"
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
              <h3 className="font-medium text-gray-900">Tours</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Travel agencies and tourist attractions
            </p>
            <Button
              variant="outline"
              onClick={() => handleOpenFetchModal("tours")}
              className="w-full"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Fetch Places
            </Button>
          </div>

          {/* Wellness */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
            <div className="flex items-center mb-3">
              <svg
                className="w-6 h-6 text-pink-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="font-medium text-gray-900">Wellness</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Gyms, spas, and beauty salons
            </p>
            <Button
              variant="outline"
              onClick={() => handleOpenFetchModal("wellness")}
              className="w-full"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Fetch Places
            </Button>
          </div>
        </div>
      </div>

      {/* Places Management Table */}
      <PlacesManagementTable />

      {/* Fetch Modal */}
      <FetchGooglePlacesModal
        isOpen={isFetchModalOpen}
        onClose={() => setIsFetchModalOpen(false)}
        placeType={selectedCategory}
      />
    </div>
  );
}
