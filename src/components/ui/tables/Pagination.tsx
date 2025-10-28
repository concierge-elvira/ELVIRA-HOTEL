import { Button } from "../buttons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showInfo?: boolean;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showInfo = true,
  onItemsPerPageChange,
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  // Show pagination controls if we have the selector or multiple pages
  const showPaginationControls = totalPages > 1;
  const showSelector = onItemsPerPageChange && totalItems && totalItems > 10;

  // If nothing to show, return null
  if (!showPaginationControls && !showSelector) return null;

  const visiblePages = getVisiblePages();

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    if (onItemsPerPageChange) {
      // If "all" is selected, use total items as items per page
      const newItemsPerPage =
        value === "all" ? totalItems || 999999 : parseInt(value);
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center gap-6">
        {showInfo && totalItems && itemsPerPage && (
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </div>
        )}

        {onItemsPerPageChange && totalItems && (
          <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm text-gray-700">
              Show:
            </label>
            <select
              id="items-per-page"
              value={
                itemsPerPage && itemsPerPage >= (totalItems || 0)
                  ? "all"
                  : itemsPerPage
              }
              onChange={handleItemsPerPageChange}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">See All</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {showPaginationControls && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {visiblePages.map((page, index) => (
              <span key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-sm text-gray-500">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                  >
                    {page}
                  </Button>
                )}
              </span>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
