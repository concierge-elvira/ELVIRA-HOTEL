import { useMemo, useState } from "react";
import {
  Table,
  type TableColumn,
  LoadingState,
  ErrorState,
  Pagination,
} from "../index";
import { usePagination } from "../../../hooks";

interface DataTableProps<
  TData extends Record<string, unknown>,
  TRawData = TData
> {
  // Data fetching
  data: TRawData[] | undefined;
  isLoading: boolean;
  error: Error | null;

  // Table configuration
  columns: TableColumn<TData>[];

  // Search
  searchValue?: string;
  searchFields?: (keyof TData)[];
  searchPlaceholder?: string;

  // Transformation
  transformData?: (data: TRawData[]) => TData[];

  // Messages
  emptyMessage?: string;
  loadingMessage?: string;
  errorTitle?: string;

  // Summary
  showSummary?: boolean;
  summaryLabel?: string;

  // Pagination
  showPagination?: boolean;
  itemsPerPage?: number;

  // Row click handler
  onRowClick?: (row: TData) => void;
}
/**
 * Generic data table component that handles:
 * - Loading and error states
 * - Search filtering across multiple fields
 * - Data transformation
 * - Summary display
 */
export function DataTable<
  TData extends Record<string, unknown>,
  TRawData = TData
>({
  data,
  isLoading,
  error,
  columns,
  searchValue = "",
  searchFields = [],
  searchPlaceholder,
  transformData,
  emptyMessage = "No data found.",
  loadingMessage = "Loading data...",
  errorTitle = "Failed to load data",
  showSummary = false,
  summaryLabel = "Total",
  showPagination = false,
  itemsPerPage = 10,
  onRowClick,
}: DataTableProps<TData, TRawData>) {
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Transform and filter data
  const processedData = useMemo(() => {
    if (!data) return [];

    // Apply custom transformation if provided
    let processed: TData[] = transformData
      ? transformData(data)
      : (data as unknown as TData[]);

    // Apply search filter
    if (searchValue && searchFields.length > 0) {
      const searchLower = searchValue.toLowerCase();
      processed = processed.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    return processed;
  }, [data, searchValue, searchFields, transformData]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortColumn) return processedData;

    return [...processedData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Convert to strings for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      // Try to parse as numbers if possible
      const aNum = parseFloat(aStr);
      const bNum = parseFloat(bStr);

      let comparison = 0;
      if (!isNaN(aNum) && !isNaN(bNum)) {
        // Numeric comparison
        comparison = aNum - bNum;
      } else {
        // String comparison
        comparison = aStr.localeCompare(bStr);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [processedData, sortColumn, sortDirection]);

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Apply pagination if enabled
  const pagination = usePagination<TData>({
    data: sortedData,
    itemsPerPage,
  });
  const displayData = showPagination ? pagination.paginatedData : sortedData;

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-6">
        <LoadingState message={loadingMessage} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-6">
        <ErrorState
          title={errorTitle}
          message={error.message || "Please try again later."}
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Search results info */}
      {searchValue && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {searchPlaceholder && `Searching for: "${searchValue}" • `}
            {processedData.length} result{processedData.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        data={displayData}
        emptyMessage={
          searchValue
            ? `No results found matching "${searchValue}"`
            : emptyMessage
        }
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        disablePagination={true}
        onRowClick={onRowClick}
      />

      {/* Manual Pagination */}
      {showPagination && sortedData.length > 0 && (
        <div className="bg-white rounded-b-3xl border-t border-gray-200">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setCurrentPage}
            totalItems={sortedData.length}
            itemsPerPage={pagination.itemsPerPage}
            onItemsPerPageChange={pagination.setItemsPerPage}
          />
        </div>
      )}

      {/* Summary */}
      {showSummary && !searchValue && sortedData.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {summaryLabel}: {sortedData.length} item
          {sortedData.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
