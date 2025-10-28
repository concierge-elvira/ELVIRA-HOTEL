import { useMemo } from "react";
import { Table } from "../../../../../components/ui";
import { FilterPanel, PlaceDetailsModal, MapViewModal } from "../../components";
import {
  StatCard,
  StatCardsGrid,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
} from "../../../../../components/shared/stat-cards";
import { usePlacesTable } from "../hooks/usePlacesTable";
import { createPlaceColumns } from "../utils/placeTableColumns";

type Category = "gastronomy" | "tours" | "wellness";

interface PlacesTableProps {
  category: Category;
  searchValue: string;
  title: string;
  description: string;
  emptyMessage?: string;
}

/**
 * Shared table component for displaying third-party places
 * Used by gastronomy, tours, and wellness tabs
 */
export function PlacesTable({
  category,
  searchValue,
  title,
  description,
  emptyMessage,
}: PlacesTableProps) {
  const {
    // Data
    places,
    isLoading,
    hotelPlaceMap,
    hotelInfo,
    hotelId,
    statistics,

    // Filter state
    maxDistance,
    setMaxDistance,
    priceLevel,
    setPriceLevel,
    actionFilter,
    setActionFilter,

    // Sorting state
    sortColumn,
    sortDirection,
    handleSort,

    // Modal state
    selectedPlace,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isMapModalOpen,
    setIsMapModalOpen,

    // Handlers
    handleRowClick,
    handleApprove,
    handleReject,
    handleToggleRecommended,
  } = usePlacesTable({ category, searchValue });

  // Create table columns
  const columns = useMemo(
    () =>
      createPlaceColumns({
        hotelPlaceMap,
        hotelId,
        onApprove: handleApprove,
        onReject: handleReject,
        onToggleRecommended: handleToggleRecommended,
      }),
    [
      hotelPlaceMap,
      hotelId,
      handleApprove,
      handleReject,
      handleToggleRecommended,
    ]
  );

  return (
    <div>
      {/* Statistics Cards */}
      <div className="mb-6">
        <StatCardsGrid columns={4}>
          <StatCard
            title="Total Places"
            value={statistics.total}
            icon={<MapPinIcon className="w-6 h-6 text-gray-600" />}
          />
          <StatCard
            title="Approved"
            value={statistics.approved}
            icon={<CheckCircleIcon className="w-6 h-6 text-emerald-600" />}
            variant="primary"
          />
          <StatCard
            title="Recommended"
            value={statistics.recommended}
            icon={
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            }
            variant="warning"
          />
          <StatCard
            title="Pending Review"
            value={statistics.pending}
            icon={<ClockIcon className="w-6 h-6 text-orange-600" />}
            variant="warning"
          />
        </StatCardsGrid>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      {/* Filter Panel */}
      <div className="mb-6">
        <FilterPanel
          distance={maxDistance}
          onDistanceChange={setMaxDistance}
          hasHotelLocation={
            !!(hotelInfo?.hotel?.latitude && hotelInfo?.hotel?.longitude)
          }
          onMapClick={() => setIsMapModalOpen(true)}
          priceLevel={priceLevel}
          onPriceLevelChange={setPriceLevel}
          action={actionFilter}
          onActionChange={setActionFilter}
        />
      </div>

      {/* Search Info */}
      {searchValue && (
        <div className="mb-4 text-sm text-gray-600">
          Showing results for:{" "}
          <span className="font-medium">"{searchValue}"</span>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        data={places}
        loading={isLoading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage={
          searchValue
            ? "No results found. Try a different search term."
            : emptyMessage || `No ${category} places available yet.`
        }
        itemsPerPage={10}
        onRowClick={handleRowClick}
      />

      {/* Details Modal */}
      <PlaceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        place={selectedPlace}
        hotelPlaceMap={hotelPlaceMap}
        hotelId={hotelId}
        onApprove={handleApprove}
        onReject={handleReject}
        onToggleRecommended={handleToggleRecommended}
      />

      {/* Map View Modal */}
      <MapViewModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        places={places}
        category={category}
        onPlaceClick={handleRowClick}
      />
    </div>
  );
}
